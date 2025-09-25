import "./../styles/main.styl";

import Visibility from "document-visibility";
import Response from "superagent/lib/node/response";

import { ShowParams, StartOverParams } from "../client";
import Resource from "../resource";
import { ErrorParams } from "../types/events";
import { VideomailClientOptions } from "../types/options";
import type { Videomail } from "../types/Videomail";
import Despot from "../util/Despot";
import createError from "../util/error/createError";
import getBrowser from "../util/getBrowser";
import limitHeight from "../util/html/dimensions/limitHeight";
import limitWidth from "../util/html/dimensions/limitWidth";
import hideElement from "../util/html/hideElement";
import showElement from "../util/html/showElement";
import { isAutoPauseEnabled, setAudioEnabled } from "../util/options/audio";
import pretty from "../util/pretty";
import Buttons from "./buttons";
import Form, { FormInputs, FormMethod } from "./form";
import Visuals from "./visuals";
interface BuildOptions {
  playerOnly?: boolean;
  replayParentElementId?: string | undefined;
  replayParentElement?: HTMLElement | undefined;
}

export interface UnloadParams {
  startingOver?: boolean;
  e?: Event;
}

export interface FormReadyParams {
  paused?: boolean | undefined;
}

class Container extends Despot {
  private readonly visibility = Visibility();
  private readonly htmlElement = document.querySelector("html");

  private readonly visuals: Visuals;
  private readonly buttons: Buttons;
  private readonly resource: Resource;
  private form: Form | undefined;

  private hasError = false;
  private submitted = false;
  private lastValidation = false;

  private containerElement?: HTMLElement | null | undefined;

  private built = false;

  public constructor(options: VideomailClientOptions) {
    super("Container", options);

    this.visuals = new Visuals(this, options);
    this.buttons = new Buttons(this, options);
    this.resource = new Resource(options);
  }

  private buildChildren(playerOnly = false, parentElement?: HTMLElement | null) {
    this.options.logger.debug(
      `Container: buildChildren (playerOnly = ${playerOnly}${parentElement ? `, parentElement="${pretty(parentElement)}"` : ""})`,
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
        // Note, it can be undefined when e.g. just replaying a videomail or for storybooks
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

      // Check if the replayParentElement could act as the container element perhaps?
      if (!this.containerElement && replayParentElement) {
        if (
          replayParentElement.classList.contains(this.options.selectors.containerClass)
        ) {
          this.containerElement = replayParentElement;
        }
      }

      if (!this.built) {
        this.initEvents(buildOptions?.playerOnly);
      }

      if (!buildOptions?.playerOnly) {
        this.correctDimensions();
      }

      // Building form also applies for when `playerOnly` because of
      // correcting mode on Videomail. This function will skip if there is no form. Easy.
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
    // It's ok to return no form, especially when in replay mode
    let formElement: HTMLFormElement | undefined | null;

    if (this.containerElement && this.containerElement.tagName === "FORM") {
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
      this.form = new Form(this, formElement, this.options);

      const submitButton = this.form.findSubmitButton();

      if (submitButton) {
        this.buttons.setSubmitButton(submitButton);
      }

      this.form.build();
    }
  }

  private processError(params: ErrorParams) {
    this.hasError = true;

    if (params.err?.stack) {
      this.options.logger.error(params.err.stack);
    } else if (params.err?.message) {
      this.options.logger.error(params.err.message);
    } else if (params.exc) {
      if (params.exc instanceof Error) {
        if (params.exc.stack) {
          this.options.logger.error(params.exc.stack);
        } else if (params.exc.message) {
          this.options.logger.error(params.exc.message);
        }
      } else {
        this.options.logger.error(params.exc);
      }
    }

    if (this.options.displayErrors && params.err) {
      this.visuals.error(params.err);
    } else {
      this.visuals.reset();
    }
  }

  private initEvents(playerOnly = false) {
    this.options.logger.debug(`Container: initEvents (playerOnly = ${playerOnly})`);

    if (this.options.enableAutoUnload) {
      window.addEventListener(
        "beforeunload",
        (e) => {
          this.unload({ e });
        },
        { once: true },
      );
    }

    if (!playerOnly) {
      this.visibility.onChange((visible) => {
        // built? see https://github.com/binarykitchen/videomail.io/issues/326
        if (this.built) {
          if (visible) {
            if (isAutoPauseEnabled(this.options) && this.isCountingDown()) {
              this.resume();
            }

            this.emit("VISIBLE");
          } else {
            if (
              isAutoPauseEnabled(this.options) &&
              (this.isCountingDown() || this.isRecording())
            ) {
              this.pause();
            }

            this.emit("INVISIBLE");
          }
        }
      });
    }

    if (this.options.enableSpace) {
      if (!playerOnly) {
        window.addEventListener("keydown", (e: KeyboardEvent) => {
          const element = e.target as HTMLElement;
          const tagName = element.tagName;

          const isEditable =
            element.isContentEditable || element.contentEditable === "true";

          // beware of rich text editors, hence the isEditable check (wordpress plugin issue)
          if (
            !isEditable &&
            // Because of https://github.com/binarykitchen/videomail-client/issues/190
            tagName &&
            tagName.toUpperCase() !== "INPUT" &&
            tagName.toUpperCase() !== "TEXTAREA"
          ) {
            const code = e.code;

            if (code === "Space") {
              e.preventDefault();

              if (this.options.enablePause) {
                this.visuals.pauseOrResume();
              } else {
                this.visuals.recordOrStop();
              }
            }
          }
        });
      }
    }

    /*
     * better to keep the one and only error listeners
     * at one spot, here, because unload() will do a removeAllListeners()
     */
    this.on("ERROR", (params: ErrorParams) => {
      this.processError(params);

      this.endWaiting();

      const browser = getBrowser(this.options);

      if (browser.isMobile()) {
        this.removeDimensions();
      }
    });

    if (!playerOnly) {
      this.on("LOADED_META_DATA", () => {
        this.correctDimensions();
      });
    }
  }

  /*
   * This will just set the width but not the height because
   * it can be a form with more inputs elements
   */
  private correctDimensions() {
    if (this.options.video.stretch) {
      this.removeDimensions();
    } else if (this.containerElement) {
      const width = this.visuals.getRecorderWidth(true);

      if (width) {
        this.containerElement.style.width = `${width}px`;
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

  private hideMySelf() {
    hideElement(this.containerElement);
  }

  private async submitVideomail(formInputs: FormInputs, method: FormMethod) {
    const videomailFormData = this.form?.transformFormData(formInputs);

    if (!videomailFormData) {
      throw new Error("No videomail form data defined");
    }

    if (method === FormMethod.POST) {
      videomailFormData.recordingStats = this.visuals.getRecordingStats();

      videomailFormData.width = this.visuals.getRecorderWidth(true);
      videomailFormData.height = this.visuals.getRecorderHeight(true);

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

  public limitHeight(height: number) {
    return limitHeight(height, this.options, "containers limitHeight fn");
  }

  private areVisualsHidden() {
    return this.visuals.isHidden();
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
      Despot.removeAllListeners();

      this.built = this.submitted = false;
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

      if (paused) {
        this.buttons.adjustButtonsForPause();
      }

      /*
       * since https://github.com/binarykitchen/videomail-client/issues/60
       * we hide areas to make it easier for the user
       */
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

      const replay = this.getReplay();

      replay.hide();
      replay.reset();

      // Rebuild all again and initialise events again
      this.build();

      this.emit("STARTING_OVER");

      this.visuals.back(keepHidden, () => {
        this.enableForm(true);

        if (keepHidden) {
          /*
           * just enable form, do nothing else.
           * see example contact_form.html when you submit without videomail
           * and go back
           */
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

  // this code needs a good rewrite :(
  public validate(event?, force = false) {
    let runValidation = true;
    let valid = true;

    if (!this.options.enableAutoValidation) {
      runValidation = false;
      this.lastValidation = true; // needed so that it can be submitted anyway, see submit()
    } else if (force) {
      runValidation = force;
    } else if (this.isNotifying()) {
      runValidation = false;
    } else if (this.visuals.isConnected()) {
      runValidation = this.visuals.isUserMediaLoaded() ?? this.visuals.isReplayShown();
    } else if (this.visuals.isConnecting()) {
      runValidation = false;
    }

    if (runValidation) {
      const targetName = event?.target?.name;

      if (targetName) {
        this.emit("VALIDATING", { targetName });
      } else if (event) {
        this.emit("VALIDATING", { event });
      } else {
        this.emit("VALIDATING");
      }

      const visualsValid =
        this.visuals.validate() && this.buttons.isRecordAgainButtonEnabled();

      let whyInvalid;
      let invalidData: Record<string, any> | undefined;

      if (this.form) {
        const invalidInput = this.form.getInvalidElement();

        if (invalidInput) {
          const name = invalidInput.getAttribute("name");

          valid = false;

          if (name) {
            whyInvalid = `Input "${name}" seems wrong 🤔`;
            invalidData = { [name]: invalidInput.getAttribute("value") };
          }
        } else if (!this.areVisualsHidden() && !visualsValid) {
          // TODO Improve this check to have this based on `key`
          if (
            this.buttonsAreReady() ||
            this.isRecording() ||
            this.isPaused() ||
            this.isCountingDown()
          ) {
            valid = false;
            whyInvalid = "Don't forget to record a video 😉";
            invalidData = { key: undefined };
          }
        }

        if (valid) {
          /*
           * If CC and/or BCC exist, validate one more time to ensure at least
           * one recipient is given
           */
          const recipients = this.form.getRecipients();

          const toIsConfigured = "to" in recipients;
          const ccIsConfigured = "cc" in recipients;
          const bccIsConfigured = "bcc" in recipients;

          const hasTo = recipients.to && recipients.to.length > 0;
          const hasCc = recipients.cc && recipients.cc.length > 0;
          const hasBcc = recipients.bcc && recipients.bcc.length > 0;

          if (toIsConfigured) {
            if (!hasTo) {
              if (ccIsConfigured && bccIsConfigured) {
                if (!hasCc && !hasBcc) {
                  valid = false;
                }
              } else if (ccIsConfigured) {
                if (!hasCc) {
                  valid = false;
                }
              } else if (bccIsConfigured) {
                if (!hasBcc) {
                  valid = false;
                }
              } else {
                valid = false;
              }
            }
          } else if (ccIsConfigured) {
            if (!hasCc) {
              if (bccIsConfigured && !hasBcc) {
                valid = false;
              }
            }
          } else if (bccIsConfigured) {
            // Skip as it's hidden
          } else {
            // Form has no input fields for recipients, so don't validate
            // recipients at all
          }

          if (!valid) {
            whyInvalid = "At least one recipient is required";
          }
        }
      } else {
        valid = visualsValid;
      }

      if (valid) {
        this.emit("VALID");
      } else if (invalidData) {
        this.emit("INVALID", { whyInvalid, invalidData });
      } else {
        this.emit("INVALID", { whyInvalid });
      }

      this.lastValidation = valid;
    }

    return valid;
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

  private buttonsAreReady() {
    return this.buttons.isReady();
  }

  public async submitAll(formData: FormInputs, method: FormMethod, url: string) {
    let response: Response | undefined;

    try {
      const hasVideomailKey = Boolean(formData[this.options.selectors.keyInputName]);

      /*
       * !hasVideomailKey makes it possible to submit form when videomail itself
       * is not optional
       */
      if (!hasVideomailKey && !this.options.enableAutoSubmission) {
        return;
      }

      const output = [method, url].filter(Boolean).join(": ");
      this.options.logger.debug(`Container: submitAll(${output})`);

      this.beginWaiting();
      this.disableForm(true);
      this.emit("SUBMITTING");

      if (!hasVideomailKey) {
        response = await this.resource.form(formData, url);
        this.submitted = true;
        this.emit("SUBMITTED", { videomail: response.body, response });

        /*
         * ... and when the enableAutoSubmission option is false,
         * then that can mean, leave it to the framework to process with the form
         * validation/handling/submission itself. for example the ninja form
         * will want to highlight which one input are wrong.
         */
      } else {
        response = await this.submitVideomail(formData, method);
        this.submitted = true;
        this.emit("SUBMITTED", { videomail: response.body.videomail, response });
      }
    } catch (exc) {
      const err = createError({ exc, options: this.options });
      this.emit("ERROR", { err });
    } finally {
      if (response?.text && response.type === "text/html") {
        // server replied with HTML contents - display these
        document.body.innerHTML = response.text;
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
    if (this.form) {
      this.form.loadVideomail(videomail);
      this.validate();
    }
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

    if (this.lastValidation) {
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
    this.visuals.resume();
  }

  public stop() {
    this.visuals.stop();
  }

  public recordAgain() {
    this.visuals.recordAgain();
  }
}

export default Container;
