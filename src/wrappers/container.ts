import "./../styles/main.styl";

import Visibility from "document-visibility";
import purify from "dompurify";
import type { Response } from "superagent";

import { ShowParams, StartOverParams } from "../client";
import Resource from "../resource";
import type { VideomailErrorParams } from "../types/events/params";
import { VideomailClientOptions } from "../types/options";
import { Videomail } from "../types/Videomail";
import getBrowser from "../util/browser/getBrowser";
import type { DespotEmitter } from "../util/Despot";
import Despot from "../util/Despot";
import isRecipientSelectionValid from "../util/email/isRecipientSelectionValid";
import createError from "../util/error/createError";
import ErrorReporter from "../util/error/ErrorReporter";
import VideomailError from "../util/error/VideomailError";
import getValidity from "../util/getValidity";
import limitHeight from "../util/html/dimensions/limitHeight";
import limitWidth from "../util/html/dimensions/limitWidth";
import useFullWidth from "../util/html/dimensions/useFullWidth";
import hideElement from "../util/html/hideElement";
import showElement from "../util/html/showElement";
import { isAutoPauseEnabled, setAudioEnabled } from "../util/options/audio";
import pretty from "../util/string/pretty";
import Buttons from "./buttons";
import Form, { FormInputs, FormMethod, FormMethodType } from "./form";
import { evaluateValidation, getValidationSkip } from "./form/evaluateValidation";
import Visuals from "./visuals";

interface BuildOptions {
  playerOnly?: boolean;
  replayParentElementId?: string | undefined;
  replayParentElement?: HTMLElement | undefined;
}

const INTERACTIVE_SPACE_TARGETS =
  "button, input, select, textarea, a[href], summary, label, audio[controls], video[controls], [contenteditable]:not([contenteditable='false']), [role='button'], [role='link'], [role='checkbox'], [role='radio'], [role='switch'], [role='menuitem'], [role='tab'], [tabindex]:not([tabindex='-1'])";

export interface UnloadParams {
  startingOver?: boolean;
  e?: Event;
}

class Container extends Despot {
  private readonly visibility = Visibility();
  private readonly htmlElement = document.querySelector("html");

  private readonly visuals: Visuals;
  private readonly buttons: Buttons;
  private readonly resource: Resource;
  private readonly errorReporter: ErrorReporter;
  private form: Form | undefined;

  private hasError = false;
  private submitted = false;
  private pendingHostSubmission: { key: string; response: Response } | undefined;
  private lastValidation = false;

  private containerElement?: HTMLElement | null | undefined;

  private built = false;
  // Separate from built: a failed build must not register the same listeners again.
  private eventsInitialized = false;
  private stopListeningToVisibility?: (() => void) | undefined;

  private readonly handleWindowResize = () => {
    if (this.built) {
      this.emit("WINDOW_RESIZE", "container");
    }
  };

  /*
   * Only pagehide means the page is really leaving. beforeunload fires earlier, while
   * the host can still cancel leaving to warn about an unsent take (see isDirty()).
   */
  private readonly handlePageHide = (e: PageTransitionEvent) => {
    if (e.persisted) {
      // The back/forward cache may restore this page, so keep the take paused.
      this.suspend();
      return;
    }

    this.unload({ e });
  };

  private readonly handleKeyDown = (e: KeyboardEvent) => {
    const containerElement = this.containerElement;

    if (!containerElement) {
      return;
    }

    // Follow composed events so controls in shadow DOM keep native Space activation.
    const eventPath = e.composedPath();

    // The nearest client owns the shortcut, so sibling and nested clients stay isolated.
    const targetContainerIndex = eventPath.findIndex(
      (eventTarget) =>
        eventTarget instanceof Element &&
        eventTarget.classList.contains(this.options.selectors.containerClass),
    );
    const targetContainer = eventPath[targetContainerIndex];
    const isInteractiveTarget = eventPath
      .slice(0, targetContainerIndex + 1)
      .some(
        (eventTarget) =>
          eventTarget instanceof Element &&
          eventTarget.matches(INTERACTIVE_SPACE_TARGETS),
      );

    if (
      !eventPath.includes(containerElement) ||
      targetContainer !== containerElement ||
      isInteractiveTarget ||
      e.defaultPrevented ||
      e.repeat ||
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.code !== "Space"
    ) {
      return;
    }

    e.preventDefault();

    if (this.options.enablePause) {
      this.visuals.pauseOrResume();
    } else {
      this.visuals.recordOrStop();
    }
  };

  public constructor(
    options: VideomailClientOptions,
    emitter?: DespotEmitter,
    // Shared with VideomailClient, so both deduplicate reports in one place.
    errorReporter = new ErrorReporter(options),
  ) {
    super("Container", options, emitter);

    this.errorReporter = errorReporter;
    this.visuals = new Visuals(this, options, this.emitter);
    this.buttons = new Buttons(this, options, this.emitter);
    this.resource = new Resource(options);
  }

  private buildChildren(playerOnly = false, parentElement?: HTMLElement | null) {
    const parentElementInfo = parentElement
      ? `, parentElement="${pretty(parentElement)}"`
      : "";

    this.options.logger.debug(
      `Container: buildChildren (playerOnly = ${playerOnly}${parentElementInfo})`,
    );

    if (this.containerElement) {
      this.containerElement.classList.add(this.options.selectors.containerClass);
    }

    if (!playerOnly) {
      this.buttons.build();
    }

    this.visuals.build(playerOnly, parentElement);
  }

  public build(buildOptions?: BuildOptions) {
    this.options.logger.debug(
      `Container: build (${buildOptions ? pretty(buildOptions) : ""})`,
    );

    try {
      const containerId = this.options.selectors.containerId;

      if (containerId) {
        // Replay-only views and stories may not have this container.
        this.containerElement = document.getElementById(containerId);
      } else {
        this.containerElement = document.createElement("div");
      }

      this.containerElement?.classList.add(this.options.selectors.containerClass);

      let replayParentElement: HTMLElement | null = null;

      if (buildOptions?.replayParentElement) {
        replayParentElement = buildOptions.replayParentElement;
      } else if (buildOptions?.replayParentElementId) {
        replayParentElement = document.getElementById(buildOptions.replayParentElementId);
      }

      // Reuse the replay parent if it also has the container class.
      if (!this.containerElement && replayParentElement) {
        if (
          replayParentElement.classList.contains(this.options.selectors.containerClass)
        ) {
          this.containerElement = replayParentElement;
        }
      }

      if (!this.eventsInitialized) {
        this.initEvents(buildOptions?.playerOnly);
      }

      if (!buildOptions?.playerOnly) {
        this.correctDimensions();
      }

      // Replay-only views may still have an edit form. Skip if there is none.
      this.buildForm();

      let parentElement: HTMLElement | undefined | null;

      if (buildOptions?.playerOnly) {
        parentElement = replayParentElement ?? this.containerElement;
      } else {
        parentElement = this.containerElement;
      }

      this.buildChildren(buildOptions?.playerOnly, parentElement);

      if (!this.hasError) {
        this.options.logger.debug("Container: built.");
        this.built = true;
        this.emit("BUILT");
      } else {
        this.options.logger.debug("Container: building failed due to an error.");
      }
    } catch (exc) {
      this.emit("ERROR", { exc });
    }

    return this.containerElement;
  }

  // since https://github.com/binarykitchen/videomail-client/issues/87
  private findParentFormElement() {
    if (!this.containerElement) {
      // Must be in player only mode
      return;
    }

    return this.containerElement.closest("form");
  }

  private getFormElement() {
    // Replay mode does not always need a form.
    let formElement: HTMLFormElement | undefined | null;

    if (this.containerElement?.tagName === "FORM") {
      formElement = this.containerElement as HTMLFormElement;
    } else if (this.options.selectors.formId) {
      formElement = document.querySelector<HTMLFormElement>(
        `#${this.options.selectors.formId}`,
      );

      if (formElement && formElement.tagName !== "FORM") {
        throw new Error(
          `HTML element with ID ${this.options.selectors.formId} is not a form.`,
        );
      }
    } else {
      formElement = this.findParentFormElement();
    }

    return formElement;
  }

  public buildForm() {
    if (this.form) {
      // already built
      return;
    }

    const formElement = this.getFormElement();

    if (formElement) {
      this.form = new Form(this, formElement, this.options, this.emitter);

      const submitButton = this.form.findSubmitButton();

      if (submitButton) {
        this.buttons.setSubmitButton(submitButton);
      }

      this.form.build();
    }
  }

  // From here on every error is a VideomailError, including plain exceptions.
  private toVideomailError(params: VideomailErrorParams) {
    return params.err ?? createError({ exc: params.exc, options: this.options });
  }

  private processError(err: VideomailError, recoverable?: boolean) {
    this.hasError = true;

    this.options.logger.error(err.stack ?? err.message);

    // Our stack only points at createError(); the original one shows the culprit.
    if (err.err?.stack) {
      this.options.logger.error(err.err.stack);
    }

    if (this.options.displayErrors) {
      this.visuals.error(err, !recoverable);
    } else if (!recoverable) {
      // A retryable submit must not reset the take when errors are hidden.
      this.visuals.reset();
    }
  }

  private initEvents(playerOnly = false) {
    this.options.logger.debug(`Container: initEvents (playerOnly = ${playerOnly})`);

    this.eventsInitialized = true;

    if (this.options.recalculateDimensionsOnWindowResize) {
      window.addEventListener("resize", this.handleWindowResize);
    }

    if (this.options.enableAutoUnload) {
      // Do not use { once: true }, because after a back/forward cache restore, pagehide can fire again.
      window.addEventListener("pagehide", this.handlePageHide);
    }

    if (!playerOnly) {
      this.stopListeningToVisibility = this.visibility.onChange((visible) => {
        // built? see https://github.com/binarykitchen/videomail.io/issues/326
        if (this.built) {
          if (visible) {
            this.recoverConnection();
            if (this.shouldRecoverCameraWhenVisible()) {
              void this.recoverCamera();
            }

            this.emit("VISIBLE");
          } else {
            if (isAutoPauseEnabled(this.options)) {
              this.suspend();
            }

            this.emit("INVISIBLE");
          }
        }
      });
    }

    if (this.options.enableSpace) {
      if (!playerOnly) {
        this.containerElement?.addEventListener("keydown", this.handleKeyDown);
      }
    }

    // Register the shared error handler here; unload() removes all listeners.
    this.on("ERROR", (params: VideomailErrorParams) => {
      const err = this.toVideomailError(params);

      // The one place that reports errors raised while recording. 📮
      this.errorReporter.report(err);
      this.processError(err, params.recoverable);

      this.endWaiting();

      const browser = getBrowser(this.options);

      if (browser.isMobile()) {
        this.removeDimensions();
      }
    });

    // A failed recovery keeps the take paused, but it is still worth a report.
    this.on("CAMERA_RECOVERY_FAILED", ({ err }) => {
      this.errorReporter.report(err);
    });

    this.on("WINDOW_RESIZE", () => {
      this.correctDimensions();
    });

    if (!playerOnly) {
      this.on("LOADED_META_DATA", () => {
        this.correctDimensions();
      });
    }
  }

  // Keep lazy cameras unloaded until recording starts, unless a paused take needs recovery.
  private shouldRecoverCameraWhenVisible() {
    return (
      isAutoPauseEnabled(this.options) &&
      (!this.options.loadUserMediaOnRecord ||
        this.visuals.isUserMediaLoaded() ||
        this.isPaused())
    );
  }

  // Set width only. The container may be a form with other inputs.
  private correctDimensions() {
    if (this.options.video.stretch) {
      this.removeDimensions();
    } else if (this.containerElement) {
      let widthDimension = useFullWidth(this.options.video.mobileBreakPoint);

      if (!widthDimension) {
        widthDimension = this.visuals.getRecorderWidth(true);
      }

      if (widthDimension?.value) {
        this.containerElement.style.width = `${widthDimension.value}${widthDimension.unit}`;
      } else {
        this.containerElement.style.removeProperty("width");
      }
    }
  }

  private removeDimensions() {
    if (!this.containerElement) {
      return;
    }

    this.containerElement.style.width = "auto";
  }

  private unloadChildren(params?: UnloadParams) {
    this.visuals.unload(params);
    this.buttons.unload();

    if (this.form) {
      this.form.unload();
      this.form = undefined;
    }

    this.endWaiting();
  }

  private removeBrowserEventListeners() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("pagehide", this.handlePageHide);
    this.containerElement?.removeEventListener("keydown", this.handleKeyDown);

    this.stopListeningToVisibility?.();
    this.stopListeningToVisibility = undefined;
  }

  private hideMySelf() {
    hideElement(this.containerElement);
  }

  private async submitVideomail(formInputs: FormInputs, method: FormMethodType) {
    const videomailFormData = this.form?.transformFormData(formInputs);

    if (!videomailFormData) {
      throw new Error("No videomail form data defined");
    }

    if (method === FormMethod.POST) {
      videomailFormData.recordingStats = this.visuals.getRecordingStats();

      const dimensions = this.visuals.getRecordingDimensions();
      if (!dimensions) {
        throw createError({
          message: "Recorded frame dimensions are missing.",
          options: this.options,
        });
      }

      videomailFormData.width = dimensions.width;
      videomailFormData.height = dimensions.height;

      return await this.resource.post(videomailFormData);
    } else if (method === FormMethod.PUT) {
      return await this.resource.put(videomailFormData);
    }

    throw createError({
      message: `Unsupported form method ${method}, unable to submit videomail.`,
      options: this.options,
    });
  }

  public limitWidth(width?: number) {
    if (!this.containerElement) {
      return;
    }

    return limitWidth(this.containerElement, this.options, width);
  }

  public limitHeight(height: number | undefined) {
    return limitHeight(height, this.options, "containers limitHeight fn");
  }

  public hasElement() {
    return Boolean(this.containerElement);
  }

  public getSubmitButton() {
    return this.buttons.getSubmitButton();
  }

  public querySelector(selector: string) {
    if (!this.containerElement) {
      // Must be in player only mode
      return;
    }

    return this.containerElement.querySelector<HTMLElement>(selector);
  }

  public beginWaiting() {
    this.htmlElement?.classList.add("wait");
  }

  public endWaiting() {
    this.htmlElement?.classList.remove("wait");
  }

  public appendChild(child) {
    if (!this.containerElement || this.containerElement === child) {
      // Must be in player only mode
      return;
    }

    this.containerElement.appendChild(child);
  }

  public insertBefore(child, reference) {
    if (!this.containerElement) {
      // Must be in player only mode
      return;
    }

    this.containerElement.insertBefore(child, reference);
  }

  public unload(params?: UnloadParams) {
    try {
      if (!this.built) {
        return;
      }

      const e = params?.e;

      this.options.logger.debug(`Container: unload(${e ? pretty(e) : ""})`);
      this.emit("UNLOADING");

      this.unloadChildren(params);
      this.hide();
    } catch (exc) {
      this.emit("ERROR", { exc });
    } finally {
      this.removeBrowserEventListeners();
      this.removeAllListeners();

      this.built = this.submitted = this.eventsInitialized = false;
      this.pendingHostSubmission = undefined;
    }
  }

  public show(params?: ShowParams) {
    if (!this.containerElement) {
      throw createError({
        message: "No container element exists.",
        options: this.options,
      });
    }

    showElement(this.containerElement);

    this.visuals.show(params);

    if (!this.hasError) {
      const paused = this.isPaused();

      // Bring the existing control state back; FORM_READY handles paused takes.
      this.buttons.show();

      if (this.isReplayShown()) {
        this.emit("PREVIEW");
      } else {
        this.emit("FORM_READY", { paused });
      }
    }

    return this.containerElement;
  }

  public hide() {
    this.options.logger.debug("Container: hide()");

    this.hasError = false;

    if (this.isRecording()) {
      this.pause();
    }

    this.visuals.hide();

    if (this.submitted) {
      this.buttons.hide();
      this.hideMySelf();
    }
  }

  public startOver(params?: StartOverParams) {
    try {
      const keepHidden = params?.keepHidden;

      this.options.logger.debug(`Container: startOver(keepHidden = ${keepHidden})`);

      this.submitted = false;
      this.pendingHostSubmission = undefined;

      const replay = this.getReplay();

      replay.hide();
      replay.reset();

      // Rebuild the UI and restore its listeners.
      this.build();

      this.emit("STARTING_OVER");

      this.visuals.back(keepHidden, () => {
        this.enableForm(true);

        if (keepHidden) {
          // Keep the recorder hidden when returning to a text-only form.
        } else {
          this.show();
        }
      });
    } catch (exc) {
      this.emit("ERROR", { exc });
    }
  }

  public showReplayOnly() {
    this.hasError = false;

    if (this.isRecording()) {
      this.pause();
    }

    this.visuals.showReplayOnly();

    if (this.submitted) {
      this.buttons.hide();
    }
  }

  public isNotifying() {
    return this.visuals.isNotifying();
  }

  public isPaused() {
    return this.visuals.isPaused();
  }

  public pause(params?: { event: MouseEvent }) {
    this.visuals.pause(params);
  }

  public suspend() {
    if (!this.built) {
      return;
    }

    this.visuals.getRecorder().suspendConnection();

    if (this.shouldPauseForConnectionSuspension()) {
      this.pause();
    }
  }

  private shouldPauseForConnectionSuspension() {
    return this.isCountingDown() || this.isRecording() || this.isPaused();
  }

  public recoverConnection() {
    if (this.canRecover()) {
      this.visuals.getRecorder().recoverConnection();
    }
  }

  public recoverCamera() {
    if (!this.canRecover()) {
      return Promise.resolve(false);
    }

    return this.visuals.recoverCamera();
  }

  private canRecover() {
    return this.built && !this.hasError && !this.submitted;
  }

  private emitValidating(event?: Event) {
    const target = event?.target;
    const targetName = target instanceof Element ? target.getAttribute("name") : null;
    if (targetName) {
      this.emit("VALIDATING", { targetName });
    } else if (event) {
      this.emit("VALIDATING", { event });
    } else {
      this.emit("VALIDATING");
    }
  }

  private getFormValidationFacts() {
    if (!this.form) {
      return undefined;
    }

    const input = this.form.getInvalidElement();
    if (input) {
      return {
        invalidInput: {
          name: input.getAttribute("name"),
          value: input.getAttribute("value"),
          missing: getValidity(input)?.valueMissing ?? false,
        },
        recipientsValid: false,
      };
    }

    return { recipientsValid: isRecipientSelectionValid(this.form.getRecipients()) };
  }

  private isVideoRequired(cameraLoaded: boolean | undefined, connected: boolean) {
    // A hidden recorder leaves the host's text-only path available.
    const cameraAvailable =
      cameraLoaded || (this.options.loadUserMediaOnRecord && connected);
    return (
      !this.visuals.isHidden() &&
      (cameraAvailable || this.isRecording() || this.isPaused() || this.isCountingDown())
    );
  }

  public validate(event?: Event, force = false) {
    const cameraLoaded = this.visuals.isUserMediaLoaded();
    const connected = this.visuals.isConnected();
    const skip = getValidationSkip({
      built: this.built,
      autoValidate: this.options.enableAutoValidation,
      forced: force,
      notifying: this.isNotifying(),
      connected,
      connecting: this.visuals.isConnecting(),
      cameraLoaded,
      replayShown: this.isReplayShown(),
    });

    if (skip) {
      // Skipping validation must not overwrite the last verdict for auto-submit.
      this.lastValidation ||= skip.allowManualSubmit;
      return true;
    }

    this.emitValidating(event);
    const result = evaluateValidation({
      videoValid: this.visuals.validate(),
      videoRequired: Boolean(this.form && this.isVideoRequired(cameraLoaded, connected)),
      form: this.getFormValidationFacts(),
    });

    if (result.status === "valid") {
      this.emit("VALID");
    } else {
      const { whyInvalid, invalidData } = result;
      this.emit("INVALID", invalidData ? { whyInvalid, invalidData } : { whyInvalid });
    }

    this.lastValidation = result.status === "valid";
    return this.lastValidation;
  }

  public disableForm(buttonsToo: boolean) {
    this.form?.disable(buttonsToo);
  }

  public enableForm(buttonsToo: boolean) {
    this.form?.enable(buttonsToo);
  }

  public hasForm() {
    return Boolean(this.form);
  }

  private getPendingHostSubmissionResponse(
    key: string | undefined,
  ): Response | undefined {
    return this.pendingHostSubmission?.key === key
      ? this.pendingHostSubmission?.response
      : undefined;
  }

  public async submitAll(
    formData: FormInputs,
    method: FormMethodType,
    url: string,
    // True when the form has an explicit host action, not the API URL fallback.
    hasHostAction = false,
  ) {
    let response: Response | undefined;
    let hostResponse: Response | undefined;
    let submissionFailed = false;
    const videomailKey = formData[this.options.selectors.keyInputName];

    try {
      const hasVideomailKey = Boolean(videomailKey);

      // Without a video, leave submission to the host app if auto-submission is off.
      if (!hasVideomailKey && !this.options.enableAutoSubmission) {
        return;
      }

      const output = [method, url].filter(Boolean).join(": ");
      this.options.logger.debug(`Container: submitAll(${output})`);

      this.beginWaiting();

      if (this.options.disableFormWhenSubmitting) {
        this.form?.disableForSubmission();
      }

      this.emit("SUBMITTING");

      if (!hasVideomailKey) {
        response = await this.resource.form(formData, url);
        this.submitted = true;
        this.emit("SUBMITTED", { videomail: response.body, response });

        // With a video key, submit the video before handing off to the host form.
      } else {
        response =
          this.getPendingHostSubmissionResponse(videomailKey) ??
          (await this.submitVideomail(formData, method));

        if (this.options.enableAutoSubmission && hasHostAction) {
          if (videomailKey) {
            // Keep the video response so a failed host request can retry without re-uploading.
            this.pendingHostSubmission = { key: videomailKey, response };
          }

          const hostFormData: Record<string, unknown> = { ...formData };

          if (this.options.submitWithVideomail) {
            hostFormData.videomail = response.body.videomail;
          }

          hostResponse = await this.resource.form(hostFormData, url);
          this.pendingHostSubmission = undefined;
        }

        this.submitted = true;
        this.emit("SUBMITTED", { videomail: response.body.videomail, response });
      }
    } catch (exc) {
      submissionFailed = true;
      const err = createError({ exc, options: this.options });
      this.emit("ERROR", { err, recoverable: true });
    } finally {
      const finalResponse = hostResponse ?? response;

      if (submissionFailed && this.options.disableFormWhenSubmitting) {
        this.form?.restoreAfterFailedSubmission();
      }

      if (finalResponse?.text && finalResponse.type === "text/html") {
        // server replied with HTML contents - display these
        document.body.innerHTML = purify.sanitize(finalResponse.text);
      }

      this.endWaiting();
    }
  }

  public isBuilt() {
    return this.built;
  }

  public isReplayShown() {
    return this.visuals.isReplayShown();
  }

  public isDirty() {
    let isDirty = false;

    if (this.form) {
      if (this.visuals.isRecorderUnloaded()) {
        isDirty = false;
      } else if (this.submitted) {
        isDirty = false;
      } else if (this.isReplayShown() || this.isPaused()) {
        isDirty = true;
      }
    }

    return isDirty;
  }

  public getReplay() {
    return this.visuals.getReplay();
  }

  public isOutsideElementOf(element: HTMLElement) {
    return (
      element.parentNode !== this.containerElement && element !== this.containerElement
    );
  }

  // Only used for replays
  public loadForm(videomail: Videomail) {
    if (!this.form) {
      return;
    }

    this.form.loadVideomail(videomail);
    this.validate();
  }

  public enableAudio() {
    this.options = setAudioEnabled(true, this.options);
    this.emit("ENABLING_AUDIO");
  }

  public disableAudio() {
    this.options = setAudioEnabled(false, this.options);
    this.emit("DISABLING_AUDIO");
  }

  public async submit() {
    this.options.logger.debug("Container: submit()");

    // Auto-validation needs a cached result. Otherwise, the host handles validation.
    if (!this.options.enableAutoValidation || this.lastValidation) {
      return await this.form?.doTheSubmit();
    }

    return false;
  }

  public isCountingDown() {
    return this.visuals.isCountingDown();
  }

  public isRecording() {
    return this.visuals.isRecording();
  }

  public record() {
    this.visuals.record();
  }

  public resume() {
    void this.visuals.resume().catch((exc: unknown) => {
      this.emit("ERROR", { exc });
    });
  }

  public stop() {
    this.visuals.stop();
  }

  public recordAgain() {
    this.visuals.recordAgain();
  }

  public setLimitSeconds(limitSeconds: number) {
    this.options.video.limitSeconds = limitSeconds;
    this.visuals.setLimitSeconds(limitSeconds);
  }
}

export default Container;
