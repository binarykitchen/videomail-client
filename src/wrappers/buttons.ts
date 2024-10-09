import contains from "contains";
import hidden from "hidden";
import h from "hyperscript";

import Events from "../events";
import Despot from "../util/Despot";
import { isAudioEnabled } from "../util/options/audio";
import Container, { FormReadyParams } from "./container";
import { VideomailClientOptions } from "../types/options";
import VideomailError from "../util/error/VideomailError";
import { UserMediaParams } from "./visuals/recorder";

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

  private hideElements(elements) {
    let elementsToHide = elements;

    if (elements && !Array.isArray(elements)) {
      elementsToHide = [elements];
    }

    elementsToHide?.forEach(function (element) {
      hidden(element, true);
    });
  }

  private showElements(elements) {
    let elementsToShow = elements;

    if (elements && !Array.isArray(elements)) {
      elementsToShow = [elements];
    }

    elementsToShow?.forEach(function (element) {
      hidden(element, false);
    });
  }

  private isShown(elements) {
    let isShown = false;
    let elementsToCheck = elements;

    if (elements && !Array.isArray(elements)) {
      elementsToCheck = [elements];
    }

    elementsToCheck?.forEach(function (element) {
      isShown &&= element && !hidden(element);
    });

    return isShown;
  }

  private disable(elements) {
    let elementsToDisable = elements;

    if (elements && !Array.isArray(elements)) {
      elementsToDisable = [elements];
    }

    elementsToDisable?.forEach(function (element) {
      // https://github.com/binarykitchen/videomail-client/issues/148
      if (element) {
        if (element.tagName === "INPUT" || element.tagName === "BUTTON") {
          element.disabled = true;
        } else {
          element.classList.add("disabled");
        }
      }
    });
  }

  private enable(elements) {
    let elementsToEnable = elements;

    if (elements && !Array.isArray(elements)) {
      elementsToEnable = [elements];
    }

    elementsToEnable?.forEach(function (element) {
      // https://github.com/binarykitchen/videomail-client/issues/148
      if (element) {
        if (element.tagName === "INPUT" || element.tagName === "BUTTON") {
          element.disabled = false;
        } else {
          element.classList.remove("disabled");
        }
      }
    });
  }

  private adjustButton(buttonElement, show: boolean, type?: string, disabled?: boolean) {
    if (disabled) {
      this.disable(buttonElement);
    }

    if (type) {
      buttonElement.type = type;
    } else if (!buttonElement.type) {
      buttonElement.type = "button";
    }

    if (!show) {
      this.hideElements(buttonElement);
    }

    return buttonElement;
  }

  private replaceClickHandler(element, clickHandler) {
    const wrappedClickHandler = (e) => {
      e?.preventDefault();

      try {
        clickHandler({ event: e });
      } catch (exc) {
        this.emit(Events.ERROR, { exc });
      }
    };

    element.onclick = wrappedClickHandler;
  }

  private makeRadioButtonPair(options) {
    let radioButtonElement;
    let radioButtonGroup;

    if (options.id) {
      radioButtonElement = document.getElementById(options.id);
    }

    if (!radioButtonElement) {
      radioButtonElement = h(`input#${options.id}`, {
        type: "radio",
        name: options.name,
        value: options.value,
        checked: options.checked,
      });

      radioButtonGroup = h(
        "span.radioGroup",
        radioButtonElement,
        h(
          "label",
          {
            htmlFor: options.id,
          },
          options.label,
        ),
      );

      // double check that submit button is already in the buttonsElement container as a child?
      if (this.submitButton && contains(this.buttonsElement, this.submitButton)) {
        this.buttonsElement?.insertBefore(radioButtonGroup, this.submitButton);
      } else {
        this.buttonsElement?.appendChild(radioButtonGroup);
      }
    }

    if (options.changeHandler) {
      radioButtonElement.onchange = options.changeHandler;
    }

    this.disable(radioButtonElement);

    return radioButtonElement;
  }

  private makeButton(
    buttonClass: string,
    text: string,
    clickHandler,
    show: boolean,
    id?: string,
    type?: string,
    selector?,
    disabled = true,
  ) {
    let buttonElement;

    if (id) {
      buttonElement = document.getElementById(id);
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
          null,
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
      if (!this.container.hasForm() && this.submitButton) {
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
        this.container.pause.bind(this),
        false,
      );
    }

    if (this.options.enablePause) {
      this.resumeButton = this.makeButton(
        this.options.selectors.resumeButtonClass,
        this.options.text.buttons.resume,
        this.container.resume.bind(this),
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
      this.container.stop.bind(this),
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
        changeHandler() {
          this.container.disableAudio();
        },
      });

      this.audioOnRadioPair = this.makeRadioButtonPair({
        id: "audioOnOption",
        name: "audio",
        value: "on",
        label: this.options.text.audioOn,
        checked: isAudioEnabled(this.options),
        changeHandler() {
          this.container.enableAudio();
        },
      });
    }
  }

  private onFormReady(params?: FormReadyParams) {
    // no need to show record button when doing a record again
    if (!this.isShown(this.recordAgainButton)) {
      if (!params?.paused) {
        this.showElements(this.recordButton);
      }
    }

    if (!params?.paused) {
      this.disable(this.previewButton);
      this.hideElements(this.previewButton);
    }

    if (!this.options.enableAutoValidation) {
      this.enable(this.submitButton);
    }
  }

  private onGoingBack() {
    this.hideElements(this.recordAgainButton);
    this.showElements(this.recordButton);
    this.showElements(this.submitButton);
  }

  private onReplayShown() {
    this.hide();
  }

  private onUserMediaReady(params: UserMediaParams) {
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
    this.hideElements(this.recordButton);
    this.hideElements(this.previewButton);

    this.disable(this.audioOnRadioPair);
    this.disable(this.audioOffRadioPair);

    this.showElements(this.recordAgainButton);
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
        this.hideElements(this.pauseButton);
      }

      this.showElements(this.resumeButton);
      this.enable(this.resumeButton);
      this.hideElements(this.recordButton);
      this.showElements(this.previewButton);
      this.enable(this.previewButton);
    }
  }

  private onFirstFrameSent() {
    this.hideElements(this.recordButton);
    this.hideElements(this.recordAgainButton);

    if (this.pauseButton) {
      this.showElements(this.pauseButton);
      this.enable(this.pauseButton);
    }

    this.enable(this.previewButton);
    this.showElements(this.previewButton);
  }

  private onRecording(framesCount: number) {
    /*
     * it is possible to hide while recording, hence
     * check framesCount first (coming from recorder)
     */
    if (framesCount > 1) {
      this.onFirstFrameSent();
    } else {
      this.disable(this.audioOffRadioPair);
      this.disable(this.audioOnRadioPair);
      this.disable(this.recordAgainButton);
      this.disable(this.recordButton);
    }
  }

  private onResuming() {
    this.hideElements(this.resumeButton);
    this.hideElements(this.recordButton);

    if (this.pauseButton) {
      this.enable(this.pauseButton);
      this.showElements(this.pauseButton);
    }
  }

  private onStopping() {
    this.disable(this.previewButton);
    this.disable(this.recordButton);

    this.hideElements(this.pauseButton);
    this.hideElements(this.resumeButton);
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
    this.hideElements(this.recordButton);
    this.hideElements(this.previewButton);
    this.hideElements(this.recordAgainButton);
    this.hideElements(this.resumeButton);
    this.hideElements(this.audioOnRadioPair);
    this.hideElements(this.audioOffRadioPair);
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
    this.showElements(this.submitButton);
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

    this.on(Events.USER_MEDIA_READY, (params: UserMediaParams) => {
      if (!params.switchingFacingMode) {
        this.onUserMediaReady(params);
      }
    })
      .on(Events.PREVIEW, () => {
        this.onPreview();
      })
      .on(Events.PAUSED, () => {
        this.adjustButtonsForPause();
      })
      .on(Events.RECORDING, (framesCount: number) => {
        this.onRecording(framesCount);
      })
      .on(Events.FIRST_FRAME_SENT, () => {
        this.onFirstFrameSent();
      })
      .on(Events.RESUMING, () => {
        this.onResuming();
      })
      .on(Events.STOPPING, () => {
        this.onStopping();
      })
      .on(Events.COUNTDOWN, () => {
        this.onCountdown();
      })
      .on(Events.SUBMITTING, () => {
        this.onSubmitting();
      })
      .on(Events.RESETTING, () => {
        this.onResetting();
      })
      .on(Events.INVALID, () => {
        this.onInvalid();
      })
      .on(Events.VALID, () => {
        this.onValid();
      })
      .on(Events.SUBMITTED, () => {
        this.onSubmitted();
      })
      .on(Events.HIDE, () => {
        this.onHidden();
      })
      .on(Events.FORM_READY, (params: FormReadyParams) => {
        this.onFormReady(params);
      })
      .on(Events.REPLAY_SHOWN, () => {
        this.onReplayShown();
      })
      .on(Events.GOING_BACK, () => {
        this.onGoingBack();
      })
      .on(Events.ENABLING_AUDIO, () => {
        this.onEnablingAudio();
      })
      .on(Events.DISABLING_AUDIO, () => {
        this.onDisablingAudio();
      })
      .on(Events.STARTING_OVER, () => {
        this.onStartingOver();
      })
      .on(Events.CONNECTED, () => {
        if (this.options.loadUserMediaOnRecord) {
          if (this.isShown(this.recordButton)) {
            this.enable(this.recordButton);
          }
        }
      })
      .on(Events.DISCONNECTED, () => {
        this.disable(this.recordButton);
        this.disable(this.audioOnRadioPair);
        this.disable(this.audioOffRadioPair);
      })
      .on(Events.ERROR, (err: VideomailError) => {
        /*
         * since https://github.com/binarykitchen/videomail-client/issues/60
         * we hide areas to make it easier for the user
         */
        if (err.isBrowserProblem() && this.options.adjustFormOnBrowserError) {
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
    this.hideElements(this.buttonsElement);

    if (deep) {
      this.hideElements(this.recordButton);
      this.hideElements(this.pauseButton);
      this.hideElements(this.resumeButton);
      this.hideElements(this.previewButton);
      this.hideElements(this.recordAgainButton);
      this.hideElements(this.submitButton);
      this.hideElements(this.audioOnRadioPair);
      this.hideElements(this.audioOffRadioPair);
    }
  }

  public show() {
    this.showElements(this.buttonsElement);
  }

  public isCountingDown() {
    return this.container.isCountingDown();
  }
}

export default Buttons;
