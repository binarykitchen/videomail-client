import getFirstVideoTrack from "../../media/getFirstVideoTrack";
import MEDIA_EVENTS from "../../media/mediaEvents";
import { Dimension } from "../../types/dimension";
import type { VideomailUserMediaReadyParams } from "../../types/events/params";
import { VideomailClientOptions } from "../../types/options";
import Despot from "../../util/Despot";
import createError from "../../util/error/createError";
import AudioRecorder, { AudioProcessCB } from "../../util/html/media/AudioRecorder";
import isVirtualCamera from "../../util/isVirtualCamera";
import { isAudioEnabled } from "../../util/options/audio";
import pretty from "../../util/string/pretty";
import Recorder from "./recorder";

const EVENT_ASCII = "|—O—|";

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

  private onPlayReached = false;
  private onLoadedMetaDataReached = false;
  private playingPromiseReached = false;

  private videoTrackLabel?: string | undefined;
  private clearInitializationListeners?: (() => void) | undefined;
  private initializationId = 0;

  private readonly outputEvent = (e: Event) => {
    this.logEvent(e.type, { readyState: this.rawVisualUserMedia?.readyState });
    this.rawVisualUserMedia?.removeEventListener(e.type, this.outputEvent);
  };

  private readonly handleMediaError = (event: Event) => {
    this.options.logger.warn(`Caught video element error event: ${pretty(event)}`);
  };

  constructor(recorder: Recorder, options: VideomailClientOptions) {
    super("UserMedia", options);

    this.recorder = recorder;
    this.rawVisualUserMedia = recorder.getRawVisualUserMedia();

    MEDIA_EVENTS.forEach((eventName) => {
      this.rawVisualUserMedia?.addEventListener(eventName, this.outputEvent, false);
    });
  }

  private attachMediaStream(stream: MediaStream) {
    if (this.rawVisualUserMedia) {
      this.rawVisualUserMedia.srcObject = stream;

      const previousStream = this.currentVisualStream;
      this.currentVisualStream = stream;

      // Stop all tracks of the previous stream if it exists and is different from the current stream
      if (previousStream && previousStream !== stream) {
        previousStream.getTracks().forEach((track) => {
          track.stop();
        });
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

  public async restorePlayback() {
    if (!this.rawVisualUserMedia) {
      throw new Error("No camera preview is available.");
    }

    await this.rawVisualUserMedia.play();
    await this.audioRecorder?.resume();
  }

  public hasLiveStream() {
    // An active stream can still contain an ended, disabled, or muted track.
    const videoReady = this.currentVisualStream
      ?.getVideoTracks()
      .some((track) => track.readyState === "live" && track.enabled && !track.muted);
    const audioReady =
      !isAudioEnabled(this.options) ||
      this.currentVisualStream
        ?.getAudioTracks()
        .some((track) => track.readyState === "live" && track.enabled && !track.muted);

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

  private logEvent(eventType: string, params) {
    this.options.logger.debug(
      `UserMedia: ... ${EVENT_ASCII} event ${eventType}: ${pretty(params)}`,
    );
  }

  public unloadRemainingEventListeners() {
    this.options.logger.debug("UserMedia: unloadRemainingEventListeners()");

    this.clearInitializationListeners?.();

    MEDIA_EVENTS.forEach((eventName) => {
      this.rawVisualUserMedia?.removeEventListener(eventName, this.outputEvent);
    });

    this.rawVisualUserMedia?.removeEventListener("error", this.handleMediaError);
  }

  private audioRecord(audioCallback: AudioProcessCB) {
    this.removeListener("SENDING_FIRST_FRAME");
    this.audioRecorder?.record(audioCallback);
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
    this.onPlayReached = false;
    this.onLoadedMetaDataReached = false;
    this.playingPromiseReached = false;
    this.videoTrackLabel = undefined;

    if (isAudioEnabled(this.options)) {
      this.audioRecorder ??= new AudioRecorder(this, this.options);
    }

    const unloadAllEventListeners = () => {
      this.options.logger.debug("UserMedia: unloadAllEventListeners()");

      this.unloadRemainingEventListeners();
      this.removeListener("SENDING_FIRST_FRAME");

      this.rawVisualUserMedia?.removeEventListener("play", onPlay);
      this.rawVisualUserMedia?.removeEventListener("loadedmetadata", onLoadedMetaData);
    };

    this.clearInitializationListeners = () => {
      this.rawVisualUserMedia?.removeEventListener("play", onPlay);
      this.rawVisualUserMedia?.removeEventListener("loadedmetadata", onLoadedMetaData);
      this.clearInitializationListeners = undefined;
    };

    const play = () => {
      // Resets the media element and restarts the media resource.
      // Any pending events are discarded.
      try {
        this.rawVisualUserMedia?.load();

        /*
         * Fixes https://github.com/binarykitchen/videomail.io/issues/401, see
         * https://github.com/MicrosoftEdge/Demos/blob/master/photocapture/scripts/demo.js#L27
         */
        if (this.rawVisualUserMedia?.paused) {
          this.options.logger.debug(
            `UserMedia: play(): media.readyState=${this.rawVisualUserMedia.readyState}, media.paused=${this.rawVisualUserMedia.paused}, media.ended=${this.rawVisualUserMedia.ended}, media.played=${pretty(this.rawVisualUserMedia.played)}`,
          );

          this.rawVisualUserMedia
            .play()
            .then(() => {
              if (initializationId !== this.initializationId) {
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
              if (initializationId !== this.initializationId) {
                return;
              }
              /*
               * Promise can be interrupted, i.E. when switching tabs
               * and promise can get resumed when switching back to tab, hence
               * do not treat this like an error
               */
              if (exc instanceof Error && !params?.recovering) {
                this.options.logger.warn(
                  `Caught pending user media promise exception: ${exc.toString()}`,
                );
              } else {
                unloadAllEventListeners();
                endedEarlyCallback(
                  createError({
                    message: "Failed to play user media upon play event.",
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
        if (this.audioRecorder) {
          const initializeAudio = async (audioRecorder: AudioRecorder) => {
            try {
              await audioRecorder.init(localMediaStream);

              if (
                initializationId !== this.initializationId ||
                this.currentVisualStream !== localMediaStream
              ) {
                return;
              }

              const onAudioReady = () => {
                if (
                  initializationId !== this.initializationId ||
                  this.currentVisualStream !== localMediaStream
                ) {
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

                this.clearInitializationListeners?.();
                videoCallback();
              };

              if (params?.recovering) {
                await audioRecorder.resume();
              }
              onAudioReady();
            } catch (exc) {
              if (initializationId !== this.initializationId) {
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
          this.clearInitializationListeners?.();
          videoCallback();
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
      this.rawVisualUserMedia?.addEventListener("play", onPlay);

      /*
       * Experimental, not sure if this is ever needed/called? since 2 apr 2017
       * An error occurs while fetching the media data.
       *
       * Error can be an object with the code MEDIA_ERR_NETWORK or higher.
       * networkState equals either NETWORK_EMPTY or NETWORK_IDLE,
       * depending on when the download was aborted.
       */
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
      let chosenStream = visualStream;

      // Do not stop "too much" when going to initialize anyway
      if (!params?.aboutToInitialize) {
        this.initializationId++;
        this.clearInitializationListeners?.();
        chosenStream ??= this.currentVisualStream;

        const tracks = chosenStream?.getTracks();

        if (tracks) {
          tracks.forEach((track) => {
            track.stop();
          });
        }

        this.setVisualStream();

        this.audioRecorder?.stop();
        this.audioRecorder = undefined;
      }

      /*
       * Don't have to reset these states when just switching camera
       * while still recording or pausing
       */
      if (!params?.preserveRecordingState) {
        this.paused = this.recording = false;
      }
    } catch (exc) {
      this.emit("ERROR", { exc });
    }
  }

  public createCanvas() {
    const canvas = document.createElement("canvas");
    const rawWidthDimension = this.getRawWidth(true);

    if (rawWidthDimension.value) {
      canvas.width = rawWidthDimension.value;
    }

    const rawHeight = this.getRawHeight(true);

    if (rawHeight) {
      canvas.height = rawHeight;
    }

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
    let rawWidth: number | undefined;
    const widthDimension: Dimension = { unit: "px" };

    if (!responsive) {
      if (this.options.video.width) {
        rawWidth = this.options.video.width;
      } else {
        rawWidth = this.getVideoWidth();
      }
    } else {
      rawWidth = this.getVideoWidth();
    }

    if (responsive) {
      const widthDimension = this.recorder.limitWidth(rawWidth);
      rawWidth = widthDimension?.value;
    }

    widthDimension.value = rawWidth;

    return widthDimension;
  }

  public getRawHeight(responsive: boolean) {
    let rawHeight: number | undefined;

    if (!responsive) {
      if (this.options.video.height) {
        rawHeight = this.options.video.height;
      } else {
        rawHeight = this.getVideoHeight();
      }
    } else {
      rawHeight = this.options.video.height || this.getVideoHeight();

      // In that case we have to calculate it ourselves with the ratio
      const ratio = this.recorder.getRatio();
      const rawWidth = this.getRawWidth(responsive);

      if (ratio !== undefined && rawWidth.value) {
        rawHeight = rawWidth.value * ratio;
      }
    }

    if (responsive) {
      const heightDimension = this.recorder.limitHeight(rawHeight);
      rawHeight = heightDimension.value;
    }

    return rawHeight;
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
