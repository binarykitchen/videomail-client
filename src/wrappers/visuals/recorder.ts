import { deserializeError } from "serialize-error";

import { VideomailCommand } from "../../types/command";
import type { VideomailClientOptions } from "../../types/options";
import createError from "../../util/error/createError";
import summarize from "../../util/string/summarize";
import { UnloadParams } from "../container";
import Visuals from "../visuals";
import RecorderCapture from "./recorder/capture";
import RecorderDimensions from "./recorder/dimensions";
import Replay from "./replay";
import UserMedia from "./userMedia";

export type { StopParams } from "./recorder/capture";

class Recorder extends RecorderCapture {
  private readonly dimensions: RecorderDimensions;

  constructor(visuals: Visuals, replay: Replay, options: VideomailClientOptions) {
    super(visuals, replay, options);

    this.dimensions = new RecorderDimensions({
      options,
      visuals,
      getRecorderElement: () => this.recorderElement,
      getUserMedia: () => this.userMedia,
    });
  }

  protected override executeCommand(command: VideomailCommand) {
    if (this.unloaded) {
      // Skip
      return;
    }

    try {
      if (command.args) {
        const debugLine = summarize(
          `Server commanded: ${command.command} with:`,
          command.args,
        );

        this.options.logger.debug(debugLine);
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

    this.recordingActive = false;
    this.mediaTransmissionStarted = false;
    this.reset();
    this.recordingDimensions = undefined;

    this.clearUserMediaTimeout();
    this.clearConnectionTimeout();
    this.clearReconnectTimeout();
    this.clearRetryTimeout();
    this.clearStopTimeout();
    this.stopPings();

    this.userMediaLoading = false;

    // So that destroying a still pending stream below is not reported as a failure
    this.connecting = false;
    this.reconnecting = false;
    this.reconnectAttempts = 0;

    if (this.userMedia) {
      // prevents https://github.com/binarykitchen/videomail-client/issues/114
      this.userMedia.unloadRemainingEventListeners();
    }

    if (this.submitting) {
      // Server will disconnect socket automatically after submitting
    } else if (this.stream) {
      /*
       * Force to disconnect socket right now to clean temp files on server
       * event listeners will do the rest
       */
      this.discardSocket();
    }

    this.unloaded = true;
    this.built = this.connecting = this.connected = false;
  }

  private correctDimensions() {
    this.dimensions.correctDimensions();
  }

  private initEvents() {
    this.options.logger.debug("Recorder: initEvents()");

    this.on("SUBMITTING", () => {
      this.cancelCameraRecovery();
      this.submitting = true;
    });

    this.on("SUBMITTED", () => {
      this.submitting = false;
    });

    this.on("BLOCKING", () => {
      this.cancelCameraRecovery();
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

  /*
   * These two return the true dimensions of the webcam area.
   * needed because on mobiles they might be different.
   */
  public override getRecorderWidth(responsive: boolean) {
    return this.dimensions.getRecorderWidth(responsive);
  }

  public override getRecorderHeight(
    responsive: boolean,
    useBoundingClientRect?: boolean,
  ) {
    return this.dimensions.getRecorderHeight(responsive, useBoundingClientRect);
  }

  public getRatio() {
    return this.dimensions.getRatio();
  }

  public calculateWidth(responsive: boolean) {
    return this.dimensions.calculateWidth(responsive);
  }

  public calculateHeight(responsive: boolean) {
    return this.dimensions.calculateHeight(responsive);
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
}

export default Recorder;
