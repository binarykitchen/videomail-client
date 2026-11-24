import type { AudioProcessCB } from "../../media/audio/AudioRecorder";
import AudioRecorder from "../../media/audio/AudioRecorder";
import getFirstVideoTrack from "../../media/video/getFirstVideoTrack";
import isVirtualCamera from "../../media/video/isVirtualCamera";
import requestMediaStreamWithPermissions from "../../media/video/requestMediaStream";
import startCanvasCameraPreview from "../../media/video/startCanvasCameraPreview";
import stopMediaStream from "../../media/video/stopMediaStream";
import VIDEO_EVENTS from "../../media/video/VideoEvents";
import watchCameraPlayback from "../../media/video/watchCameraPlayback";
import type { Dimension } from "../../types/dimension";
import type { VideomailUserMediaReadyParams } from "../../types/events/params";
import type { VideomailClientOptions } from "../../types/options";
import getBrowser from "../../util/browser/getBrowser";
import type { DespotEmitter } from "../../util/Despot";
import Despot from "../../util/Despot";
import createError from "../../util/error/createError";
import isHidden from "../../util/html/isHidden";
import { isAudioEnabled } from "../../util/options/audio";
import pretty from "../../util/string/pretty";
import type Recorder from "./recorder";

const EVENT_ASCII = "|—O—|";

// An ended, disabled or muted track can sit inside an active stream without delivering media.
function isLiveTrack(track: MediaStreamTrack) {
  return track.readyState === "live" && track.enabled && !track.muted;
}

interface MediaAcquisitionOptions {
  timeout: number;
  followsMicrophonePermission: boolean;
  getPermission?: (() => Promise<PermissionState>) | undefined;
}

interface MediaAcquisitionCallbacks {
  onStream: (stream: MediaStream) => void;
  onError: (reason: unknown) => void;
}

interface StopParams {
  aboutToInitialize?: boolean;
  preserveRecordingState?: boolean;
}

class UserMedia extends Despot {
  private readonly recorder: Recorder;
  private readonly rawVisualUserMedia: HTMLVideoElement | undefined | null;

  private paused = false;
  private recording = false;

  private audioRecorder?: AudioRecorder | undefined;
  private currentVisualStream?: MediaStream | undefined;

  private onPlayingReached = false;
  private onLoadedMetaDataReached = false;
  private playingPromiseReached = false;

  private videoTrackLabel?: string | undefined;
  private clearInitializationListeners?: (() => void) | undefined;
  private stopWatchingPlayback?: (() => void) | undefined;
  private stopCanvasPreview?: (() => void) | undefined;
  private initializationId = 0;
  private acquisitionId = 0;
  private acquisitionTimeout?: number | undefined;

  private readonly outputEvent = (e: Event) => {
    this.logEvent(e.type, { readyState: this.rawVisualUserMedia?.readyState });
    this.rawVisualUserMedia?.removeEventListener(e.type, this.outputEvent);
  };

  private readonly handleMediaError = (event: Event) => {
    this.options.logger.warn(`Caught video element error event: ${pretty(event)}`);
  };

  constructor(
    recorder: Recorder,
    options: VideomailClientOptions,
    emitter?: DespotEmitter,
  ) {
    super("UserMedia", options, emitter);

    this.recorder = recorder;
    this.rawVisualUserMedia = recorder.getRawVisualUserMedia();

    VIDEO_EVENTS.forEach((eventName) => {
      this.rawVisualUserMedia?.addEventListener(eventName, this.outputEvent, false);
    });
  }

  private attachMediaStream(stream: MediaStream) {
    if (this.rawVisualUserMedia) {
      this.rawVisualUserMedia.srcObject = stream;

      const previousStream = this.currentVisualStream;
      this.currentVisualStream = stream;

      if (!isHidden(this.rawVisualUserMedia)) {
        this.showCanvasPreview();
      }

      // Release the old camera stream, but never stop the one we just attached.
      if (previousStream !== stream) {
        stopMediaStream(previousStream);
      }
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
      if (this.rawVisualUserMedia) {
        this.rawVisualUserMedia.srcObject = null;
        this.rawVisualUserMedia.removeAttribute("src");
      }

      this.currentVisualStream = undefined;
    }
  }

  public showCanvasPreview() {
    const video = this.rawVisualUserMedia;

    if (this.stopCanvasPreview || !video || !this.currentVisualStream) {
      return;
    }

    if (this.shouldUseCanvasPreview(video)) {
      this.stopCanvasPreview = startCanvasCameraPreview(video, (message) => {
        this.options.logger.warn(message);
      });
    }
  }

  // Only fixed-frame recorders on affected WebKit versions need the canvas workaround.
  private shouldUseCanvasPreview(video: HTMLVideoElement) {
    const isInFixedFrame = Boolean(
      video.parentElement?.matches(".videomail .visuals.fixedAspectRatio"),
    );

    return isInFixedFrame && getBrowser(this.options).shouldUseCanvasCameraPreview();
  }

  public hideCanvasPreview() {
    this.stopCanvasPreview?.();
    this.stopCanvasPreview = undefined;
  }

  public async restorePlayback() {
    const video = this.rawVisualUserMedia;
    if (!video) {
      throw new Error("No camera preview is available.");
    }

    const initializationId = this.initializationId;
    this.stopWatchingPlayback?.();
    this.stopWatchingPlayback = undefined;

    if (!isHidden(video)) {
      // Returning to the foreground may invalidate the canvas even when the stream survives.
      this.hideCanvasPreview();
      this.showCanvasPreview();
    }

    await video.play();
    await this.audioRecorder?.resume();
    if (this.isCurrentInitialization(initializationId)) {
      this.watchPlayback();
    }
  }

  private clearAcquisitionTimeout() {
    if (this.acquisitionTimeout === undefined) {
      return;
    }

    window.clearTimeout(this.acquisitionTimeout);
    this.acquisitionTimeout = undefined;
  }

  private cancelAcquisition() {
    this.acquisitionId++;
    this.clearAcquisitionTimeout();
  }

  private isCurrentAcquisition(acquisitionId: number) {
    return acquisitionId === this.acquisitionId;
  }

  public acquire(
    constraints: MediaStreamConstraints,
    options: MediaAcquisitionOptions,
    callbacks: MediaAcquisitionCallbacks,
  ) {
    this.cancelAcquisition();
    const acquisitionId = ++this.acquisitionId;

    this.acquisitionTimeout = window.setTimeout(() => {
      if (!this.isCurrentAcquisition(acquisitionId)) {
        return;
      }

      this.cancelAcquisition();
      callbacks.onError(getBrowser(this.options).getNoAccessIssue());
    }, options.timeout);

    requestMediaStreamWithPermissions({
      constraints,
      followsMicrophonePermission: options.followsMicrophonePermission,
      getPermission: options.getPermission,
      isRequestCurrent: () => this.isCurrentAcquisition(acquisitionId),
    }).then(
      (stream) => {
        if (!this.isCurrentAcquisition(acquisitionId)) {
          // A reset or newer request can win while the browser prompt is open.
          stopMediaStream(stream);
          return;
        }

        this.clearAcquisitionTimeout();
        if (stream) {
          callbacks.onStream(stream);
        }
      },
      (reason: unknown) => {
        if (!this.isCurrentAcquisition(acquisitionId)) {
          return;
        }

        this.clearAcquisitionTimeout();
        callbacks.onError(reason);
      },
    );
  }

  private isVideoReady() {
    return Boolean(this.currentVisualStream?.getVideoTracks().some(isLiveTrack));
  }

  private isAudioReady() {
    return (
      !isAudioEnabled(this.options) ||
      Boolean(this.currentVisualStream?.getAudioTracks().some(isLiveTrack))
    );
  }

  // Async callbacks from replaced streams must not affect the current initialization.
  private isCurrentInitialization(initializationId: number) {
    return initializationId === this.initializationId;
  }

  // A newer camera request or a replaced stream makes this setup outdated.
  private isStaleInitialization(initializationId: number, stream: MediaStream) {
    return (
      !this.isCurrentInitialization(initializationId) ||
      this.currentVisualStream !== stream
    );
  }

  // An active stream can still contain an ended, disabled, or muted track.
  public hasLiveStream() {
    const videoReady = this.isVideoReady();
    const audioReady = this.isAudioReady();

    return Boolean(this.currentVisualStream?.active && videoReady && audioReady);
  }

  private hasEnded() {
    if (this.rawVisualUserMedia?.ended) {
      return this.rawVisualUserMedia.ended;
    }

    return !this.currentVisualStream?.active;
  }

  private hasInvalidDimensions() {
    if (!this.rawVisualUserMedia) {
      return false;
    }

    const { videoWidth, videoHeight } = this.rawVisualUserMedia;

    return (videoWidth > 0 && videoWidth < 3) || (videoHeight > 0 && videoHeight < 3);
  }

  // Playback and metadata events use the same camera-availability rule.
  private isCameraAvailable() {
    return !this.hasEnded() && !this.hasInvalidDimensions();
  }

  private logEvent(eventType: string, params) {
    this.options.logger.debug(
      `UserMedia: ... ${EVENT_ASCII} event ${eventType}: ${pretty(params)}`,
    );
  }

  public unloadRemainingEventListeners() {
    this.options.logger.debug("UserMedia: unloadRemainingEventListeners()");

    this.hideCanvasPreview();
    this.clearInitializationListeners?.();
    this.stopWatchingPlayback?.();
    this.stopWatchingPlayback = undefined;

    VIDEO_EVENTS.forEach((eventName) => {
      this.rawVisualUserMedia?.removeEventListener(eventName, this.outputEvent);
    });

    this.rawVisualUserMedia?.removeEventListener("error", this.handleMediaError);
  }

  private audioRecord(audioCallback: AudioProcessCB) {
    this.removeListener("SENDING_FIRST_FRAME");
    this.audioRecorder?.record(audioCallback);
  }

  private getIOSCameraPlaybackTarget() {
    if (
      !this.rawVisualUserMedia ||
      !this.currentVisualStream ||
      !getBrowser(this.options).isIOS()
    ) {
      return undefined;
    }

    return this.rawVisualUserMedia;
  }

  private watchPlayback() {
    const videoElement = this.getIOSCameraPlaybackTarget();

    if (!videoElement) {
      return;
    }

    this.stopWatchingPlayback?.();

    this.stopWatchingPlayback = watchCameraPlayback(videoElement, () => {
      this.stopWatchingPlayback = undefined;
      void this.recorder.recoverCameraAfterStall();
    });
  }

  public init(
    localMediaStream: MediaStream,
    videoCallback: () => void,
    audioCallback: AudioProcessCB,
    endedEarlyCallback: (err: unknown) => void,
    params?: Pick<VideomailUserMediaReadyParams, "switchingFacingMode" | "recovering">,
  ) {
    this.clearInitializationListeners?.();
    // Replacing a stream must not clear the paused take's recording flags.
    this.stop(localMediaStream, {
      aboutToInitialize: true,
      preserveRecordingState: Boolean(params?.switchingFacingMode || params?.recovering),
    });
    // Ignore async play/audio results from an older initialization or stopped stream.
    const initializationId = ++this.initializationId;

    // Reset states
    this.onPlayingReached = false;
    this.onLoadedMetaDataReached = false;
    this.playingPromiseReached = false;
    this.videoTrackLabel = undefined;

    if (isAudioEnabled(this.options)) {
      this.audioRecorder ??= new AudioRecorder(this, this.options, this.emitter);
    } else {
      // A permission change may replace an audio preview with a camera-only stream.
      void this.audioRecorder?.stop();
      this.audioRecorder = undefined;
    }

    const unloadAllEventListeners = () => {
      this.options.logger.debug("UserMedia: unloadAllEventListeners()");

      this.unloadRemainingEventListeners();
      this.removeListener("SENDING_FIRST_FRAME");

      this.rawVisualUserMedia?.removeEventListener("playing", onPlaying);
      this.rawVisualUserMedia?.removeEventListener("loadedmetadata", onLoadedMetaData);
    };

    this.clearInitializationListeners = () => {
      this.rawVisualUserMedia?.removeEventListener("playing", onPlaying);
      this.rawVisualUserMedia?.removeEventListener("loadedmetadata", onLoadedMetaData);
      this.clearInitializationListeners = undefined;
    };

    const play = () => {
      try {
        // Assigning srcObject already loads the stream; load() restarts that pipeline.
        if (this.rawVisualUserMedia?.paused) {
          this.options.logger.debug(
            `UserMedia: play(): media.readyState=${this.rawVisualUserMedia.readyState}, media.paused=${this.rawVisualUserMedia.paused}, media.ended=${this.rawVisualUserMedia.ended}, media.played=${pretty(this.rawVisualUserMedia.played)}`,
          );

          this.rawVisualUserMedia
            .play()
            .then(() => {
              if (!this.isCurrentInitialization(initializationId)) {
                return;
              }
              if (!this.playingPromiseReached) {
                this.options.logger.debug(
                  "UserMedia: play promise successful. Playing now.",
                );
                this.playingPromiseReached = true;
              }
            })
            .catch((exc: unknown) => {
              if (!this.isCurrentInitialization(initializationId)) {
                return;
              }
              // Switching tabs can interrupt playback. Warn, but allow a later retry.
              // Recovery requests still need an explicit failure.
              if (exc instanceof Error && !params?.recovering) {
                this.options.logger.warn(
                  `Caught pending user media promise exception: ${exc.toString()}`,
                );
              } else {
                unloadAllEventListeners();
                endedEarlyCallback(
                  createError({
                    message: "Failed to start camera playback.",
                    exc,
                    options: this.options,
                  }),
                );
              }
            });
        }
      } catch (exc) {
        unloadAllEventListeners();
        endedEarlyCallback(exc);
      }
    };

    const notifyReady = () => {
      this.clearInitializationListeners?.();
      videoCallback();
      if (this.isCurrentInitialization(initializationId)) {
        this.watchPlayback();
      }
    };

    const fireCallbacks = () => {
      const readyState = this.rawVisualUserMedia?.readyState;

      // ready state, see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
      this.options.logger.debug(
        `UserMedia: fireCallbacks(` +
          `readyState=${readyState}, ` +
          `onPlayingReached=${this.onPlayingReached}, ` +
          `onLoadedMetaDataReached=${this.onLoadedMetaDataReached})`,
      );

      if (this.onPlayingReached && this.onLoadedMetaDataReached) {
        if (this.audioRecorder) {
          const initializeAudio = async (audioRecorder: AudioRecorder) => {
            try {
              await audioRecorder.init(localMediaStream);

              if (this.isStaleInitialization(initializationId, localMediaStream)) {
                return;
              }

              const onAudioReady = () => {
                if (this.isStaleInitialization(initializationId, localMediaStream)) {
                  return;
                }

                // Resumed takes may not emit SENDING_FIRST_FRAME again; reattach audio now.
                if (this.recording) {
                  this.audioRecord(audioCallback);
                } else {
                  this.on("SENDING_FIRST_FRAME", () => {
                    this.audioRecord(audioCallback);
                  });
                }

                notifyReady();
              };

              if (params?.recovering) {
                await audioRecorder.resume();
              }
              onAudioReady();
            } catch (exc) {
              if (!this.isCurrentInitialization(initializationId)) {
                return;
              }
              unloadAllEventListeners();
              this.stop(undefined, {
                preserveRecordingState: Boolean(params?.recovering),
              });
              endedEarlyCallback(exc);
            }
          };

          void initializeAudio(this.audioRecorder);
        } else {
          notifyReady();
        }
      }
    };

    const onPlaying = () => {
      try {
        this.logEvent("playing", {
          ...this.getVideoElementState(),
          audio: isAudioEnabled(this.options),
        });

        this.rawVisualUserMedia?.removeEventListener("playing", onPlaying);

        if (!this.isCameraAvailable()) {
          endedEarlyCallback(
            createError({
              message: "Already busy",
              explanation: "Probably another browser window is using your webcam?",
              options: this.options,
            }),
          );
        } else {
          // A play event only changes paused; playing means playback has started.
          this.onPlayingReached = true;
          fireCallbacks();
        }
      } catch (exc) {
        unloadAllEventListeners();
        endedEarlyCallback(exc);
      }
    };

    // Wait for metadata before using the camera dimensions.
    const onLoadedMetaData = () => {
      this.logEvent("loadedmetadata", {
        ...this.getVideoElementState(),
        paused: this.rawVisualUserMedia?.paused,
      });

      this.rawVisualUserMedia?.removeEventListener("loadedmetadata", onLoadedMetaData);

      if (this.isCameraAvailable()) {
        this.emit("LOADED_META_DATA");

        this.onLoadedMetaDataReached = true;
        fireCallbacks();
      }
    };

    try {
      const videoTrack = getFirstVideoTrack(localMediaStream);
      this.videoTrackLabel = videoTrack?.label;

      if (!videoTrack) {
        this.options.logger.debug("UserMedia: detected (but no video tracks exist");
      } else if (!videoTrack.enabled) {
        throw createError({
          message: "Webcam is disabled",
          explanation: "The video track seems to be disabled. Enable it in your system.",
          options: this.options,
        });
      } else if (isVirtualCamera(videoTrack)) {
        throw createError({
          message: "Virtual cameras are not allowed.",
          explanation: `Please use a real camera, not "${videoTrack.label}".`,
          options: this.options,
        });
      } else {
        let description = "";

        if (videoTrack.label.length > 0) {
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
      this.rawVisualUserMedia?.addEventListener("playing", onPlaying);

      // Keep a handler for media loading failures, even if they rarely occur.
      this.rawVisualUserMedia?.removeEventListener("error", this.handleMediaError);
      this.rawVisualUserMedia?.addEventListener("error", this.handleMediaError);

      this.setVisualStream(localMediaStream);

      play();
    } catch (exc) {
      unloadAllEventListeners();
      endedEarlyCallback(exc);
    }
  }

  public getVideoTrackLabel() {
    return this.videoTrackLabel;
  }

  public isReady() {
    return Boolean(
      this.rawVisualUserMedia?.srcObject || this.rawVisualUserMedia?.currentSrc,
    );
  }

  public stop(visualStream?: MediaStream, params?: StopParams) {
    try {
      this.hideCanvasPreview();
      this.cancelAcquisition();
      this.removeListener("SENDING_FIRST_FRAME");
      this.stopWatchingPlayback?.();
      this.stopWatchingPlayback = undefined;

      // Leave stream cleanup to the upcoming initialization when requested.
      if (!params?.aboutToInitialize) {
        this.initializationId++;
        this.clearInitializationListeners?.();
        stopMediaStream(visualStream ?? this.currentVisualStream);

        this.setVisualStream();

        void this.audioRecorder?.stop();
        this.audioRecorder = undefined;
      }

      // Camera switches must keep the take's recording and pause state.
      if (!params?.preserveRecordingState) {
        this.paused = this.recording = false;
      }
    } catch (exc) {
      this.emit("ERROR", { exc });
    }
  }

  // Canvas scaling requires both source dimensions.
  private hasVideoDimensions(dimensions: {
    videoWidth: number | undefined;
    videoHeight: number | undefined;
  }): dimensions is { videoWidth: number; videoHeight: number } {
    return Boolean(dimensions.videoWidth && dimensions.videoHeight);
  }

  public createCanvas() {
    const canvas = document.createElement("canvas");
    const videoDimensions = {
      videoWidth: this.getVideoWidth(),
      videoHeight: this.getVideoHeight(),
    };

    if (!this.hasVideoDimensions(videoDimensions)) {
      const rawWidthDimension = this.getRawWidth(true);
      const rawHeight = this.getRawHeight(true);

      if (rawWidthDimension.value) {
        canvas.width = rawWidthDimension.value;
      }

      if (rawHeight) {
        canvas.height = rawHeight;
      }

      return canvas;
    }

    const { videoWidth, videoHeight } = videoDimensions;

    // Keep capture resolution independent of the responsive preview element.
    const captureWidth =
      this.options.video.width || this.getRawWidth(true).value || videoWidth;
    const captureHeight =
      this.options.video.height || this.getRawHeight(true) || videoHeight;
    const scale = Math.min(1, captureWidth / videoWidth, captureHeight / videoHeight);

    // Fit within the requested dimensions without upscaling or distorting camera output.
    canvas.width = Math.floor((videoWidth * scale) / 2) * 2;
    canvas.height = Math.floor((videoHeight * scale) / 2) * 2;

    return canvas;
  }

  public getVideoHeight() {
    if (!this.rawVisualUserMedia) {
      return undefined;
    }

    return this.rawVisualUserMedia.videoHeight || this.rawVisualUserMedia.height;
  }

  public getVideoWidth() {
    if (!this.rawVisualUserMedia) {
      return undefined;
    }

    return this.rawVisualUserMedia.videoWidth || this.rawVisualUserMedia.width;
  }

  public hasVideoWidth() {
    const videoWidth = this.getVideoWidth();

    return videoWidth && videoWidth > 0;
  }

  public getRawWidth(responsive: boolean) {
    const widthDimension: Dimension = { unit: "px" };

    if (responsive) {
      widthDimension.value = this.recorder.limitWidth(this.getVideoWidth())?.value;
    } else {
      widthDimension.value = this.options.video.width || this.getVideoWidth();
    }

    return widthDimension;
  }

  public getRawHeight(responsive: boolean) {
    let rawHeight = this.options.video.height || this.getVideoHeight();

    if (!responsive) {
      return rawHeight;
    }

    // In that case we have to calculate it ourselves with the ratio
    const ratio = this.recorder.getRatio();
    const rawWidth = this.getRawWidth(responsive);

    if (ratio !== undefined && rawWidth.value) {
      rawHeight = rawWidth.value * ratio;
    }

    return this.recorder.limitHeight(rawHeight).value;
  }

  public getRawVisuals() {
    return this.rawVisualUserMedia;
  }

  public pause() {
    this.paused = true;
    this.audioRecorder?.updateRecordingState();
  }

  public isPaused() {
    return this.paused;
  }

  public resume() {
    this.paused = false;
    this.audioRecorder?.updateRecordingState();
  }

  public record() {
    this.recording = true;
    this.audioRecorder?.updateRecordingState();
  }

  public isRecording() {
    return this.recording;
  }

  public getAudioSampleRate() {
    return this.audioRecorder?.getSampleRate() ?? -1;
  }

  // What the camera preview element reports about its size and loading progress.
  private getVideoElementState() {
    return {
      readyState: this.rawVisualUserMedia?.readyState,
      width: this.rawVisualUserMedia?.width,
      height: this.rawVisualUserMedia?.height,
      videoWidth: this.rawVisualUserMedia?.videoWidth,
      videoHeight: this.rawVisualUserMedia?.videoHeight,
    };
  }

  public getCharacteristics() {
    return {
      audioSampleRate: this.getAudioSampleRate(),
      muted: this.rawVisualUserMedia?.muted,
      paused: this.rawVisualUserMedia?.paused,
      currentTime: this.rawVisualUserMedia?.currentTime,
      ...this.getVideoElementState(),
    };
  }
}

export default UserMedia;
