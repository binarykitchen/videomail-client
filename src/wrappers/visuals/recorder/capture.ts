import animitter from "animitter";
import type AudioSample from "audio-sample";
import Frame from "canvas-to-buffer";

import Constants from "../../../constants";
import type { VideomailCommandArgs } from "../../../types/command";
import type { Dimension } from "../../../types/dimension";
import type { VideomailUserMediaReadyParams } from "../../../types/events/params";
import type { VideomailClientOptions } from "../../../types/options";
import createError from "../../../util/error/createError";
import { isAudioEnabled } from "../../../util/options/audio";
import pretty from "../../../util/string/pretty";
import type Visuals from "../../visuals";
import type Replay from "../replay";
import RecorderMedia from "./media";
import { calculateProgress, getConfirmedProgressNumber } from "./progress";
import type { WriteStreamParams } from "./streamWriter";

interface RecorderAnimationFrameApi {
  requestAnimationFrame(callback: () => void): number;
  cancelAnimationFrame(handle?: number): void;
}

export interface RecorderLoop {
  complete?(): void;
  dispose(): void;
  getElapsedTime(): number;
  getRequestAnimationFrameObject(): RecorderAnimationFrameApi;
  isRunning(): boolean;
  on(
    eventName: "update",
    listener: (deltaTime: number, elapsedTime: number) => void,
  ): void;
  setRequestAnimationFrameObject(animationFrameApi: RecorderAnimationFrameApi): void;
  start(): void;
  stop(): void;
}

export interface StopParams {
  limitReached?: boolean;
}

interface PauseParams {
  event?: MouseEvent;
}

abstract class RecorderCapture extends RecorderMedia {
  protected readonly replay: Replay;

  protected loop?: RecorderLoop | undefined;

  protected originalAnimationFrameObject?: RecorderAnimationFrameApi | undefined;

  protected recordingAudioSampleRate?: number | undefined;

  private frameProgress?: string | undefined;

  private sampleProgress?: string | undefined;

  protected canvas?: HTMLCanvasElement | undefined;

  protected ctx?: CanvasRenderingContext2D | undefined | null;

  protected stopTime?: number | undefined;

  protected waitingTime?: number | undefined;

  protected frame?: Frame;

  protected recordingBuffer?: Buffer | undefined;

  protected abstract getRecorderWidth(responsive: boolean): Dimension | undefined;
  protected abstract getRecorderHeight(
    responsive: boolean,
    useBoundingClientRect?: boolean,
  ): Dimension | undefined;

  protected constructor(
    visuals: Visuals,
    replay: Replay,
    options: VideomailClientOptions,
  ) {
    super(visuals, options);
    this.replay = replay;
  }

  protected override onAudioSample(audioSample: AudioSample) {
    if (this.recordingTransportFailed || this.cameraRecovery) {
      return;
    }

    const sampleRate = this.userMedia?.getAudioSampleRate();
    if (sampleRate && sampleRate > 0) {
      this.recordingAudioSampleRate ??= sampleRate;
    }

    this.samplesCount++;
    this.mediaTransmissionStarted = true;

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

  protected override onUserMediaReady(params?: VideomailUserMediaReadyParams) {
    try {
      this.options.logger.debug(
        `Recorder: onUserMediaReady(${params ? pretty(params) : ""})`,
      );

      const switchingFacingMode = params?.switchingFacingMode;

      if (params?.recovering) {
        if (!this.userMedia?.hasLiveStream()) {
          this.failCameraRecovery(new Error("The restored camera has no live tracks."));
          return;
        }

        // One take has one PCM sample rate; mixing rates would desynchronize audio.
        if (
          this.recordingAudioSampleRate !== undefined &&
          this.userMedia.getAudioSampleRate() !== this.recordingAudioSampleRate
        ) {
          this.failCameraRecovery(
            new Error("The audio sample rate changed during recovery."),
          );
          return;
        }
      }

      this.userMediaLoading = this.blocking = this.unloaded = this.submitting = false;
      this.userMediaLoaded = true;
      this.clearUserMediaTimeout();

      // Keep the existing loop and its timing when restoring a paused take.
      if (!switchingFacingMode && !params?.recovering) {
        this.loop = this.createLoop();
      }

      this.show();

      if (params?.recordWhenReady) {
        this.record();
      }

      this.emit("USER_MEDIA_READY", {
        switchingFacingMode: params?.switchingFacingMode,
        recovering: params?.recovering,
        paused: this.isPaused(),
        recordWhenReady: params?.recordWhenReady,
      });

      if (params?.recovering) {
        this.finishCameraRecovery(true);
      }
    } catch (exc) {
      if (params?.recovering) {
        this.failCameraRecovery(exc);
      } else {
        this.emit("ERROR", { exc });
      }
    }
  }

  private calculateFrameProgress() {
    return calculateProgress(this.confirmedFrameNumber, this.framesCount);
  }

  private calculateSampleProgress() {
    return calculateProgress(this.confirmedSampleNumber, this.samplesCount);
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

  protected updateFrameProgress(args?: VideomailCommandArgs) {
    this.confirmedFrameNumber = getConfirmedProgressNumber({
      args,
      kind: "frame",
      options: this.options,
    });

    this.frameProgress = this.calculateFrameProgress();

    this.updateOverallProgress();
  }

  protected updateSampleProgress(args?: VideomailCommandArgs) {
    this.confirmedSampleNumber = getConfirmedProgressNumber({
      args,
      kind: "sample",
      options: this.options,
    });

    this.sampleProgress = this.calculateSampleProgress();

    this.updateOverallProgress();
  }

  protected preview(args?: VideomailCommandArgs) {
    if (!args) {
      throw createError({
        message: "Preview arguments are missing.",
        options: this.options,
      });
    }

    const hasAudio = this.samplesCount > 0;

    // A server preview completes the prior take and allows another recording.
    this.mediaTransmissionStarted = false;
    this.recordingActive = false;
    this.recordingTransportFailed = false;

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
        `${args.mp4 + Constants.WHITELIST_KEY_LABEL}/${this.options.whitelistKey}/videomail.mp4`,
        true,
      );
    }

    if (args.webm) {
      this.replay.setWebMSource(
        `${args.webm + Constants.WHITELIST_KEY_LABEL}/${this.options.whitelistKey}/videomail.webm`,
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

  private cancelAnimationFrame() {
    this.loop?.dispose();
  }

  private getIntervalSum(): number | undefined {
    if (!this.loop) {
      return undefined;
    }

    return this.loop.getElapsedTime();
  }

  private getAvgInterval() {
    const intervalSum = this.getIntervalSum() ?? 0;

    // Explicitly reject undefined and invalid values (zero or negative).
    if (!this.hasValidInterval(intervalSum)) {
      return undefined;
    }

    return intervalSum / this.framesCount;
  }

  private getAvgFps() {
    const intervalSum = this.getIntervalSum() ?? 0;

    // Explicitly reject undefined and invalid values (zero or negative).
    if (!this.hasValidInterval(intervalSum)) {
      return undefined;
    }

    return (this.framesCount / intervalSum) * 1000;
  }

  private hasValidInterval(intervalSum: number) {
    return intervalSum > 0;
  }

  public getRecordingStats() {
    return this.recordingStats;
  }

  public getAudioSampleRate() {
    return this.recordingAudioSampleRate ?? this.userMedia?.getAudioSampleRate();
  }

  public stop(params?: StopParams) {
    this.cancelCameraRecovery();

    if (!this.userMedia) {
      throw new Error("No user media defined, unable to stop");
    }

    this.options.logger.debug(`Recorder: stop(${params ? pretty(params) : ""})`);

    this.recordingActive = false;

    const limitReached = params?.limitReached;

    this.emit("STOPPING", { limitReached });

    this.loop?.complete?.();

    /*
     * needed to give dom enough time to prepare the replay element
     * to show up upon the STOPPING event so that we can evaluate
     * the right video type
     */
    this.stopTimeout = window.setTimeout(() => {
      this.stopTimeout = undefined;
      this.stopTime = Date.now();

      const videoType = this.replay.getVideoType();

      if (!videoType) {
        throw new Error("Unable to video record when no video type is defined.");
      }

      this.recordingStats = {
        /*
         * Do not use loop.getFPS() as this will only return the fps from the last delta,
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

      if (this.userMedia) {
        this.recordingStats.videoTrackLabel = this.userMedia.getVideoTrackLabel();
      }

      if (isAudioEnabled(this.options) && this.userMedia) {
        this.recordingStats.samplesCount = this.samplesCount;
        this.recordingStats.sampleRate =
          this.recordingAudioSampleRate ?? this.userMedia.getAudioSampleRate();
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

    this.key = undefined;
    this.recordingDimensions = undefined;
    this.unloaded = false;

    this.show();

    this.writeCommand("back", undefined, cb);
  }

  protected reInitializeAudio() {
    this.options.logger.debug("Recorder: reInitializeAudio()");

    this.clearUserMediaTimeout();
    this.userMediaLoading = false;

    // important to free memory
    this.userMedia?.stop();

    this.recordingDimensions = undefined;
    this.userMediaLoaded = this.key = this.canvas = this.ctx = undefined;

    this.loadUserMedia();
  }

  public override reset() {
    this.cancelCameraRecovery();

    // No need to reset when already unloaded
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

  public override validate() {
    return Boolean(this.key) && this.canvas === undefined;
  }

  public override pause(params?: PauseParams) {
    this.cancelCameraRecovery();
    this.resumeAfterDrain = false;

    const loop = this.loop;
    if (!loop) {
      throw new Error("No recording loop defined");
    }

    if (params) {
      this.options.logger.debug(
        `pause() at frame ${this.framesCount} with ${pretty(params)}`,
      );
    } else {
      this.options.logger.debug(`pause() at frame ${this.framesCount}`);
    }

    this.userMedia?.pause();
    loop.stop();

    this.emit("PAUSED");

    this.sendPings();
  }

  public override resume() {
    // Live tracks may arrive before media initialization and audio are ready.
    if (this.cameraRecovery || !this.userMedia?.hasLiveStream()) {
      void this.recoverCamera();
      this.resumeAfterCameraRecovery = Boolean(this.cameraRecovery);
      return;
    }

    const loop = this.loop;
    if (!loop) {
      throw new Error("No recording loop defined");
    }

    this.options.logger.debug(`Recorder: resume() with frame ${this.framesCount}`);

    this.stopPings();

    this.emit("RESUMING");

    this.userMedia.resume();
    if (!this.streamBackpressured) {
      loop.start();
    } else {
      // Honor the resume request once the queued writes have drained.
      this.resumeAfterDrain = true;
    }
  }

  private onFlushed(opts: WriteStreamParams) {
    const frameNumber = opts.frameNumber;

    if (frameNumber === 1) {
      this.emit("FIRST_FRAME_SENT");
    }
  }

  private draw(_deltaTime, elapsedTime: number) {
    if (this.recordingTransportFailed) {
      return;
    }

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

          this.mediaTransmissionStarted = true;
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
    const newLoop: RecorderLoop = animitter(
      { fps: this.options.video.fps },
      this.draw.bind(this),
    );

    // remember it first
    this.originalAnimationFrameObject = newLoop.getRequestAnimationFrameObject();

    return newLoop;
  }

  public override record() {
    if (this.unloaded || this.cameraRecovery) {
      return;
    }

    // Reconnect when needed
    if (!this.connected) {
      this.options.logger.debug("Recorder: reconnecting before recording …");

      this.initSocket(() => {
        this.once("SERVER_READY", () => {
          if (this.unloaded) {
            return;
          }

          if (this.userMediaLoaded || this.options.loadUserMediaOnRecord) {
            this.record();
          } else {
            this.once("USER_MEDIA_READY", () => {
              if (!this.unloaded) {
                this.record();
              }
            });
          }
        });
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

    const loop = this.loop;
    if (!loop) {
      throw new Error("No recording loop defined");
    }

    this.recordingDimensions = undefined;

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

    this.recordingDimensions = {
      width: this.canvas.width,
      height: this.canvas.height,
    };

    this.frame = new Frame(
      this.canvas,
      this.options.image.types,
      this.options.image.quality,
    );

    this.options.logger.debug("Recorder: record()");
    // Start a fresh transport-failure window for this take.
    this.recordingActive = true;
    this.recordingTransportFailed = false;
    this.mediaTransmissionStarted = false;
    this.recordingAudioSampleRate = undefined;
    this.userMedia.record();

    this.emit("RECORDING", { framesCount: this.framesCount });

    // see https://github.com/hapticdata/animitter/issues/3
    loop.on("update", (_deltaTime, elapsedTime) => {
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

    loop.start();
  }

  private setAnimationFrameObject(newObj: RecorderAnimationFrameApi) {
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

  protected restoreAnimationFrameObject() {
    this.options.logger.debug("Recorder: restoreAnimationFrameObject()");

    if (this.originalAnimationFrameObject) {
      this.setAnimationFrameObject(this.originalAnimationFrameObject);
    }
  }

  protected loopWithTimeouts() {
    this.options.logger.debug("Recorder: loopWithTimeouts()");

    const wantedInterval = 1e3 / this.options.video.fps;

    let processingTime = 0;
    const raf = (fn: () => void) =>
      window.setTimeout(
        () => {
          const start = Date.now();
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

  public override isPaused() {
    return this.userMedia?.isPaused() && !this.loop?.isRunning();
  }

  protected override isUserMediaPaused() {
    return this.userMedia?.isPaused() ?? false;
  }

  protected override isCaptureLoopRunning() {
    return this.loop?.isRunning() ?? false;
  }

  protected override stopCaptureLoop() {
    this.loop?.stop();
  }

  protected override startCaptureLoop() {
    this.loop?.start();
  }

  public override isRecording() {
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

  public getRecordingDimensions() {
    // Stopping releases the camera and canvas before the form is submitted.
    return this.recordingDimensions && { ...this.recordingDimensions };
  }
}

export default RecorderCapture;
