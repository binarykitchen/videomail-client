import contains from "contains";

import Despot from "../util/Despot";
import { isAudioEnabled } from "../util/options/audio";
import Container, { FormReadyParams } from "./container";
import { VideomailClientOptions } from "../types/options";
import { ErrorParams, RecordingParams, UserMediaReadyParams } from "../types/events";
import disableElement from "../util/html/disableElement";
import enableElement from "../util/html/enableElement";
import hideElement from "../util/html/hideElement";
import showElement from "../util/html/showElement";
import isShown from "../util/html/isShown";
import adjustButton, { ButtonType } from "../util/html/adjustButton";

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

    disableElement(radioButtonElement);

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

      buttonElement = adjustButton(buttonElement, show, type, disabled);

      buttonElement.innerHTML = text;

      // double check that submit button is already in the buttonsElement container
      if (this.submitButton && contains(this.buttonsElement, this.submitButton)) {
        this.buttonsElement?.insertBefore(buttonElement, this.submitButton);
      } else {
        this.buttonsElement?.appendChild(buttonElement);
      }
    } else {
      buttonElement = adjustButton(buttonElement, show, type, disabled);
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
        disableElement(this.submitButton);
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
    if (!isShown(this.recordAgainButton)) {
      if (!params?.paused) {
        showElement(this.recordButton);
      }
    }

    if (!params?.paused) {
      disableElement(this.previewButton);
      hideElement(this.previewButton);
    }

    if (!this.options.enableAutoValidation) {
      enableElement(this.submitButton);
    }
  }

  private onGoingBack() {
    hideElement(this.recordAgainButton);
    showElement(this.recordButton);
    showElement(this.submitButton);
  }

  private onReplayShown() {
    this.hide();
  }

  private onUserMediaReady(params: UserMediaReadyParams) {
    this.onFormReady();

    if (isShown(this.recordButton) && !params.recordWhenReady) {
      enableElement(this.recordButton);
    } else if (isShown(this.recordAgainButton) && !params.recordWhenReady) {
      enableElement(this.recordAgainButton);
    }

    if (this.options.enableAutoValidation) {
      disableElement(this.submitButton);
    }

    if (!params.recordWhenReady) {
      if (isShown(this.audioOnRadioPair)) {
        enableElement(this.audioOnRadioPair);
      }

      if (isShown(this.audioOffRadioPair)) {
        enableElement(this.audioOffRadioPair);
      }
    }
  }

  private onResetting() {
    disableElement(this.submitButton);
    this.reset();
  }

  private onPreview() {
    hideElement(this.recordButton);
    hideElement(this.previewButton);

    disableElement(this.audioOnRadioPair);
    disableElement(this.audioOffRadioPair);

    showElement(this.recordAgainButton);
    enableElement(this.recordAgainButton);

    if (!this.options.enableAutoValidation) {
      enableElement(this.submitButton);
    }
  }

  public enableSubmit() {
    enableElement(this.submitButton);
  }

  public adjustButtonsForPause() {
    if (!this.isCountingDown()) {
      if (this.pauseButton) {
        hideElement(this.pauseButton);
      }

      showElement(this.resumeButton);
      enableElement(this.resumeButton);
      hideElement(this.recordButton);
      showElement(this.previewButton);
      enableElement(this.previewButton);
    }
  }

  private onFirstFrameSent() {
    hideElement(this.recordButton);
    hideElement(this.recordAgainButton);

    if (this.pauseButton) {
      showElement(this.pauseButton);
      enableElement(this.pauseButton);
    }

    enableElement(this.previewButton);
    showElement(this.previewButton);
  }

  private onRecording(params: RecordingParams) {
    /*
     * it is possible to hide while recording, hence
     * check framesCount first (coming from recorder)
     */
    if (params.framesCount > 1) {
      this.onFirstFrameSent();
    } else {
      disableElement(this.audioOffRadioPair);
      disableElement(this.audioOnRadioPair);
      disableElement(this.recordAgainButton);
      disableElement(this.recordButton);
    }
  }

  private onResuming() {
    hideElement(this.resumeButton);
    hideElement(this.recordButton);

    if (this.pauseButton) {
      enableElement(this.pauseButton);
      showElement(this.pauseButton);
    }
  }

  private onStopping() {
    disableElement(this.previewButton);
    disableElement(this.recordButton);

    hideElement(this.pauseButton);
    hideElement(this.resumeButton);
  }

  private onCountdown() {
    disableElement(this.recordButton);
    disableElement(this.audioOffRadioPair);
    disableElement(this.audioOnRadioPair);
  }

  private onSubmitting() {
    this.options.logger.debug("Buttons: onSubmitting()");
    disableElement(this.submitButton);
    disableElement(this.recordAgainButton);
  }

  private onSubmitted() {
    disableElement(this.previewButton);
    disableElement(this.recordAgainButton);
    disableElement(this.recordButton);
    disableElement(this.submitButton);
  }

  private onInvalid() {
    if (this.options.enableAutoValidation) {
      disableElement(this.submitButton);
    }
  }

  private onValid() {
    if (this.options.enableAutoValidation) {
      enableElement(this.submitButton);
    }
  }

  private onHidden() {
    hideElement(this.recordButton);
    hideElement(this.previewButton);
    hideElement(this.recordAgainButton);
    hideElement(this.resumeButton);
    hideElement(this.audioOnRadioPair);
    hideElement(this.audioOffRadioPair);
  }

  private onEnablingAudio() {
    this.options.logger.debug("Buttons: onEnablingAudio()");

    disableElement(this.recordButton);
    disableElement(this.audioOnRadioPair);
    disableElement(this.audioOffRadioPair);
  }

  private onDisablingAudio() {
    this.options.logger.debug("Buttons: onDisablingAudio()");

    disableElement(this.recordButton);
    disableElement(this.audioOnRadioPair);
    disableElement(this.audioOffRadioPair);
  }

  private recordAgain() {
    disableElement(this.recordAgainButton);
    this.container.beginWaiting();
    this.container.recordAgain();
  }

  private onStartingOver() {
    showElement(this.submitButton);
  }

  private submit() {
    void this.container.submit();
  }

  private record() {
    disableElement(this.recordButton);
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
        if (isShown(this.recordButton)) {
          enableElement(this.recordButton);
        }
      }
    });

    this.on("DISCONNECTED", () => {
      disableElement(this.recordButton);
      disableElement(this.audioOnRadioPair);
      disableElement(this.audioOffRadioPair);
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

    disableElement(this.pauseButton);
    disableElement(this.resumeButton);
    disableElement(this.recordButton);
    disableElement(this.previewButton);
    disableElement(this.recordAgainButton);
    disableElement(this.audioOnRadioPair);
    disableElement(this.audioOffRadioPair);
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
      Despot.removeAllListeners();

      this.hide();

      this.built = false;
    }
  }

  public hide(deep = false) {
    hideElement(this.buttonsElement);

    if (deep) {
      hideElement(this.recordButton);
      hideElement(this.pauseButton);
      hideElement(this.resumeButton);
      hideElement(this.previewButton);
      hideElement(this.recordAgainButton);
      hideElement(this.submitButton);
      hideElement(this.audioOnRadioPair);
      hideElement(this.audioOffRadioPair);
    }
  }

  public show() {
    showElement(this.buttonsElement);
  }

  public isCountingDown() {
    return this.container.isCountingDown();
  }
}

export default Buttons;
