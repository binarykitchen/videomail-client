import contains from "contains";
import hidden from "hidden";

import Despot from "../util/Despot";
import { isAudioEnabled } from "../util/options/audio";
import Container, { FormReadyParams } from "./container";
import { VideomailClientOptions } from "../types/options";
import { ErrorParams, RecordingParams, UserMediaReadyParams } from "../types/events";

type ButtonType = "submit" | "reset" | "button";

type ClickHandler = (params: { event: MouseEvent }) => void;

interface RadioButtonOptions {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  changeHandler: () => void;
}

class Buttons extends Despot {
  private container: Container;

  private buttonsElement?: HTMLElement | null | undefined;
  private recordButton?: HTMLButtonElement;
  private pauseButton?: HTMLButtonElement;
  private resumeButton?: HTMLButtonElement;
  private previewButton?: HTMLButtonElement;
  private recordAgainButton?: HTMLButtonElement;
  private submitButton?: HTMLButtonElement;

  private audioOnRadioPair;
  private audioOffRadioPair;

  private built = false;

  constructor(container: Container, options: VideomailClientOptions) {
    super("Buttons", options);

    this.container = container;
  }

  private hideElement(element?: HTMLElement | null) {
    if (!element) {
      return;
    }

    hidden(element, true);
  }

  private showElement(element?: HTMLElement | null) {
    if (!element) {
      return;
    }

    hidden(element, false);
  }

  private isShown(element?: HTMLElement | null) {
    if (!element) {
      return false;
    }

    return !hidden(element);
  }

  private disable(element?: HTMLElement) {
    if (!element) {
      return;
    }

    if (element.tagName === "INPUT" || element.tagName === "BUTTON") {
      element.setAttribute("disabled", "true");
    } else {
      element.classList.add("disabled");
    }
  }

  private enable(element?: HTMLElement) {
    if (!element) {
      return;
    }

    if (element.tagName === "INPUT" || element.tagName === "BUTTON") {
      element.removeAttribute("disabled");
    } else {
      element.classList.remove("disabled");
    }
  }

  private adjustButton(
    buttonElement: HTMLButtonElement,
    show?: boolean,
    type?: ButtonType,
    disabled?: boolean,
  ) {
    if (disabled) {
      this.disable(buttonElement);
    }

    if (type) {
      buttonElement.type = type;
    }

    if (!show) {
      this.hideElement(buttonElement);
    }

    return buttonElement;
  }

  private replaceClickHandler(element: HTMLButtonElement, clickHandler: ClickHandler) {
    const wrappedClickHandler = (ev: MouseEvent) => {
      ev.preventDefault();

      try {
        clickHandler({ event: ev });
      } catch (exc) {
        this.emit("ERROR", { exc });
      }
    };

    element.onclick = wrappedClickHandler;
  }

  private makeRadioButtonPair(options: RadioButtonOptions) {
    let radioButtonElement: HTMLInputElement | null | undefined;
    let radioButtonGroup: HTMLSpanElement | null;

    if (options.id) {
      radioButtonElement = document.querySelector<HTMLInputElement>(`#${options.id}`);
    }

    if (!radioButtonElement) {
      radioButtonElement = document.createElement("input");

      radioButtonElement.id = options.id;
      radioButtonElement.type = "radio";
      radioButtonElement.name = options.name;
      radioButtonElement.value = options.value;
      radioButtonElement.checked = options.checked;

      radioButtonGroup = document.createElement("span");
      radioButtonGroup.classList.add("radioGroup");

      radioButtonGroup.appendChild(radioButtonElement);

      const radioLabel = document.createElement("label");
      radioLabel.htmlFor = options.id;
      radioLabel.textContent = options.label;

      radioButtonGroup.appendChild(radioLabel);

      // double check that submit button is already in the buttonsElement container as a child?
      if (this.submitButton && contains(this.buttonsElement, this.submitButton)) {
        this.buttonsElement?.insertBefore(radioButtonGroup, this.submitButton);
      } else {
        this.buttonsElement?.appendChild(radioButtonGroup);
      }
    }

    radioButtonElement.onchange = options.changeHandler;

    this.disable(radioButtonElement);

    return radioButtonElement;
  }

  private makeButton(
    buttonClass: string,
    text: string,
    clickHandler?: ClickHandler,
    show?: boolean,
    id?: string,
    type?: ButtonType,
    selector?,
    disabled = true,
  ) {
    let buttonElement: HTMLButtonElement | null | undefined;

    if (id) {
      buttonElement = document.querySelector<HTMLButtonElement>(`#${id}`);
    } else if (selector) {
      buttonElement = document.querySelector(selector);
    } else {
      buttonElement = this.buttonsElement?.querySelector(`.${buttonClass}`);
    }

    if (!buttonElement) {
      buttonElement = document.createElement("button");
      buttonElement.classList.add(buttonClass);

      if (this.options.selectors.buttonClass) {
        buttonElement.classList.add(this.options.selectors.buttonClass);
      }

      buttonElement = this.adjustButton(buttonElement, show, type, disabled);

      buttonElement.innerHTML = text;

      // double check that submit button is already in the buttonsElement container
      if (this.submitButton && contains(this.buttonsElement, this.submitButton)) {
        this.buttonsElement?.insertBefore(buttonElement, this.submitButton);
      } else {
        this.buttonsElement?.appendChild(buttonElement);
      }
    } else {
      buttonElement = this.adjustButton(buttonElement, show, type, disabled);
    }

    if (clickHandler) {
      this.replaceClickHandler(buttonElement, clickHandler);
    }

    return buttonElement;
  }

  private buildButtons() {
    if (!this.options.disableSubmit) {
      if (!this.submitButton) {
        this.submitButton = this.makeButton(
          this.options.selectors.submitButtonClass,
          "Submit",
          undefined,
          true,
          this.options.selectors.submitButtonId,
          "submit",
          this.options.selectors.submitButtonSelector,
          this.options.enableAutoValidation,
        );
      } else {
        this.disable(this.submitButton);
      }

      /*
       * no need to listen to the submit event when it's already listened
       * within the form element class
       */
      if (!this.container.hasForm()) {
        this.replaceClickHandler(this.submitButton, this.submit.bind(this));
      }
    }

    this.recordButton = this.makeButton(
      this.options.selectors.recordButtonClass,
      this.options.text.buttons.record,
      this.record.bind(this),
      false,
    );

    if (this.options.enablePause) {
      this.pauseButton = this.makeButton(
        this.options.selectors.pauseButtonClass,
        this.options.text.buttons.pause,
        this.container.pause.bind(this.container),
        false,
      );
    }

    if (this.options.enablePause) {
      this.resumeButton = this.makeButton(
        this.options.selectors.resumeButtonClass,
        this.options.text.buttons.resume,
        this.container.resume.bind(this.container),
        false,
      );
    }

    /*
     * show stop only when pause is enabled - looks better that way otherwise button
     * move left and right between record and stop (preview)
     */
    this.previewButton = this.makeButton(
      this.options.selectors.previewButtonClass,
      this.options.text.buttons.preview,
      this.container.stop.bind(this.container),
      false,
    );

    this.recordAgainButton = this.makeButton(
      this.options.selectors.recordAgainButtonClass,
      this.options.text.buttons.recordAgain,
      this.recordAgain.bind(this),
      false,
    );

    if (this.options.audio.switch) {
      this.audioOffRadioPair = this.makeRadioButtonPair({
        id: "audioOffOption",
        name: "audio",
        value: "off",
        label: this.options.text.audioOff,
        checked: !isAudioEnabled(this.options),
        changeHandler: () => {
          this.container.disableAudio();
        },
      });

      this.audioOnRadioPair = this.makeRadioButtonPair({
        id: "audioOnOption",
        name: "audio",
        value: "on",
        label: this.options.text.audioOn,
        checked: isAudioEnabled(this.options),
        changeHandler: () => {
          this.container.enableAudio();
        },
      });
    }
  }

  private onFormReady(params?: FormReadyParams) {
    // no need to show record button when doing a record again
    if (!this.isShown(this.recordAgainButton)) {
      if (!params?.paused) {
        this.showElement(this.recordButton);
      }
    }

    if (!params?.paused) {
      this.disable(this.previewButton);
      this.hideElement(this.previewButton);
    }

    if (!this.options.enableAutoValidation) {
      this.enable(this.submitButton);
    }
  }

  private onGoingBack() {
    this.hideElement(this.recordAgainButton);
    this.showElement(this.recordButton);
    this.showElement(this.submitButton);
  }

  private onReplayShown() {
    this.hide();
  }

  private onUserMediaReady(params: UserMediaReadyParams) {
    this.onFormReady();

    if (this.isShown(this.recordButton) && !params.recordWhenReady) {
      this.enable(this.recordButton);
    } else if (this.isShown(this.recordAgainButton) && !params.recordWhenReady) {
      this.enable(this.recordAgainButton);
    }

    if (this.options.enableAutoValidation) {
      this.disable(this.submitButton);
    }

    if (!params.recordWhenReady) {
      if (this.isShown(this.audioOnRadioPair)) {
        this.enable(this.audioOnRadioPair);
      }

      if (this.isShown(this.audioOffRadioPair)) {
        this.enable(this.audioOffRadioPair);
      }
    }
  }

  private onResetting() {
    this.disable(this.submitButton);
    this.reset();
  }

  private onPreview() {
    this.hideElement(this.recordButton);
    this.hideElement(this.previewButton);

    this.disable(this.audioOnRadioPair);
    this.disable(this.audioOffRadioPair);

    this.showElement(this.recordAgainButton);
    this.enable(this.recordAgainButton);

    if (!this.options.enableAutoValidation) {
      this.enable(this.submitButton);
    }
  }

  public enableSubmit() {
    this.enable(this.submitButton);
  }

  public adjustButtonsForPause() {
    if (!this.isCountingDown()) {
      if (this.pauseButton) {
        this.hideElement(this.pauseButton);
      }

      this.showElement(this.resumeButton);
      this.enable(this.resumeButton);
      this.hideElement(this.recordButton);
      this.showElement(this.previewButton);
      this.enable(this.previewButton);
    }
  }

  private onFirstFrameSent() {
    this.hideElement(this.recordButton);
    this.hideElement(this.recordAgainButton);

    if (this.pauseButton) {
      this.showElement(this.pauseButton);
      this.enable(this.pauseButton);
    }

    this.enable(this.previewButton);
    this.showElement(this.previewButton);
  }

  private onRecording(params: RecordingParams) {
    /*
     * it is possible to hide while recording, hence
     * check framesCount first (coming from recorder)
     */
    if (params.framesCount > 1) {
      this.onFirstFrameSent();
    } else {
      this.disable(this.audioOffRadioPair);
      this.disable(this.audioOnRadioPair);
      this.disable(this.recordAgainButton);
      this.disable(this.recordButton);
    }
  }

  private onResuming() {
    this.hideElement(this.resumeButton);
    this.hideElement(this.recordButton);

    if (this.pauseButton) {
      this.enable(this.pauseButton);
      this.showElement(this.pauseButton);
    }
  }

  private onStopping() {
    this.disable(this.previewButton);
    this.disable(this.recordButton);

    this.hideElement(this.pauseButton);
    this.hideElement(this.resumeButton);
  }

  private onCountdown() {
    this.disable(this.recordButton);
    this.disable(this.audioOffRadioPair);
    this.disable(this.audioOnRadioPair);
  }

  private onSubmitting() {
    this.options.logger.debug("Buttons: onSubmitting()");
    this.disable(this.submitButton);
    this.disable(this.recordAgainButton);
  }

  private onSubmitted() {
    this.disable(this.previewButton);
    this.disable(this.recordAgainButton);
    this.disable(this.recordButton);
    this.disable(this.submitButton);
  }

  private onInvalid() {
    if (this.options.enableAutoValidation) {
      this.disable(this.submitButton);
    }
  }

  private onValid() {
    if (this.options.enableAutoValidation) {
      this.enable(this.submitButton);
    }
  }

  private onHidden() {
    this.hideElement(this.recordButton);
    this.hideElement(this.previewButton);
    this.hideElement(this.recordAgainButton);
    this.hideElement(this.resumeButton);
    this.hideElement(this.audioOnRadioPair);
    this.hideElement(this.audioOffRadioPair);
  }

  private onEnablingAudio() {
    this.options.logger.debug("Buttons: onEnablingAudio()");

    this.disable(this.recordButton);
    this.disable(this.audioOnRadioPair);
    this.disable(this.audioOffRadioPair);
  }

  private onDisablingAudio() {
    this.options.logger.debug("Buttons: onDisablingAudio()");

    this.disable(this.recordButton);
    this.disable(this.audioOnRadioPair);
    this.disable(this.audioOffRadioPair);
  }

  private recordAgain() {
    this.disable(this.recordAgainButton);
    this.container.beginWaiting();
    this.container.recordAgain();
  }

  private onStartingOver() {
    this.showElement(this.submitButton);
  }

  private submit() {
    this.container.submit();
  }

  private record() {
    this.disable(this.recordButton);
    this.container.record();
  }

  private initEvents() {
    this.options.logger.debug("Buttons: initEvents()");

    this.on("USER_MEDIA_READY", (params: UserMediaReadyParams) => {
      if (!params.switchingFacingMode) {
        this.onUserMediaReady(params);
      }
    });

    this.on("PREVIEW", () => {
      this.onPreview();
    });

    this.on("PAUSED", () => {
      this.adjustButtonsForPause();
    });

    this.on("RECORDING", (params: RecordingParams) => {
      this.onRecording(params);
    });

    this.on("FIRST_FRAME_SENT", () => {
      this.onFirstFrameSent();
    });

    this.on("RESUMING", () => {
      this.onResuming();
    });

    this.on("STOPPING", () => {
      this.onStopping();
    });

    this.on("COUNTDOWN", () => {
      this.onCountdown();
    });

    this.on("SUBMITTING", () => {
      this.onSubmitting();
    });

    this.on("RESETTING", () => {
      this.onResetting();
    });

    this.on("INVALID", () => {
      this.onInvalid();
    });

    this.on("VALID", () => {
      this.onValid();
    });

    this.on("SUBMITTED", () => {
      this.onSubmitted();
    });

    this.on("HIDE", () => {
      this.onHidden();
    });

    this.on("FORM_READY", (params: FormReadyParams) => {
      this.onFormReady(params);
    });

    this.on("REPLAY_SHOWN", () => {
      this.onReplayShown();
    });

    this.on("GOING_BACK", () => {
      this.onGoingBack();
    });

    this.on("ENABLING_AUDIO", () => {
      this.onEnablingAudio();
    });

    this.on("DISABLING_AUDIO", () => {
      this.onDisablingAudio();
    });

    this.on("STARTING_OVER", () => {
      this.onStartingOver();
    });

    this.on("CONNECTED", () => {
      if (this.options.loadUserMediaOnRecord) {
        if (this.isShown(this.recordButton)) {
          this.enable(this.recordButton);
        }
      }
    });

    this.on("DISCONNECTED", () => {
      this.disable(this.recordButton);
      this.disable(this.audioOnRadioPair);
      this.disable(this.audioOffRadioPair);
    });

    this.on("ERROR", (params: ErrorParams) => {
      /*
       * since https://github.com/binarykitchen/videomail-client/issues/60
       * we hide areas to make it easier for the user
       */
      if (params.err?.isBrowserProblem() && this.options.adjustFormOnBrowserError) {
        this.hide();
      }
    });
  }

  public reset() {
    this.options.logger.debug("Buttons: reset()");

    this.disable(this.pauseButton);
    this.disable(this.resumeButton);
    this.disable(this.recordButton);
    this.disable(this.previewButton);
    this.disable(this.recordAgainButton);
    this.disable(this.audioOnRadioPair);
    this.disable(this.audioOffRadioPair);
  }

  public isRecordAgainButtonEnabled() {
    return !this.recordAgainButton?.disabled;
  }

  public isReady() {
    if (!this.recordButton) {
      // No recordButton? Ok, must be in playerOnly mode. So, not ready for recording
      return false;
    }

    return this.isRecordButtonEnabled();
  }

  public isRecordButtonEnabled() {
    return !this.recordButton?.disabled;
  }

  public setSubmitButton(newSubmitButton) {
    this.submitButton = newSubmitButton;
  }

  public getSubmitButton() {
    return this.submitButton;
  }

  public build() {
    this.buttonsElement = this.container.querySelector(
      `.${this.options.selectors.buttonsClass}`,
    );

    if (!this.buttonsElement) {
      this.buttonsElement = document.createElement("div");
      this.buttonsElement.classList.add(this.options.selectors.buttonsClass);

      this.container.appendChild(this.buttonsElement);
    }

    this.buildButtons();

    if (!this.built) {
      this.initEvents();
    }

    this.built = true;
  }

  public unload() {
    if (this.built) {
      // Disables all buttons
      this.reset();

      this.options.logger.debug("Buttons: unload()");
      this.removeAllListeners();

      this.hide();

      this.built = false;
    }
  }

  public hide(deep = false) {
    this.hideElement(this.buttonsElement);

    if (deep) {
      this.hideElement(this.recordButton);
      this.hideElement(this.pauseButton);
      this.hideElement(this.resumeButton);
      this.hideElement(this.previewButton);
      this.hideElement(this.recordAgainButton);
      this.hideElement(this.submitButton);
      this.hideElement(this.audioOnRadioPair);
      this.hideElement(this.audioOffRadioPair);
    }
  }

  public show() {
    this.showElement(this.buttonsElement);
  }

  public isCountingDown() {
    return this.container.isCountingDown();
  }
}

export default Buttons;
