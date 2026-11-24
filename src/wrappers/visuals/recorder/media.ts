import type AudioSample from "audio-sample";

import stopMediaStream from "../../../media/video/stopMediaStream";
import type { VideomailUserMediaReadyParams } from "../../../types/events/params";
import type { VideomailClientOptions } from "../../../types/options";
import getBrowser from "../../../util/browser/getBrowser";
import type { DespotEmitter } from "../../../util/Despot";
import createError from "../../../util/error/createError";
import VideomailError from "../../../util/error/VideomailError";
import hideElement from "../../../util/html/hideElement";
import isHidden from "../../../util/html/isHidden";
import showElement from "../../../util/html/showElement";
import { isAudioEnabled } from "../../../util/options/audio";
import pretty from "../../../util/string/pretty";
import summarize from "../../../util/string/summarize";
import type Visuals from "../../visuals";
import UserMedia from "../userMedia";
import RecorderConnection from "./connection";
import createUserMediaConstraints from "./mediaConstraints";

abstract class RecorderMedia extends RecorderConnection {
  protected readonly visuals: Visuals;

  protected recorderElement?: HTMLVideoElement | undefined | null;

  protected userMedia?: UserMedia;

  protected userMediaTimeout?: number | undefined;

  protected retryTimeout?: number | undefined;

  protected stopTimeout?: number | undefined;

  protected cameraRecovery?: Promise<boolean> | undefined;

  protected resolveCameraRecovery?: ((restored: boolean) => void) | undefined;

  protected resumeAfterCameraRecovery = false;

  private automaticCameraRecoveryAttempted = false;

  protected submitting = false;

  protected built = false;

  protected key?: string | undefined;

  protected facingMode: ConstrainDOMString;

  protected abstract onUserMediaReady(params?: VideomailUserMediaReadyParams): void;
  protected abstract onAudioSample(audioSample: AudioSample): void;
  protected abstract record(): void;
  protected abstract pause(): void;
  protected abstract resume(): void;
  protected abstract isPaused(): boolean | undefined;
  protected abstract isRecording(): boolean;

  protected constructor(
    visuals: Visuals,
    options: VideomailClientOptions,
    emitter?: DespotEmitter,
  ) {
    super(options, emitter);
    this.visuals = visuals;
    this.facingMode = options.video.facingMode;
  }

  public show() {
    showElement(this.recorderElement);
    // After replay, register the frame callback on the now-visible camera element.
    this.userMedia?.showCanvasPreview();
  }

  protected clearRetryTimeout() {
    if (this.retryTimeout === undefined) {
      return;
    }

    this.options.logger.debug("Recorder: clearRetryTimeout()");

    window.clearTimeout(this.retryTimeout);
    this.retryTimeout = undefined;
  }

  private showUserMedia() {
    // Wait for the connection before showing the camera.
    // See https://github.com/binarykitchen/videomail.io/issues/323.
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

  private userMediaErrorCallback(err, usedConstraints: MediaStreamConstraints) {
    if (this.cameraRecovery) {
      this.failCameraRecovery(err);
      return;
    }

    if (this.unloaded) {
      // Camera callbacks can arrive after unload. Log them without showing an error.
      this.options.logger.debug(
        `Recorder: already unloaded. Not going to throw error ${pretty(err)}`,
      );
      return;
    }

    this.userMediaLoading = false;
    this.clearUserMediaTimeout();

    const characteristics = this.userMedia?.getCharacteristics();

    this.options.logger.debug(
      `Recorder: userMediaErrorCallback(), name: ${err.name}, message: ${err.message} and Webcam characteristics: ${characteristics ? pretty(characteristics) : "none"}`,
    );

    const errorListeners = this.getListeners("ERROR");

    if (err.name !== VideomailError.MEDIA_DEVICE_NOT_SUPPORTED) {
      // Camera denial is the useful error; don't leave an idle socket behind it.
      this.closeIdleConnection("camera-access-failed");
    }

    if (errorListeners?.length) {
      if (err.name !== VideomailError.MEDIA_DEVICE_NOT_SUPPORTED) {
        const videomailError = createError({
          err,
          options: this.options,
          usedConstraints,
        });
        this.emit("ERROR", { err: videomailError });
      } else {
        // This can be a startup race. Retry instead of showing an error.
        this.options.logger.debug(`Recorder: ignore user media error ${pretty(err)}`);

        this.retryTimeout = window.setTimeout(() => {
          this.retryTimeout = undefined;

          if (!this.unloaded) {
            this.loadUserMedia();
          }
        }, this.options.timeouts.userMedia);
      }
    } else {
      this.options.logger.debug(
        `Recorder: no error listeners attached but throwing error ${pretty(err)}`,
      );

      // No listeners remain, so throw rather than lose the error.
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
      stopMediaStream(localStream);

      throw createError({ message: "No user media is defined", options: this.options });
    }

    this.options.logger.debug(
      `Recorder: getUserMediaCallback(${params ? pretty(params) : ""})`,
    );

    if (this.showUserMedia()) {
      try {
        this.userMedia.init(
          localStream,
          () => {
            if (!this.unloaded) {
              this.onUserMediaReady(params);
            }
          },
          this.onAudioSample.bind(this),
          (err) => {
            if (!this.unloaded) {
              this.userMediaErrorCallback(err, { audio: isAudioEnabled(this.options) });
            }
          },
          params,
        );
      } catch (exc) {
        stopMediaStream(localStream);

        this.userMediaLoading = false;
        this.clearUserMediaTimeout();
        this.userMediaErrorCallback(exc, { audio: isAudioEnabled(this.options) });
      }
    } else {
      stopMediaStream(localStream);
      this.userMediaLoading = false;
      this.clearUserMediaTimeout();
      this.cancelCameraRecovery();
    }
  }

  private shouldFollowMicrophonePermission() {
    // Audio format cannot change after frames or samples belong to the current take.
    return Boolean(
      this.options.audio.followPermissions && !this.mediaTransmissionStarted,
    );
  }

  private loadGenuineUserMedia(params?: VideomailUserMediaReadyParams) {
    this.options.logger.debug(
      `Recorder: loadGenuineUserMedia(${params ? pretty(params) : ""})`,
    );

    // A new take or camera/audio selection gets its own automatic-retry budget.
    if (!params?.recovering) {
      this.automaticCameraRecoveryAttempted = false;
    }

    this.emit("ASKING_WEBCAM_PERMISSION");
    this.userMediaLoading = true;

    const limitedWidth = this.options.video.width ? undefined : this.visuals.limitWidth();
    const constraints = createUserMediaConstraints({
      facingMode: this.facingMode,
      limitedWidth,
      options: this.options,
      userMediaParams: params,
    });
    const followsMicrophonePermission = this.shouldFollowMicrophonePermission();
    if (followsMicrophonePermission) {
      constraints.audio = true;
    }

    this.options.logger.debug(
      summarize(`Recorder: our webcam constraints are:`, constraints),
    );

    this.options.logger.debug(
      summarize(
        `Recorder: available webcam constraints are:`,
        navigator.mediaDevices.getSupportedConstraints(),
      ),
    );

    const userMedia = this.userMedia;
    if (!userMedia) {
      throw createError({ message: "No user media is defined", options: this.options });
    }

    userMedia.acquire(
      constraints,
      {
        timeout: this.options.timeouts.userMedia,
        followsMicrophonePermission,
        getPermission: followsMicrophonePermission
          ? this.options.audio.getPermission
          : undefined,
      },
      {
        onStream: (localStream) => {
          if (followsMicrophonePermission) {
            const audioEnabled = localStream
              .getAudioTracks()
              .some((track) => track.readyState === "live" && track.enabled);
            this.options.audio.enabled = audioEnabled;
            this.getUserMediaCallback(localStream, { ...params, audioEnabled });
          } else {
            this.getUserMediaCallback(localStream, params);
          }
        },
        onError: (reason) => {
          if (!this.unloaded) {
            this.userMediaErrorCallback(reason, constraints);
          }
        },
      },
    );
  }

  protected loadUserMedia(params?: VideomailUserMediaReadyParams) {
    if (this.shouldReloadUserMediaForMicrophonePermission(params)) {
      // Server readiness can follow foreground recovery; refresh idle permissions then.
      void this.recoverCamera();
      return;
    }

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

      this.userMediaLoading = true;

      this.loadGenuineUserMedia(params);
    } catch (exc) {
      this.clearUserMediaTimeout();

      this.options.logger.debug("Recorder: failed to load genuine user media");

      this.userMediaLoading = false;

      if (this.cameraRecovery) {
        this.failCameraRecovery(exc);
        return;
      }

      const errorListeners = this.getListeners("ERROR");

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

  private shouldReloadUserMediaForMicrophonePermission(
    params?: VideomailUserMediaReadyParams,
  ) {
    return (
      this.userMediaLoaded &&
      this.shouldFollowMicrophonePermission() &&
      !params?.recordWhenReady
    );
  }

  protected isNotifying() {
    return this.visuals.isNotifying();
  }

  private isHidden() {
    return !this.recorderElement || isHidden(this.recorderElement);
  }

  protected clearUserMediaTimeout() {
    if (this.userMediaTimeout !== undefined) {
      this.options.logger.debug("Recorder: clearUserMediaTimeout()");

      window.clearTimeout(this.userMediaTimeout);
      this.userMediaTimeout = undefined;
    }
  }

  protected clearStopTimeout() {
    if (this.stopTimeout === undefined) {
      return;
    }

    window.clearTimeout(this.stopTimeout);
    this.stopTimeout = undefined;
  }

  public isReady() {
    return this.userMedia?.isReady();
  }

  protected finishCameraRecovery(restored: boolean) {
    this.clearUserMediaTimeout();
    const resolve = this.resolveCameraRecovery;
    const resumeRequested = restored && this.resumeAfterCameraRecovery;
    this.cameraRecovery = undefined;
    this.resolveCameraRecovery = undefined;
    this.resumeAfterCameraRecovery = false;
    resolve?.(restored);

    // Foreground recovery alone must never restart capture.
    if (resumeRequested && this.isPaused()) {
      this.resume();
    }
  }

  protected cancelCameraRecovery() {
    if (!this.cameraRecovery) {
      return;
    }

    this.userMediaLoading = false;
    this.userMediaLoaded = false;
    this.clearUserMediaTimeout();
    this.userMedia?.stop(undefined, { preserveRecordingState: true });
    this.finishCameraRecovery(false);
  }

  protected failCameraRecovery(exc: unknown) {
    this.cancelCameraRecovery();
    const err = createError({
      message: "Camera recovery failed",
      explanation:
        "Your recording is still paused. Check camera permissions, then try Resume again or stop to keep the recorded part.",
      exc,
      options: this.options,
    });
    // Generic ERROR handlers can reset the take; this failure must stay retryable.
    this.emit("CAMERA_RECOVERY_FAILED", { err });
  }

  public recoverCamera() {
    return this.restoreCamera(false);
  }

  public recoverCameraAfterStall() {
    return this.restoreCamera(true);
  }

  /*
   * Recovery needs a built recorder that is still in use and isn't loading the camera
   * already. It must not replace unsent media or revive a take whose transport failed.
   */
  private shouldSkipCameraRecovery() {
    return (
      !this.built ||
      Boolean(this.unloaded) ||
      this.userMediaLoading ||
      this.submitting ||
      Boolean(this.key) ||
      this.stopTimeout !== undefined ||
      this.recordingTransportFailed
    );
  }

  /*
    _stalled_ means the camera preview has stopped delivering frames—even if the browser still reports the camera tracks as live.

    It’s not about a stalled network connection.
  */
  private restoreCamera(stalled: boolean) {
    // Resume clicks and visibility events can request the same recovery.
    if (this.cameraRecovery) {
      return this.cameraRecovery;
    }

    if (!this.userMedia || this.shouldSkipCameraRecovery()) {
      return Promise.resolve(false);
    }

    if (!stalled) {
      this.automaticCameraRecoveryAttempted = false;
    }

    // Idle native previews re-check permissions after returning from app settings.
    const liveStream =
      !stalled &&
      !this.shouldFollowMicrophonePermission() &&
      this.userMedia.hasLiveStream();

    if (liveStream && this.isRecording()) {
      return Promise.resolve(true);
    }

    if (!liveStream) {
      // Pause a running take before its camera gets replaced.
      if (this.recordingActive && !this.isPaused()) {
        this.pause();
      }

      this.options.logger.debug(
        `Recorder: replacing camera stream ${pretty(this.userMedia.getCharacteristics())}`,
      );

      // Release the old capture session before asking iOS for another one.
      this.userMedia.stop(undefined, { preserveRecordingState: true });
      this.userMediaLoaded = false;
    }

    if (stalled) {
      if (this.automaticCameraRecoveryAttempted) {
        this.failCameraRecovery(
          new Error("The camera stopped delivering frames after an automatic restart."),
        );
        return Promise.resolve(false);
      }

      // One automatic restart, then leave the take safe for an explicit retry.
      this.automaticCameraRecoveryAttempted = true;
      this.options.logger.warn("Recorder: camera preview stalled; recovering.");
    }

    const recovery = new Promise<boolean>((resolve) => {
      this.resolveCameraRecovery = resolve;
    });
    this.cameraRecovery = recovery;
    this.emit("CAMERA_RECOVERING");

    // Backgrounding can suspend playback without ending the camera tracks.
    if (liveStream) {
      this.userMediaTimeout = window.setTimeout(() => {
        this.failCameraRecovery(new Error("Camera playback recovery timed out."));
      }, this.options.timeouts.userMedia);

      this.userMedia
        .restorePlayback()
        .then(() => {
          if (this.cameraRecovery === recovery) {
            this.finishCameraRecovery(true);
          }
        })
        .catch((exc: unknown) => {
          if (this.cameraRecovery === recovery) {
            this.failCameraRecovery(exc);
          }
        });
    } else {
      this.loadUserMedia({ recovering: true });
    }

    return recovery;
  }

  protected switchFacingMode() {
    if (this.cameraRecovery || !getBrowser(this.options).isMobile()) {
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

  public hide() {
    this.userMedia?.hideCanvasPreview();
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

  public override isUserMediaLoaded() {
    return this.userMediaLoaded;
  }
}

export default RecorderMedia;
