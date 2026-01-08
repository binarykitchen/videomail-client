import animitter from "animitter";
import AudioSample from "audio-sample";
import Frame from "canvas-to-buffer";
import { deserializeError } from "serialize-error";
import websocket from "websocket-stream";

import Constants from "../../constants";
import { Command, VideomailCommandArgs } from "../../types/command";
import { Dimension } from "../../types/dimension";
import { VideomailUserMediaReadyParams } from "../../types/events/params";
import { VideomailClientOptions } from "../../types/options";
import { RecordingStats } from "../../types/RecordingStats";
import Despot from "../../util/Despot";
import createError from "../../util/error/createError";
import VideomailError from "../../util/error/VideomailError";
import getBrowser from "../../util/getBrowser";
import calculateHeight from "../../util/html/dimensions/calculateHeight";
import calculateWidth from "../../util/html/dimensions/calculateWidth";
import getRatio from "../../util/html/dimensions/getRatio";
import useFullWidth from "../../util/html/dimensions/useFullWidth";
import hideElement from "../../util/html/hideElement";
import isHidden from "../../util/html/isHidden";
import showElement from "../../util/html/showElement";
import { isAudioEnabled } from "../../util/options/audio";
import pretty from "../../util/pretty";
import { UnloadParams } from "../container";
import Visuals from "../visuals";
import Replay from "./replay";
import UserMedia from "./userMedia";

// credits http://1lineart.kulaone.com/#/
const PIPE_SYMBOL = "°º¤ø,¸¸,ø¤º°`°º¤ø,¸,ø¤°º¤ø,¸¸,ø¤º°`°º¤ø,¸ ";

interface WriteStreamParams {
  frameNumber?: number;
  onFlushedCallback?: (params: WriteStreamParams) => void;
}

export interface StopParams {
  limitReached?: boolean;
}

interface PauseParams {
  event?: MouseEvent;
}

class Recorder extends Despot {
  private readonly visuals: Visuals;
  private readonly replay: Replay;

  private loop?: any;

  private originalAnimationFrameObject;

  private samplesCount = 0;
  private framesCount = 0;

  private recordingStats?: RecordingStats;

  private confirmedFrameNumber = 0;
  private confirmedSampleNumber = 0;

  private recorderElement?: HTMLVideoElement | undefined | null;
  private userMedia?: UserMedia;

  private userMediaTimeout?: number | undefined;
  private retryTimeout?: number | undefined;

  private frameProgress?: string | undefined;
  private sampleProgress?: string | undefined;

  private canvas?: HTMLCanvasElement | undefined;
  private ctx?: CanvasRenderingContext2D | undefined | null;

  private userMediaLoaded?: boolean | undefined;
  private userMediaLoading = false;
  private submitting = false;
  private unloaded?: boolean;
  private stopTime?: number | undefined;
  private stream?: websocket.WebSocketDuplex | undefined;
  private connecting = false;
  private connected = false;
  private blocking = false;
  private built = false;
  private key?: string | undefined;
  private waitingTime?: number | undefined;

  private pingInterval?: number | undefined;

  private frame?: Frame;

  private recordingBuffer?: Buffer | undefined;

  private facingMode: ConstrainDOMString;

  constructor(visuals: Visuals, replay: Replay, options: VideomailClientOptions) {
    super("Recorder", options);

    this.visuals = visuals;
    this.replay = replay;
    this.facingMode = options.video.facingMode;
  }

  private writeStream(buffer: Buffer, opts?: WriteStreamParams) {
    if (this.stream) {
      if (this.stream.destroyed) {
        // prevents https://github.com/binarykitchen/videomail.io/issues/393
        this.stopPings();

        const err = createError({
          message: "Already disconnected",
          explanation:
            "Sorry, connection to the server has been destroyed. Please reload.",
          options: this.options,
        });

        this.emit("ERROR", { err });
      } else {
        const onFlushedCallback = opts?.onFlushedCallback;

        try {
          this.stream.write(buffer, () => {
            if (!onFlushedCallback) {
              return;
            }

            try {
              onFlushedCallback(opts);
            } catch (exc) {
              const err = createError({
                message: "Failed to write stream buffer",
                explanation: `stream.write() failed because of ${pretty(exc)}`,
                options: this.options,
                exc,
              });

              this.emit("ERROR", { err });
            }
          });
        } catch (exc) {
          const err = createError({
            message: "Failed writing to server",
            explanation: `stream.write() failed because of ${pretty(exc)}`,
            options: this.options,
            exc,
          });

          this.emit("ERROR", { err });
        }
      }
    }
  }

  private sendPings() {
    this.pingInterval = window.setInterval(() => {
      this.options.logger.debug("Recorder: pinging...");
      this.writeStream(Buffer.from(""));
    }, this.options.timeouts.pingInterval);
  }

  private stopPings() {
    clearInterval(this.pingInterval);
  }

  private onAudioSample(audioSample: AudioSample) {
    this.samplesCount++;

    const audioBuffer = audioSample.toBuffer();

    /*
     * if (this.options.verbose) {
     *     this.options.logger.debug(
     *         'Sample #' + samplesCount + ' (' + audioBuffer.length + ' bytes):'
     *     )
     * }
     */

    this.writeStream(audioBuffer);
  }

  public show() {
    showElement(this.recorderElement);
  }

  private onUserMediaReady(params?: VideomailUserMediaReadyParams) {
    try {
      this.options.logger.debug(
        `Recorder: onUserMediaReady(${params ? pretty(params) : ""})`,
      );

      const switchingFacingMode = params?.switchingFacingMode;

      this.userMediaLoading = this.blocking = this.unloaded = this.submitting = false;
      this.userMediaLoaded = true;

      if (!switchingFacingMode) {
        this.loop = this.createLoop();
      }

      this.show();

      if (params?.recordWhenReady) {
        this.record();
      }

      this.emit("USER_MEDIA_READY", {
        switchingFacingMode: params?.switchingFacingMode,
        paused: this.isPaused(),
        recordWhenReady: params?.recordWhenReady,
      });
    } catch (exc) {
      this.emit("ERROR", { exc });
    }
  }

  private clearRetryTimeout() {
    if (!this.retryTimeout) {
      return;
    }

    this.options.logger.debug("Recorder: clearRetryTimeout()");

    window.clearTimeout(this.retryTimeout);
    this.retryTimeout = undefined;
  }

  private calculateFrameProgress() {
    return `${((this.confirmedFrameNumber / (this.framesCount || 1)) * 100).toFixed(2)}%`;
  }

  private calculateSampleProgress() {
    return `${((this.confirmedSampleNumber / (this.samplesCount || 1)) * 100).toFixed(2)}%`;
  }

  private updateOverallProgress() {
    /*
     * when progresses aren't initialized,
     * then do a first calculation to avoid `infinite` or `null` displays
     */

    this.frameProgress = this.calculateFrameProgress();

    if (isAudioEnabled(this.options)) {
      this.sampleProgress = this.calculateSampleProgress();
    }

    this.emit("PROGRESS", {
      frameProgress: this.frameProgress,
      sampleProgress: this.sampleProgress,
    });
  }

  private updateFrameProgress(args?: VideomailCommandArgs) {
    if (!args) {
      throw createError({
        message: "Arguments are missing for updating the frame progress",
        options: this.options,
      });
    } else if (!args.frame) {
      throw createError({
        message: "The frame number is missing",
        options: this.options,
      });
    }

    this.confirmedFrameNumber = args.frame;

    this.frameProgress = this.calculateFrameProgress();

    this.updateOverallProgress();
  }

  private updateSampleProgress(args?: VideomailCommandArgs) {
    if (!args) {
      throw createError({
        message: "Arguments are missing for updating the audio sample progress",
        options: this.options,
      });
    } else if (!args.sample) {
      throw createError({
        message: "The audio sample number is missing",
        options: this.options,
      });
    }

    this.confirmedSampleNumber = args.sample;

    this.sampleProgress = this.calculateSampleProgress();

    this.updateOverallProgress();
  }

  private preview(args?: VideomailCommandArgs) {
    if (!args) {
      throw createError({
        message: "Preview arguments are missing.",
        options: this.options,
      });
    }

    const hasAudio = this.samplesCount > 0;

    this.confirmedFrameNumber =
      this.confirmedSampleNumber =
      this.samplesCount =
      this.framesCount =
        0;

    this.sampleProgress = this.frameProgress = undefined;

    this.key = args.key;

    /*
     * We are not serving MP4 videos anymore due to licensing but are keeping code
     * for compatibility and documentation
     */
    if (args.mp4) {
      this.replay.setMp4Source(
        `${args.mp4 + Constants.SITE_NAME_LABEL}/${this.options.siteName}/videomail.mp4`,
        true,
      );
    }

    if (args.webm) {
      this.replay.setWebMSource(
        `${args.webm + Constants.SITE_NAME_LABEL}/${this.options.siteName}/videomail.webm`,
        true,
      );
    }

    this.hide();

    const widthDimension = this.getRecorderWidth(true);
    const heightDimension = this.getRecorderHeight(true);

    const duration = args.duration ?? -1;

    this.emit("PREVIEW", {
      key: this.key,
      width: widthDimension?.value,
      height: heightDimension?.value,
      hasAudio,
      duration,
    });

    // keep it for recording stats
    if (this.stopTime) {
      this.waitingTime = Date.now() - this.stopTime;
    }

    this.recordingStats ??= {};

    this.recordingStats.waitingTime = this.waitingTime;
  }

  private initSocket(cb?: () => void) {
    if (!this.connected) {
      this.connecting = true;

      this.emit("CONNECTING");

      // https://github.com/maxogden/websocket-stream#binary-sockets

      /*
       * we use query parameters here because we cannot set custom headers in web sockets,
       * see https://github.com/websockets/ws/issues/467
       */

      const url2Connect = `${this.options.socketUrl}?${encodeURIComponent(
        Constants.SITE_NAME_LABEL,
      )}=${encodeURIComponent(this.options.siteName)}`;

      this.options.logger.debug(`Recorder: initializing web socket to ${url2Connect}`);

      try {
        /*
         * websocket options cannot be set on client side, only on server, see
         * https://github.com/maxogden/websocket-stream/issues/116#issuecomment-296421077
         */
        this.stream = websocket(url2Connect, {
          perMessageDeflate: false,
          // see https://github.com/maxogden/websocket-stream/issues/117#issuecomment-298826011
          objectMode: true,
        });
      } catch (exc) {
        this.connecting = this.connected = false;

        const err = createError({
          message: "Failed to connect to server",
          explanation:
            "Please upgrade your browser. Your current version does not seem to support websockets.",
          options: this.options,
          exc,
        });

        this.emit("ERROR", { err });
      }

      if (this.stream) {
        // useful for debugging streams

        /*
         * if (!stream.originalEmit) {
         *   stream.originalEmit = stream.emit
         * }
         */

        /*
         * stream.emit = function (type) {
         *   if (stream) {
         *     this.options.logger.debug(PIPE_SYMBOL + 'Debugging stream event:', type)
         *     var args = Array.prototype.slice.call(arguments, 0)
         *     return stream.originalEmit.apply(stream, args)
         *   }
         * }
         */

        this.stream.on("close", (err) => {
          this.options.logger.debug(`${PIPE_SYMBOL}Stream has closed`);

          this.connecting = this.connected = false;

          if (err) {
            this.emit("ERROR", { err });
          } else if (this.userMediaLoaded) {
            this.initSocket();
          }
        });

        this.stream.on("connect", () => {
          this.options.logger.debug(`${PIPE_SYMBOL}Stream *connect* event emitted`);

          const isClosing = this.stream?.socket.readyState === WebSocket.CLOSING;

          if (!this.connected && !isClosing && !this.unloaded) {
            this.connected = true;
            this.connecting = this.unloaded = false;

            this.emit("CONNECTED");

            cb?.();
          }
        });

        this.stream.on("data", (data) => {
          this.options.logger.debug(`${PIPE_SYMBOL}Stream *data* event emitted`);

          let command;

          try {
            command = JSON.parse(data.toString());
          } catch (exc) {
            this.options.logger.debug(`Failed to parse command: ${exc}`);

            const err = createError({
              message: "Invalid server command",
              // toString() since https://github.com/binarykitchen/videomail.io/issues/288
              explanation: `Contact us asap. Bad command was ${data.toString()}. `,
              options: this.options,
              exc,
            });

            this.emit("ERROR", { err });
          } finally {
            this.executeCommand(command);
          }
        });

        this.stream.on("error", (err) => {
          this.options.logger.debug(
            `${PIPE_SYMBOL}Stream *error* event emitted: ${pretty(err)}`,
          );
        });

        // just experimental

        this.stream.on("drain", () => {
          this.options.logger.debug(
            `${PIPE_SYMBOL}Stream *drain* event emitted (should not happen!)`,
          );
        });

        this.stream.on("preend", () => {
          this.options.logger.debug(`${PIPE_SYMBOL}Stream *preend* event emitted`);
        });

        this.stream.on("end", () => {
          this.options.logger.debug(`${PIPE_SYMBOL}Stream *end* event emitted`);
        });

        this.stream.on("drain", () => {
          this.options.logger.debug(`${PIPE_SYMBOL}Stream *drain* event emitted`);
        });

        this.stream.on("pipe", () => {
          this.options.logger.debug(`${PIPE_SYMBOL}Stream *pipe* event emitted`);
        });

        this.stream.on("unpipe", () => {
          this.options.logger.debug(`${PIPE_SYMBOL}Stream *unpipe* event emitted`);
        });

        this.stream.on("resume", () => {
          this.options.logger.debug(`${PIPE_SYMBOL}Stream *resume* event emitted`);
        });

        this.stream.on("uncork", () => {
          this.options.logger.debug(`${PIPE_SYMBOL}Stream *uncork* event emitted`);
        });

        this.stream.on("readable", () => {
          this.options.logger.debug(`${PIPE_SYMBOL}Stream *preend* event emitted`);
        });

        this.stream.on("prefinish", () => {
          this.options.logger.debug(`${PIPE_SYMBOL}Stream *preend* event emitted`);
        });

        this.stream.on("finish", () => {
          this.options.logger.debug(`${PIPE_SYMBOL}Stream *preend* event emitted`);
        });
      }
    }
  }

  private showUserMedia() {
    /*
     * use connected flag to prevent this from happening
     * https://github.com/binarykitchen/videomail.io/issues/323
     */
    if (!this.connected) {
      return false;
    }

    const hidden = this.isHidden();

    if (!hidden) {
      return true;
    }

    const notifying = this.isNotifying();

    if (notifying) {
      return true;
    }

    return this.blocking;
  }

  private userMediaErrorCallback(err) {
    this.userMediaLoading = false;
    this.clearUserMediaTimeout();

    const characteristics = this.userMedia?.getCharacteristics();

    this.options.logger.debug(
      `Recorder: userMediaErrorCallback(), name: ${err.name}, message: ${err.message} and Webcam characteristics: ${characteristics ? pretty(characteristics) : "none"}`,
    );

    const errorListeners = Despot.getListeners("ERROR");

    if (errorListeners?.length) {
      if (err.name !== VideomailError.MEDIA_DEVICE_NOT_SUPPORTED) {
        const videomailError = createError({ err, options: this.options });
        this.emit("ERROR", { err: videomailError });
      } else {
        // do not emit but retry since MEDIA_DEVICE_NOT_SUPPORTED can be a race condition
        this.options.logger.debug(`Recorder: ignore user media error ${pretty(err)}`);
      }

      // retry after a while
      this.retryTimeout = window.setTimeout(
        this.initSocket.bind(this),
        this.options.timeouts.userMedia,
      );
    } else if (this.unloaded) {
      /*
       * This can happen when a container is unloaded but some user media related callbacks
       * are still in process. In that case ignore error.
       */
      this.options.logger.debug(
        `Recorder: already unloaded. Not going to throw error ${pretty(err)}`,
      );
    } else {
      this.options.logger.debug(
        `Recorder: no error listeners attached but throwing error ${pretty(err)}`,
      );

      // weird situation, throw it instead of emitting since there are no error listeners
      throw createError({
        err,
        message:
          "Unable to process this error since there are no error listeners anymore.",
        options: this.options,
      });
    }
  }

  private getUserMediaCallback(
    localStream: MediaStream,
    params?: VideomailUserMediaReadyParams,
  ) {
    if (!this.userMedia) {
      throw new Error("No user media is defined");
    }

    this.options.logger.debug(
      `Recorder: getUserMediaCallback(${params ? pretty(params) : ""})`,
    );

    if (this.showUserMedia()) {
      try {
        this.clearUserMediaTimeout();

        this.userMedia.init(
          localStream,
          () => {
            this.onUserMediaReady(params);
          },
          this.onAudioSample.bind(this),
          (err) => {
            this.emit("ERROR", { err });
          },
          params?.switchingFacingMode,
        );
      } catch (exc) {
        this.emit("ERROR", { exc });
      }
    }
  }

  private loadGenuineUserMedia(params?: VideomailUserMediaReadyParams) {
    this.options.logger.debug(
      `Recorder: loadGenuineUserMedia(${params ? pretty(params) : ""})`,
    );

    this.emit("ASKING_WEBCAM_PERMISSION");

    const constraints: MediaStreamConstraints = {
      video: {
        frameRate: { ideal: this.options.video.fps },
      },
      audio: isAudioEnabled(this.options),
    };

    // TODO Improve typings or add an external library for that
    if (params?.switchingFacingMode && constraints.video && constraints.video !== true) {
      constraints.video.facingMode = params.switchingFacingMode;
    }

    if (this.options.video.width && constraints.video && constraints.video !== true) {
      const idealWidth = this.options.video.width;

      if (idealWidth) {
        constraints.video.width = { ideal: idealWidth };
      }
    } else if (constraints.video && constraints.video !== true) {
      /*
       * otherwise try to apply the same width as the element is having
       * but there is no 100% guarantee that this will happen. not
       * all webcam drivers behave the same way
       */
      const limitedWidth = this.limitWidth();

      if (limitedWidth?.value) {
        constraints.video.width = { ideal: limitedWidth.value };
      }
    }

    if (this.options.video.height && constraints.video && constraints.video !== true) {
      const idealHeight = this.options.video.height;

      if (idealHeight) {
        constraints.video.height = { ideal: idealHeight };
      }
    }

    this.options.logger.debug(
      `Recorder: our webcam constraints are: ${pretty(constraints)}`,
    );

    this.options.logger.debug(
      `Recorder: available webcam constraints are: ${pretty(navigator.mediaDevices.getSupportedConstraints())}`,
    );

    const genuineUserMediaRequest = navigator.mediaDevices.getUserMedia(constraints);

    genuineUserMediaRequest
      .then((localStream) => {
        this.getUserMediaCallback(localStream, params);
      })
      .catch((reason: unknown) => {
        this.userMediaErrorCallback(reason);
      });
  }

  private loadUserMedia(params?: VideomailUserMediaReadyParams) {
    if (this.userMediaLoaded) {
      this.options.logger.debug(
        "Recorder: skipping loadUserMedia() because it is already loaded",
      );
      this.onUserMediaReady(params);
      return;
    } else if (this.userMediaLoading) {
      this.options.logger.debug(
        "Recorder: skipping loadUserMedia() because it is already asking for permission",
      );
      return;
    }

    this.options.logger.debug(`Recorder: loadUserMedia(${params ? pretty(params) : ""})`);

    this.emit("LOADING_USER_MEDIA");

    try {
      // It still can be undefined when not on HTTPS
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!navigator.mediaDevices) {
        throw new Error("No media devices are available.");
      }

      this.userMediaTimeout = window.setTimeout(() => {
        if (!this.isReady()) {
          const err = getBrowser(this.options).getNoAccessIssue();
          this.emit("ERROR", { err });
        }
      }, this.options.timeouts.userMedia);

      this.userMediaLoading = true;

      this.loadGenuineUserMedia(params);
    } catch (exc) {
      this.clearUserMediaTimeout();

      this.options.logger.debug("Recorder: failed to load genuine user media");

      this.userMediaLoading = false;

      const errorListeners = Despot.getListeners("ERROR");

      if (errorListeners?.length) {
        this.emit("ERROR", { exc });
      } else {
        this.options.logger.debug(
          `Recorder: no error listeners attached but throwing exception further`,
        );

        throw exc; // throw it further
      }
    }
  }

  private executeCommand(command: Command) {
    if (this.unloaded) {
      // Skip
      return;
    }

    try {
      if (command.args) {
        this.options.logger.debug(
          `Server commanded: ${command.command} with ${pretty(command.args)}`,
        );
      } else {
        this.options.logger.debug(`Server commanded: ${command.command}`);
      }

      switch (command.command) {
        case "ready":
          this.emit("SERVER_READY");

          if (!this.userMediaTimeout) {
            if (this.options.loadUserMediaOnRecord) {
              // Still show it but have it blank
              this.show();
            } else {
              this.loadUserMedia();
            }
          }
          break;
        case "preview":
          this.preview(command.args);
          break;
        case "error": {
          // Remember on server side the error object is generated using the serializeError fn
          let explanation = "(No explanation given)";

          if (command.args?.err?.message) {
            explanation = command.args.err.message;
          }

          // Sometimes, details and cause in the err instance are still displayed as [object Object]
          // Needs more time and research, but happens very rarely.
          // I wouldn't invest too much time on this unless users, you and me, we can reproduce it ;)
          const err = createError({
            message: "Websocket error from Videomail server",
            explanation,
            err: deserializeError(command.args?.err),
            options: this.options,
          });

          this.emit("ERROR", { err });
          break;
        }
        case "confirmFrame":
          this.updateFrameProgress(command.args);
          break;
        case "confirmSample":
          this.updateSampleProgress(command.args);
          break;
        case "beginAudioEncoding":
          this.emit("BEGIN_AUDIO_ENCODING");
          break;
        case "beginVideoEncoding":
          this.emit("BEGIN_VIDEO_ENCODING");
          break;
        default: {
          const err = createError({
            message: `Unknown server command: ${command.command}`,
            options: this.options,
          });

          this.emit("ERROR", {
            err,
          });

          break;
        }
      }
    } catch (exc) {
      this.emit("ERROR", { exc });
    }
  }

  private isNotifying() {
    return this.visuals.isNotifying();
  }

  private isHidden() {
    return !this.recorderElement || isHidden(this.recorderElement);
  }

  private writeCommand(command: string, args: any, cb?: () => void) {
    if (!this.connected) {
      this.options.logger.debug(`Reconnecting for the command ${command} …`);

      this.initSocket(() => {
        this.writeCommand(command, args);
        cb?.();
      });
    } else if (this.stream) {
      if (args) {
        this.options.logger.debug(`$ ${command} with ${pretty(args)}`);
      } else {
        this.options.logger.debug(`$ ${command}`);
      }

      const commandObj: Command = {
        command,
        args,
      };

      /*
       * todo commented out because for some reasons server does
       * not accept such a long array of many log lines. to examine later.
       *
       * add some useful debug info to examine weird stuff like this one
       * UnprocessableError: Unable to encode a video with FPS near zero.
       * todo consider removing this later or have it for debug=1 only?
       *
       * if (this.options.logger && options.logger.getLines) {
       *   commandObj.logLines = options.logger.getLines()
       * }
       */

      this.writeStream(Buffer.from(JSON.stringify(commandObj)));

      if (cb) {
        // keep all callbacks async
        setTimeout(function () {
          cb();
        }, 0);
      }
    }
  }

  private cancelAnimationFrame() {
    this.loop?.dispose();
  }

  private getIntervalSum() {
    return this.loop.getElapsedTime();
  }

  private getAvgInterval() {
    return this.getIntervalSum() / this.framesCount;
  }

  private getAvgFps() {
    const intervalSum = this.getIntervalSum();

    if (intervalSum === 0 || intervalSum === undefined || intervalSum === null) {
      return undefined;
    }

    return (this.framesCount / intervalSum) * 1000;
  }

  public getRecordingStats() {
    return this.recordingStats;
  }

  public getAudioSampleRate() {
    return this.userMedia?.getAudioSampleRate();
  }

  public stop(params?: StopParams) {
    if (!this.userMedia) {
      throw new Error("No user media defined, unable to stop");
    }

    this.options.logger.debug(`Recorder: stop(${params ? pretty(params) : ""})`);

    const limitReached = params?.limitReached;

    this.emit("STOPPING", { limitReached });

    this.loop?.complete();

    /*
     * needed to give dom enough time to prepare the replay element
     * to show up upon the STOPPING event so that we can evaluate
     * the right video type
     */
    setTimeout(() => {
      this.stopTime = Date.now();

      const videoType = this.replay.getVideoType();

      if (!videoType) {
        throw new Error("Unable to video record when no video type is defined.");
      }

      this.recordingStats = {
        /*
         * do not use loop.getFPS() as this will only return the fps from the last delta,
         * not the average. see https://github.com/hapticdata/animitter/issues/3
         */
        avgFps: this.getAvgFps(),
        wantedFps: this.options.video.fps,
        avgInterval: this.getAvgInterval(),
        wantedInterval: 1e3 / this.options.video.fps,

        intervalSum: this.getIntervalSum(),
        framesCount: this.framesCount,
        videoType,
      };

      if (isAudioEnabled(this.options) && this.userMedia) {
        this.recordingStats.samplesCount = this.samplesCount;
        this.recordingStats.sampleRate = this.userMedia.getAudioSampleRate();
      }

      this.writeCommand("stop", this.recordingStats, () => {
        this.emit("STOPPED", { recordingStats: this.recordingStats });
      });

      // beware, resetting will set framesCount to zero, so leave this here
      this.reset();
    }, 60);
  }

  public back(cb: () => void) {
    this.emit("GOING_BACK");

    this.unloaded = false;

    this.show();

    this.writeCommand("back", undefined, cb);
  }

  private reInitializeAudio() {
    this.options.logger.debug("Recorder: reInitializeAudio()");

    this.clearUserMediaTimeout();

    // important to free memory
    this.userMedia?.stop();

    this.userMediaLoaded = this.key = this.canvas = this.ctx = undefined;

    this.loadUserMedia();
  }

  public unload(params?: UnloadParams) {
    if (this.unloaded || !this.built) {
      // already unloaded
      return;
    }

    const e = params?.e;

    let cause: string | undefined;

    if (e) {
      cause = e.type;
    }

    const prettyCause = cause ? `, cause: ${cause}` : "";
    this.options.logger.debug(`Recorder: unload()${prettyCause}`);

    this.reset();

    this.clearUserMediaTimeout();

    if (this.userMedia) {
      // prevents https://github.com/binarykitchen/videomail-client/issues/114
      this.userMedia.unloadRemainingEventListeners();
    }

    if (this.submitting) {
      // server will disconnect socket automatically after submitting
    } else if (this.stream) {
      /*
       * Force to disconnect socket right now to clean temp files on server
       * event listeners will do the rest
       */
      this.options.logger.debug(`Recorder: destroying stream ...`);

      this.stream.destroy();
      this.stream = undefined;
    }

    this.unloaded = true;
    this.built = this.connecting = this.connected = false;
  }

  public reset() {
    // no need to reset when already unloaded
    if (!this.unloaded) {
      this.options.logger.debug("Recorder: reset()");

      this.emit("RESETTING");

      this.cancelAnimationFrame();

      // important to free memory
      this.userMedia?.stop();

      this.replay.reset();

      this.userMediaLoaded =
        this.key =
        this.canvas =
        this.ctx =
        this.recordingBuffer =
          undefined;
    }
  }

  private clearUserMediaTimeout() {
    if (this.userMediaTimeout) {
      this.options.logger.debug("Recorder: clearUserMediaTimeout()");

      window.clearTimeout(this.userMediaTimeout);
      this.userMediaTimeout = undefined;
    }
  }

  public validate() {
    return this.connected && this.canvas === undefined;
  }

  public isReady() {
    return this.userMedia?.isReady();
  }

  public pause(params?: PauseParams) {
    if (params) {
      this.options.logger.debug(
        `pause() at frame ${this.framesCount} with ${pretty(params)}`,
      );
    } else {
      this.options.logger.debug(`pause() at frame ${this.framesCount}`);
    }

    this.userMedia?.pause();
    this.loop.stop();

    this.emit("PAUSED");

    this.sendPings();
  }

  public resume() {
    this.options.logger.debug(`Recorder: resume() with frame ${this.framesCount}`);

    this.stopPings();

    this.emit("RESUMING");

    this.userMedia?.resume();
    this.loop.start();
  }

  private onFlushed(opts: WriteStreamParams) {
    const frameNumber = opts.frameNumber;

    if (frameNumber === 1) {
      this.emit("FIRST_FRAME_SENT");
    }
  }

  private draw(_deltaTime, elapsedTime: number) {
    if (!this.userMedia) {
      throw new Error("No user media defined, unable to draw on canvas");
    }

    try {
      // ctx and stream might become null while unloading
      if (!this.isPaused() && this.stream && this.ctx) {
        if (this.framesCount === 0) {
          this.emit("SENDING_FIRST_FRAME");
        }

        this.framesCount++;

        const imageSource = this.userMedia.getRawVisuals();

        if (this.canvas && imageSource) {
          this.ctx.drawImage(imageSource, 0, 0, this.canvas.width, this.canvas.height);
        } else {
          throw new Error("Unable to draw an image without a defined canvas");
        }

        this.recordingBuffer = this.frame?.toBuffer();
        const recordingBufferLength = this.recordingBuffer?.length;

        if (!recordingBufferLength) {
          throw createError({
            message: "Failed to extract webcam data.",
            options: this.options,
          });
        } else if (this.recordingBuffer) {
          const frameControlBuffer = Buffer.from(
            JSON.stringify({ frameNumber: this.framesCount }),
          );

          const frameBuffer = Buffer.concat([this.recordingBuffer, frameControlBuffer]);

          this.writeStream(frameBuffer, {
            frameNumber: this.framesCount,
            onFlushedCallback: this.onFlushed.bind(this),
          });

          this.visuals.checkTimer(elapsedTime);
        }
      }
    } catch (exc) {
      this.emit("ERROR", { exc });
    }
  }

  private createLoop() {
    const newLoop = animitter({ fps: this.options.video.fps }, this.draw.bind(this));

    // remember it first
    this.originalAnimationFrameObject = newLoop.getRequestAnimationFrameObject();

    return newLoop;
  }

  public record() {
    if (this.unloaded) {
      return;
    }

    // reconnect when needed
    if (!this.connected) {
      this.options.logger.debug("Recorder: reconnecting before recording ...");

      this.initSocket(() => {
        this.once("USER_MEDIA_READY", this.record.bind(this));
      });

      return;
    }

    if (!this.userMediaLoaded) {
      if (this.options.loadUserMediaOnRecord) {
        this.loadUserMedia({ recordWhenReady: true });
      } else {
        const err = createError({
          message: "Load and enable your camera first",
          options: this.options,
        });
        this.emit("ERROR", { err });
      }

      // do nothing further
      return;
    }

    try {
      if (!this.userMedia) {
        throw new Error("No user media defined, unable to create canvas");
      }
      this.canvas = this.userMedia.createCanvas();
    } catch (exc) {
      const err = createError({ exc, options: this.options });
      this.emit("ERROR", { err });

      return;
    }

    this.ctx = this.canvas.getContext("2d");

    if (!this.canvas.width) {
      const err = createError({
        message: "Canvas has an invalid width.",
        options: this.options,
      });
      this.emit("ERROR", { err });

      return;
    }

    if (!this.canvas.height) {
      const err = createError({
        message: "Canvas has an invalid height.",
        options: this.options,
      });
      this.emit("ERROR", { err });

      return;
    }

    this.frame = new Frame(
      this.canvas,
      this.options.image.types,
      this.options.image.quality,
    );

    this.options.logger.debug("Recorder: record()");
    this.userMedia.record();

    this.emit("RECORDING", { framesCount: this.framesCount });

    // see https://github.com/hapticdata/animitter/issues/3
    this.loop.on("update", (_deltaTime, elapsedTime: number) => {
      let avgFPS: number | undefined;

      if (elapsedTime !== 0) {
        // x1000 because of milliseconds
        avgFPS = Math.round((this.framesCount / elapsedTime) * 1000);
      } else {
        avgFPS = undefined;
      }

      this.options.logger.debug(
        `Recorder updates avgFps = ${avgFPS} at frame ${this.framesCount}`,
      );
    });

    this.loop.start();
  }

  private setAnimationFrameObject(newObj) {
    /*
     * must stop and then start to make it become effective, see
     * https://github.com/hapticdata/animitter/issues/5#issuecomment-292019168
     */
    if (this.loop) {
      const isRecording = this.isRecording();

      this.loop.stop();
      this.loop.setRequestAnimationFrameObject(newObj);

      if (isRecording) {
        this.loop.start();
      }
    }
  }

  private restoreAnimationFrameObject() {
    this.options.logger.debug("Recorder: restoreAnimationFrameObject()");

    this.setAnimationFrameObject(this.originalAnimationFrameObject);
  }

  private loopWithTimeouts() {
    this.options.logger.debug("Recorder: loopWithTimeouts()");

    const wantedInterval = 1e3 / this.options.video.fps;

    let processingTime = 0;
    let start;

    const raf = (fn) =>
      setTimeout(
        () => {
          start = Date.now();
          fn();
          processingTime = Date.now() - start;
        },
        /*
         * reducing wanted interval by respecting the time it takes to
         * compute internally since this is not multi-threaded like
         * requestAnimationFrame
         */
        wantedInterval - processingTime,
      );

    const cancel = (id?: number) => {
      window.clearTimeout(id);
    };

    this.setAnimationFrameObject({
      requestAnimationFrame: raf,
      cancelAnimationFrame: cancel,
    });
  }

  private correctDimensions() {
    if (!this.recorderElement) {
      return;
    }

    const widthDimension = useFullWidth(this.options.video.mobileBreakPoint);

    if (this.options.video.stretch || widthDimension) {
      this.recorderElement.style.width = "100%";
      this.recorderElement.style.removeProperty("height");
    } else {
      if (this.options.video.width) {
        const recorderWidth = this.getRecorderWidth(true);

        if (recorderWidth?.value) {
          this.recorderElement.width = recorderWidth.value;
        } else {
          this.recorderElement.style.removeProperty("width");
        }
      }

      if (this.options.video.height) {
        const recorderHeight = this.getRecorderHeight(true);

        if (recorderHeight?.value) {
          this.recorderElement.height = recorderHeight.value;
        } else {
          this.recorderElement.style.removeProperty("height");
        }
      }
    }
  }

  private switchFacingMode() {
    if (!getBrowser(this.options).isMobile()) {
      return;
    }

    if (this.facingMode === "user") {
      this.facingMode = "environment";
    } else if (this.facingMode === "environment") {
      this.facingMode = "user";
    } else {
      this.options.logger.warn(
        `Recorder: unsupported facing mode ${pretty(this.facingMode)}`,
      );
    }

    this.loadGenuineUserMedia({ switchingFacingMode: this.facingMode });
  }

  private initEvents() {
    this.options.logger.debug("Recorder: initEvents()");

    this.on("SUBMITTING", () => {
      this.submitting = true;
    });

    this.on("SUBMITTED", () => {
      this.submitting = false;
    });

    this.on("BLOCKING", () => {
      this.blocking = true;
      this.clearUserMediaTimeout();
    });

    this.on("PREVIEW", () => {
      this.hide();
    });

    this.on("HIDE", () => {
      this.hide();
    });

    this.on("LOADED_META_DATA", () => {
      this.correctDimensions();
    });

    this.on("DISABLING_AUDIO", () => {
      this.reInitializeAudio();
    });

    this.on("ENABLING_AUDIO", () => {
      this.reInitializeAudio();
    });

    this.on("INVISIBLE", () => {
      this.loopWithTimeouts();
    });

    this.on("VISIBLE", () => {
      this.restoreAnimationFrameObject();
    });

    this.on("SWITCH_FACING_MODE", () => {
      this.switchFacingMode();
    });

    this.on("WINDOW_RESIZE", () => {
      this.correctDimensions();
    });
  }

  private buildElement() {
    this.recorderElement = document.createElement("video");
    this.recorderElement.classList.add(this.options.selectors.userMediaClass);

    this.visuals.appendChild(this.recorderElement);
  }

  public build() {
    this.recorderElement = this.visuals
      .getElement()
      ?.querySelector(`video.${this.options.selectors.userMediaClass}`);

    if (!this.recorderElement) {
      this.buildElement();
    }

    if (!this.recorderElement) {
      throw new Error(
        `There is still no video element with class ${this.options.selectors.userMediaClass}`,
      );
    }

    this.correctDimensions();

    /*
     * prevent audio feedback, see
     * https://github.com/binarykitchen/videomail-client/issues/35
     */
    this.recorderElement.muted = true;

    // for iPhones, see https://github.com/webrtc/samples/issues/929
    this.recorderElement.setAttribute("playsinline", "true");
    this.recorderElement.setAttribute("webkit-playsinline", "webkit-playsinline");

    /*
     * Add these here, not in CSS because users can configure custom
     * class names
     */
    this.recorderElement.style.transform = "rotateY(180deg)";
    this.recorderElement.style["-webkit-transform"] = "rotateY(180deg)";
    this.recorderElement.style["-moz-transform"] = "rotateY(180deg)";

    this.userMedia ??= new UserMedia(this, this.options);

    this.show();

    if (!this.built) {
      this.initEvents();

      if (!this.connected) {
        this.initSocket();
      } else if (!this.options.loadUserMediaOnRecord) {
        this.loadUserMedia();
      }
    } else if (this.options.loadUserMediaOnRecord) {
      this.loadUserMedia();
    }

    this.built = true;
  }

  public isPaused() {
    return this.userMedia?.isPaused() && !this.loop.isRunning();
  }

  public isRecording() {
    /*
     * checking for stream.destroyed needed since
     * https://github.com/binarykitchen/videomail.io/issues/296
     */
    return Boolean(
      this.loop?.isRunning() &&
      !this.isPaused() &&
      !this.isNotifying() &&
      this.stream &&
      !this.stream.destroyed,
    );
  }

  public hide() {
    if (!this.isHidden()) {
      if (this.recorderElement) {
        hideElement(this.recorderElement);
      }

      this.clearUserMediaTimeout();
      this.clearRetryTimeout();
    }
  }

  public isUnloaded() {
    return this.unloaded;
  }

  /*
   * These two return the true dimensions of the webcam area.
   * needed because on mobiles they might be different.
   */
  public getRecorderWidth(responsive: boolean) {
    if (this.userMedia?.hasVideoWidth()) {
      return this.userMedia.getRawWidth(responsive);
    } else if (responsive && this.options.video.width) {
      return this.limitWidth(this.options.video.width);
    }

    const dimension: Dimension = {
      unit: "px",
      value: this.options.video.width,
    };

    return dimension;
  }

  public getRecorderHeight(responsive: boolean, useBoundingClientRect?: boolean) {
    let recorderHeight: Dimension | undefined;

    if (this.recorderElement && useBoundingClientRect) {
      const height = this.recorderElement.getBoundingClientRect().height;

      recorderHeight = {
        unit: "px",
        value: height,
      };
    } else if (this.userMedia) {
      let height = this.userMedia.getRawHeight(responsive);

      // Because user media isn't rendered it, yet is using the ideal height.
      // Regardless is a lesser width was chosen, hence respect ratio and recalculate.
      if (height !== undefined && this.options.video.width) {
        const ratio = this.getRatio();

        if (ratio !== undefined) {
          const idealHeight = this.options.video.width * ratio;
          height = Math.min(idealHeight, height);
        }
      }

      recorderHeight = {
        unit: "px",
        value: height,
      };
    } else if (responsive && this.options.video.height) {
      recorderHeight = this.calculateHeight(responsive);
    } else if (this.options.video.height) {
      const height = this.options.video.height;

      recorderHeight = {
        unit: "px",
        value: height,
      };
    }

    return recorderHeight;
  }

  public getRatio() {
    let ratio: number | undefined;

    if (this.userMedia) {
      const userMediaVideoWidth = this.userMedia.getVideoWidth();
      const userMediaVideoHeight = this.userMedia.getVideoHeight();

      // avoid division by zero
      if (!userMediaVideoWidth || userMediaVideoWidth < 1) {
        // use as a last resort fallback computation (needed for safari 11)
        ratio = this.visuals.getRatio();
      } else if (userMediaVideoHeight) {
        ratio = userMediaVideoHeight / userMediaVideoWidth;
      }
    } else {
      ratio = getRatio(this.options);
    }

    return ratio;
  }

  public calculateWidth(responsive: boolean) {
    let videoHeight: number | undefined;

    if (this.userMedia) {
      videoHeight = this.userMedia.getVideoHeight();
    } else if (this.recorderElement) {
      videoHeight = this.recorderElement.videoHeight || this.recorderElement.height;
    }

    const ratio = this.getRatio();

    return calculateWidth(responsive, this.options, videoHeight, ratio);
  }

  public calculateHeight(responsive: boolean) {
    let videoDimension: Dimension | undefined;

    if (this.userMedia) {
      const videoHeight = this.userMedia.getVideoHeight();

      videoDimension = {
        value: videoHeight,
        unit: "px",
      };
    } else if (this.recorderElement) {
      const videoHeight = this.recorderElement.videoHeight || this.recorderElement.height;

      videoDimension = {
        value: videoHeight,
        unit: "px",
      };
    } else {
      videoDimension = calculateHeight(
        responsive,
        undefined,
        this.options,
        this.getRatio(),
        this.recorderElement,
      );
    }

    return videoDimension;
  }

  public getRawVisualUserMedia() {
    return this.recorderElement;
  }

  public isConnected() {
    return this.connected;
  }

  public isConnecting() {
    return this.connecting;
  }

  public limitWidth(width?: number) {
    return this.visuals.limitWidth(width);
  }

  public limitHeight(height: number | undefined) {
    return this.visuals.limitHeight(height);
  }

  public isUserMediaLoaded() {
    return this.userMediaLoaded;
  }
}

export default Recorder;
