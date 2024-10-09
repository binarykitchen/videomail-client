import Despot from "../../util/Despot";
import pretty from "./../../util/pretty";
import { isAudioEnabled } from "../../util/options/audio";
import Recorder from "./recorder";
import { VideomailClientOptions } from "../../types/options";
import createError from "../../util/error/createError";
import isPromise from "../../util/isPromise";
import AudioRecorder, { AudioProcessCB } from "../../util/html/media/AudioRecorder";
import MEDIA_EVENTS from "../../util/html/media/mediaEvents";
import getFirstVideoTrack from "../../util/html/media/getFirstVideoTrack";

const EVENT_ASCII = "|—O—|";

interface StopParams {
  aboutToInitialize: boolean;
  switchingFacingMode: any;
}

class UserMedia extends Despot {
  private recorder: Recorder;
  private rawVisualUserMedia: HTMLVideoElement | undefined | null;

  private paused = false;
  private recording = false;

  private audioRecorder?: AudioRecorder | undefined;
  private currentVisualStream?: MediaStream | undefined;

  private onPlayReached = false;
  private onLoadedMetaDataReached = false;
  private playingPromiseReached = false;

  constructor(recorder: Recorder, options: VideomailClientOptions) {
    super("UserMedia", options);

    this.recorder = recorder;
    this.rawVisualUserMedia = recorder.getRawVisualUserMedia();

    MEDIA_EVENTS.forEach((eventName) => {
      this.rawVisualUserMedia?.addEventListener(
        eventName,
        this.outputEvent.bind(this),
        false,
      );
    });
  }

  private attachMediaStream(stream: MediaStream) {
    this.currentVisualStream = stream;

    if (this.rawVisualUserMedia) {
      this.rawVisualUserMedia.srcObject = stream;
    } else {
      throw createError({
        message: "Error attaching stream to element.",
        explanation: "Contact the developer about this",
        options: this.options,
      });
    }
  }

  private setVisualStream(localMediaStream?: MediaStream) {
    if (localMediaStream) {
      this.attachMediaStream(localMediaStream);
    } else {
      this.rawVisualUserMedia?.removeAttribute("srcObject");
      this.rawVisualUserMedia?.removeAttribute("src");

      this.currentVisualStream = undefined;
    }
  }

  private hasEnded() {
    if (this.rawVisualUserMedia?.ended) {
      return this.rawVisualUserMedia.ended;
    }

    return !this.currentVisualStream?.active;
  }

  private hasInvalidDimensions() {
    if (
      (this.rawVisualUserMedia?.videoWidth && this.rawVisualUserMedia.videoWidth < 3) ||
      (this.rawVisualUserMedia?.height && this.rawVisualUserMedia.height < 3)
    ) {
      return true;
    }

    return false;
  }

  private logEvent(eventType: string, params) {
    this.options.logger.debug(
      `UserMedia: ... ${EVENT_ASCII} event ${eventType}: ${pretty(params)}`,
    );
  }

  private outputEvent(e: Event) {
    this.logEvent(e.type, { readyState: this.rawVisualUserMedia?.readyState });

    // remove myself
    this.rawVisualUserMedia?.removeEventListener(e.type, this.outputEvent.bind(this));
  }

  public unloadRemainingEventListeners() {
    this.options.logger.debug("UserMedia: unloadRemainingEventListeners()");

    MEDIA_EVENTS.forEach((eventName) => {
      this.rawVisualUserMedia?.removeEventListener(
        eventName,
        this.outputEvent.bind(this),
      );
    });
  }

  private audioRecord(audioCallback: AudioProcessCB) {
    Despot.removeListener("SENDING_FIRST_FRAME");
    this.audioRecorder?.record(audioCallback);
  }

  public init(
    localMediaStream: MediaStream,
    videoCallback: () => void,
    audioCallback: AudioProcessCB,
    endedEarlyCallback: (err) => void,
    switchingFacingMode?: ConstrainDOMString,
  ) {
    this.stop(localMediaStream, {
      aboutToInitialize: true,
      switchingFacingMode,
    });

    // Reset states
    this.onPlayReached = false;
    this.onLoadedMetaDataReached = false;
    this.playingPromiseReached = false;

    if (isAudioEnabled(this.options)) {
      this.audioRecorder ??= new AudioRecorder(this, this.options);
    }

    const unloadAllEventListeners = () => {
      this.options.logger.debug("UserMedia: unloadAllEventListeners()");

      this.unloadRemainingEventListeners();
      Despot.removeListener("SENDING_FIRST_FRAME");

      this.rawVisualUserMedia?.removeEventListener("play", onPlay);
      this.rawVisualUserMedia?.removeEventListener("loadedmetadata", onLoadedMetaData);
    };

    const play = () => {
      // Resets the media element and restarts the media resource. Any pending events are discarded.
      try {
        this.rawVisualUserMedia?.load();

        /*
         * fixes https://github.com/binarykitchen/videomail.io/issues/401
         * see https://github.com/MicrosoftEdge/Demos/blob/master/photocapture/scripts/demo.js#L27
         */
        if (this.rawVisualUserMedia?.paused) {
          this.options.logger.debug(
            `UserMedia: play(): media.readyState=${this.rawVisualUserMedia.readyState}, media.paused=${this.rawVisualUserMedia.paused}, media.ended=${this.rawVisualUserMedia.ended}, media.played=${pretty(this.rawVisualUserMedia.played)}`,
          );

          let p;

          try {
            p = this.rawVisualUserMedia.play();
          } catch (exc) {
            /*
             * this in the hope to catch InvalidStateError, see
             * https://github.com/binarykitchen/videomail-client/issues/149
             */
            this.options.logger.warn(`Caught raw user media play exception: ${exc}`);
          }

          /*
           * using the promise here just experimental for now
           * and this to catch any weird errors early if possible
           */
          if (isPromise(p)) {
            p.then(() => {
              if (!this.playingPromiseReached) {
                this.options.logger.debug(
                  "UserMedia: play promise successful. Playing now.",
                );
                this.playingPromiseReached = true;
              }
            }).catch((reason) => {
              /*
               * promise can be interrupted, i.E. when switching tabs
               * and promise can get resumed when switching back to tab, hence
               * do not treat this like an error
               */
              this.options.logger.warn(
                `Caught pending user media promise exception: ${reason.toString()}`,
              );
            });
          }
        }
      } catch (exc) {
        unloadAllEventListeners();
        endedEarlyCallback(exc);
      }
    };

    const fireCallbacks = () => {
      const readyState = this.rawVisualUserMedia?.readyState;

      // ready state, see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
      this.options.logger.debug(
        `UserMedia: fireCallbacks(` +
          `readyState=${readyState}, ` +
          `onPlayReached=${this.onPlayReached}, ` +
          `onLoadedMetaDataReached=${this.onLoadedMetaDataReached})`,
      );

      if (this.onPlayReached && this.onLoadedMetaDataReached) {
        videoCallback();

        if (this.audioRecorder) {
          try {
            this.audioRecorder.init(localMediaStream);
            this.on("SENDING_FIRST_FRAME", () => {
              this.audioRecord(audioCallback);
            });
          } catch (exc) {
            unloadAllEventListeners();
            endedEarlyCallback(exc);
          }
        }
      }
    };

    const onPlay = () => {
      try {
        this.logEvent("play", {
          readyState: this.rawVisualUserMedia?.readyState,
          audio: isAudioEnabled(this.options),
          width: this.rawVisualUserMedia?.width,
          height: this.rawVisualUserMedia?.height,
          videoWidth: this.rawVisualUserMedia?.videoWidth,
          videoHeight: this.rawVisualUserMedia?.videoHeight,
        });

        this.rawVisualUserMedia?.removeEventListener("play", onPlay);

        if (this.hasEnded() || this.hasInvalidDimensions()) {
          endedEarlyCallback(
            createError({
              message: "Already busy",
              explanation: "Probably another browser window is using your webcam?",
              options: this.options,
            }),
          );
        } else {
          this.onPlayReached = true;
          fireCallbacks();
        }
      } catch (exc) {
        unloadAllEventListeners();
        endedEarlyCallback(exc);
      }
    };

    // player modifications to perform that must wait until `loadedmetadata` has been triggered
    const onLoadedMetaData = () => {
      this.logEvent("loadedmetadata", {
        readyState: this.rawVisualUserMedia?.readyState,
        paused: this.rawVisualUserMedia?.paused,
        width: this.rawVisualUserMedia?.width,
        height: this.rawVisualUserMedia?.height,
        videoWidth: this.rawVisualUserMedia?.videoWidth,
        videoHeight: this.rawVisualUserMedia?.videoHeight,
      });

      this.rawVisualUserMedia?.removeEventListener("loadedmetadata", onLoadedMetaData);

      if (!this.hasEnded() && !this.hasInvalidDimensions()) {
        this.emit("LOADED_META_DATA");

        this.onLoadedMetaDataReached = true;
        fireCallbacks();
      }
    };

    try {
      const videoTrack = getFirstVideoTrack(localMediaStream);

      if (!videoTrack) {
        this.options.logger.debug("UserMedia: detected (but no video tracks exist");
      } else if (!videoTrack.enabled) {
        throw createError({
          message: "Webcam is disabled",
          explanation: "The video track seems to be disabled. Enable it in your system.",
          options: this.options,
        });
      } else {
        let description = "";

        if (videoTrack.label && videoTrack.label.length > 0) {
          description = description.concat(videoTrack.label);
        }

        description = description.concat(
          ` with enabled=${videoTrack.enabled}, muted=${videoTrack.muted}, readyState=${videoTrack.readyState}`,
        );

        this.options.logger.debug(
          `UserMedia: ${videoTrack.kind} detected. ${description}`,
        );
      }

      this.rawVisualUserMedia?.addEventListener("loadedmetadata", onLoadedMetaData);
      this.rawVisualUserMedia?.addEventListener("play", onPlay);

      /*
       * experimental, not sure if this is ever needed/called? since 2 apr 2017
       * An error occurs while fetching the media data.
       * Error can be an object with the code MEDIA_ERR_NETWORK or higher.
       * networkState equals either NETWORK_EMPTY or NETWORK_IDLE, depending on when the download was aborted.
       */
      this.rawVisualUserMedia?.addEventListener("error", (err) => {
        this.options.logger.warn(`Caught video element error event: ${pretty(err)}`);
      });

      this.setVisualStream(localMediaStream);

      play();
    } catch (exc) {
      this.emit("ERROR", { exc });
    }
  }

  public isReady() {
    return Boolean(this.rawVisualUserMedia?.src);
  }

  public stop(visualStream?: MediaStream, params?: StopParams) {
    try {
      let chosenStream = visualStream;

      // do not stop "too much" when going to initialize anyway
      if (!params?.aboutToInitialize) {
        if (!chosenStream) {
          chosenStream = this.currentVisualStream;
        }

        const tracks = chosenStream?.getTracks();

        if (tracks) {
          tracks.forEach((track) => {
            track.stop();
          });
        }

        this.setVisualStream(undefined);

        this.audioRecorder?.stop();
        this.audioRecorder = undefined;
      }

      /*
       * don't have to reset these states when just switching camera
       * while still recording or pausing
       */
      if (!params?.switchingFacingMode) {
        this.paused = this.recording = false;
      }
    } catch (exc) {
      this.emit("ERROR", { exc });
    }
  }

  public createCanvas() {
    const canvas = document.createElement("canvas");
    const rawWidth = this.getRawWidth(true);

    if (rawWidth) {
      canvas.width = rawWidth;
    }

    const rawHeight = this.getRawHeight(true);

    if (rawHeight) {
      canvas.height = rawHeight;
    }

    return canvas;
  }

  public getVideoHeight() {
    return this.rawVisualUserMedia?.videoHeight;
  }

  public getVideoWidth() {
    return this.rawVisualUserMedia?.videoWidth;
  }

  public hasVideoWidth() {
    const videoWidth = this.getVideoWidth();

    return videoWidth && videoWidth > 0;
  }

  public getRawWidth(responsive: boolean) {
    let rawWidth = this.getVideoWidth();

    if (this.options.video.width || this.options.video.height) {
      if (!responsive) {
        rawWidth = this.options.video.width;
      } else {
        rawWidth = this.recorder.calculateWidth(responsive);
      }
    }

    if (responsive) {
      rawWidth = this.recorder.limitWidth(rawWidth);
    }

    return rawWidth;
  }

  public getRawHeight(responsive: boolean) {
    let rawHeight: number | undefined;

    if (this.options.video.width || this.options.video.height) {
      rawHeight = this.recorder.calculateHeight(responsive);

      if (!rawHeight || rawHeight < 1) {
        throw createError({
          message: "Bad dimensions",
          explanation: "Calculated raw height cannot be less than 1!",
          options: this.options,
        });
      }
    } else {
      rawHeight = this.getVideoHeight();

      if (!rawHeight || rawHeight < 1) {
        throw createError({
          message: "Bad dimensions",
          explanation: "Raw video height from DOM element cannot be less than 1!",
          options: this.options,
        });
      }
    }

    if (responsive) {
      rawHeight = this.recorder.limitHeight(rawHeight);
    }

    return rawHeight;
  }

  public getRawVisuals() {
    return this.rawVisualUserMedia;
  }

  public pause() {
    this.paused = true;
  }

  public isPaused() {
    return this.paused;
  }

  public resume() {
    this.paused = false;
  }

  public record() {
    this.recording = true;
  }

  public isRecording() {
    return this.recording;
  }

  public getAudioSampleRate() {
    if (this.audioRecorder) {
      return this.audioRecorder.getSampleRate();
    }

    return -1;
  }

  public getCharacteristics() {
    return {
      audioSampleRate: this.getAudioSampleRate(),
      muted: this.rawVisualUserMedia?.muted,
      width: this.rawVisualUserMedia?.width,
      height: this.rawVisualUserMedia?.height,
      videoWidth: this.rawVisualUserMedia?.videoWidth,
      videoHeight: this.rawVisualUserMedia?.videoHeight,
    };
  }
}

export default UserMedia;
