import contains from "contains";
import hidden from "hidden";
import h from "hyperscript";
import inherits from "inherits";

import Events from "../events";
import EventEmitter from "../util/eventEmitter";

const Buttons = function (container, options) {
  EventEmitter.call(this, options, "Buttons");

  const self = this;
  const { debug } = options;

  let buttonsElement;
  let recordButton;
  let pauseButton;
  let resumeButton;
  let previewButton;
  let recordAgainButton;
  let submitButton;

  let audioOnRadioPair;
  let audioOffRadioPair;

  let built;

  function hide(elements) {
    if (elements && !Array.isArray(elements)) {
      elements = [elements];
    }

    elements &&
      elements.forEach(function (element) {
        hidden(element, true);
      });
  }

  function show(elements) {
    if (elements && !Array.isArray(elements)) {
      elements = [elements];
    }

    elements &&
      elements.forEach(function (element) {
        hidden(element, false);
      });
  }

  function isShown(elements) {
    let isShown = elements && true;

    if (elements && !Array.isArray(elements)) {
      elements = [elements];
    }

    elements &&
      elements.forEach(function (element) {
        isShown &&= element && !hidden(element);
      });

    return isShown;
  }

  function disable(elements) {
    if (elements && !Array.isArray(elements)) {
      elements = [elements];
    }

    elements &&
      elements.forEach(function (element) {
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

  function enable(elements) {
    if (elements && !Array.isArray(elements)) {
      elements = [elements];
    }

    elements &&
      elements.forEach(function (element) {
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

  function adjustButton(buttonElement, show, type, disabled) {
    if (disabled) {
      disable(buttonElement);
    }

    if (type) {
      buttonElement.type = type;
    } else if (!buttonElement.type) {
      buttonElement.type = "button";
    }

    !show && hide(buttonElement);

    return buttonElement;
  }

  function replaceClickHandler(element, clickHandler) {
    const wrappedClickHandler = (e) => {
      e && e.preventDefault();

      try {
        clickHandler({ event: e });
      } catch (exc) {
        self.emit(Events.ERROR, exc);
      }
    };

    element.onclick = wrappedClickHandler;
  }

  function makeRadioButtonPair(options) {
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
      if (submitButton && contains(buttonsElement, submitButton)) {
        buttonsElement.insertBefore(radioButtonGroup, submitButton);
      } else {
        buttonsElement.appendChild(radioButtonGroup);
      }
    }

    if (options.changeHandler) {
      radioButtonElement.onchange = options.changeHandler;
    }

    disable(radioButtonElement);

    return radioButtonElement;
  }

  function makeButton(
    buttonClass,
    text,
    clickHandler,
    show,
    id,
    type,
    selector,
    disabled = true,
  ) {
    let buttonElement;

    if (id) {
      buttonElement = document.getElementById(id);
    } else if (selector) {
      buttonElement = document.querySelector(selector);
    } else {
      buttonElement = buttonsElement.querySelector(`.${buttonClass}`);
    }

    if (!buttonElement) {
      if (options.selectors.buttonClass) {
        buttonClass += `.${options.selectors.buttonClass}`;
      }

      buttonElement = h(`button.${buttonClass}`);
      buttonElement = adjustButton(buttonElement, show, type, disabled);

      buttonElement.innerHTML = text;

      // double check that submit button is already in the buttonsElement container
      if (submitButton && contains(buttonsElement, submitButton)) {
        buttonsElement.insertBefore(buttonElement, submitButton);
      } else {
        buttonsElement.appendChild(buttonElement);
      }
    } else {
      buttonElement = adjustButton(buttonElement, show, type, disabled);
    }

    if (clickHandler) {
      replaceClickHandler(buttonElement, clickHandler);
    }

    return buttonElement;
  }

  function buildButtons() {
    if (!options.disableSubmit) {
      if (!submitButton) {
        submitButton = makeButton(
          options.selectors.submitButtonClass,
          "Submit",
          null,
          true,
          options.selectors.submitButtonId,
          "submit",
          options.selectors.submitButtonSelector,
          options.enableAutoValidation,
        );
      } else {
        disable(submitButton);
      }

      /*
       * no need to listen to the submit event when it's already listened
       * within the form element class
       */
      if (!container.hasForm() && submitButton) {
        replaceClickHandler(submitButton, submit);
      }
    }

    recordButton = makeButton(
      options.selectors.recordButtonClass,
      options.text.buttons.record,
      record,
      false,
    );

    if (options.enablePause) {
      pauseButton = makeButton(
        options.selectors.pauseButtonClass,
        options.text.buttons.pause,
        container.pause,
        false,
      );
    }

    if (options.enablePause) {
      resumeButton = makeButton(
        options.selectors.resumeButtonClass,
        options.text.buttons.resume,
        container.resume,
        false,
      );
    }

    /*
     * show stop only when pause is enabled - looks better that way otherwise button
     * move left and right between record and stop (preview)
     */
    previewButton = makeButton(
      options.selectors.previewButtonClass,
      options.text.buttons.preview,
      container.stop,
      false,
    );

    recordAgainButton = makeButton(
      options.selectors.recordAgainButtonClass,
      options.text.buttons.recordAgain,
      recordAgain,
      false,
    );

    if (options.audio && options.audio.switch) {
      audioOffRadioPair = makeRadioButtonPair({
        id: "audioOffOption",
        name: "audio",
        value: "off",
        label: options.text.audioOff,
        checked: !options.isAudioEnabled(),
        changeHandler() {
          container.disableAudio();
        },
      });

      audioOnRadioPair = makeRadioButtonPair({
        id: "audioOnOption",
        name: "audio",
        value: "on",
        label: options.text.audioOn,
        checked: options.isAudioEnabled(),
        changeHandler() {
          container.enableAudio();
        },
      });
    }
  }

  function onFormReady(params) {
    // no need to show record button when doing a record again
    if (!isShown(recordAgainButton)) {
      if (!params.paused) {
        show(recordButton);
      }
    }

    if (!params.paused) {
      disable(previewButton);
      hide(previewButton);
    }

    if (!options.enableAutoValidation) {
      enable(submitButton);
    }

    if (!params.recordWhenReady) {
      if (isShown(audioOnRadioPair)) {
        enable(audioOnRadioPair);
      }

      if (isShown(audioOffRadioPair)) {
        enable(audioOffRadioPair);
      }
    }
  }

  function onGoingBack() {
    hide(recordAgainButton);
    show(recordButton);
    show(submitButton);
  }

  function onReplayShown() {
    self.hide();
  }

  function onUserMediaReady(params) {
    onFormReady(params);

    if (isShown(recordButton) && !params.recordWhenReady) {
      enable(recordButton);
    }

    if (options.enableAutoValidation) {
      disable(submitButton);
    }
  }

  function onResetting() {
    disable(submitButton);

    self.reset();
  }

  function onPreview() {
    hide(recordButton);
    hide(previewButton);
    disable(audioOnRadioPair);
    disable(audioOffRadioPair);

    show(recordAgainButton);
    enable(recordAgainButton);

    if (!options.enableAutoValidation) {
      enable(submitButton);
    }
  }

  this.enableSubmit = function () {
    enable(submitButton);
  };

  this.adjustButtonsForPause = function () {
    if (!self.isCountingDown()) {
      pauseButton && hide(pauseButton);
      show(resumeButton);
      enable(resumeButton);
      hide(recordButton);
      show(previewButton);
      enable(previewButton);
    }
  };

  function onFirstFrameSent() {
    hide(recordButton);
    hide(recordAgainButton);

    if (pauseButton) {
      show(pauseButton);
      enable(pauseButton);
    }

    enable(previewButton);
    show(previewButton);
  }

  function onRecording(framesCount) {
    /*
     * it is possible to hide while recording, hence
     * check framesCount first (coming from recorder)
     */
    if (framesCount > 1) {
      onFirstFrameSent();
    } else {
      disable(audioOffRadioPair);
      disable(audioOnRadioPair);
      disable(recordAgainButton);
      disable(recordButton);
    }
  }

  function onResuming() {
    hide(resumeButton);
    hide(recordButton);

    if (pauseButton) {
      enable(pauseButton);
      show(pauseButton);
    }
  }

  function onStopping() {
    disable(previewButton);
    disable(recordButton);

    hide(pauseButton);
    hide(resumeButton);
  }

  function onCountdown() {
    disable(recordButton);
    disable(audioOffRadioPair);
    disable(audioOnRadioPair);
  }

  function onSubmitting() {
    debug("Buttons: onSubmitting()");
    disable(submitButton);
    disable(recordAgainButton);
  }

  function onSubmitted() {
    disable(previewButton);
    disable(recordAgainButton);
    disable(recordButton);
    disable(submitButton);
  }

  function onInvalid() {
    if (options.enableAutoValidation) {
      disable(submitButton);
    }
  }

  function onValid() {
    if (options.enableAutoValidation) {
      enable(submitButton);
    }
  }

  function onHidden() {
    hide(recordButton);
    hide(previewButton);
    hide(recordAgainButton);
    hide(resumeButton);
  }

  function onEnablingAudio() {
    debug("Buttons: onEnablingAudio()");

    disable(recordButton);
    disable(audioOnRadioPair);
    disable(audioOffRadioPair);
  }

  function onDisablingAudio() {
    debug("Buttons: onDisablingAudio()");

    disable(recordButton);
    disable(audioOnRadioPair);
    disable(audioOffRadioPair);
  }

  function recordAgain() {
    disable(recordAgainButton);
    container.beginWaiting();
    container.recordAgain();
  }

  function onStartingOver() {
    show(submitButton);
  }

  function submit() {
    container.submit();
  }

  function record(params) {
    disable(recordButton);
    container.record(params);
  }

  function initEvents() {
    debug("Buttons: initEvents()");

    self
      .on(Events.USER_MEDIA_READY, function (params) {
        if (!params.switchingFacingMode) {
          onUserMediaReady(params);
        }
      })
      .on(Events.PREVIEW, function () {
        onPreview();
      })
      .on(Events.PAUSED, function () {
        self.adjustButtonsForPause();
      })
      .on(Events.RECORDING, function (framesCount) {
        onRecording(framesCount);
      })
      .on(Events.FIRST_FRAME_SENT, function () {
        onFirstFrameSent();
      })
      .on(Events.RESUMING, function () {
        onResuming();
      })
      .on(Events.STOPPING, function () {
        onStopping();
      })
      .on(Events.COUNTDOWN, function () {
        onCountdown();
      })
      .on(Events.SUBMITTING, function () {
        onSubmitting();
      })
      .on(Events.RESETTING, function () {
        onResetting();
      })
      .on(Events.INVALID, function () {
        onInvalid();
      })
      .on(Events.VALID, function () {
        onValid();
      })
      .on(Events.SUBMITTED, function () {
        onSubmitted();
      })
      .on(Events.HIDE, function () {
        onHidden();
      })
      .on(Events.FORM_READY, function (params) {
        onFormReady(params);
      })
      .on(Events.REPLAY_SHOWN, function () {
        onReplayShown();
      })
      .on(Events.GOING_BACK, function () {
        onGoingBack();
      })
      .on(Events.ENABLING_AUDIO, function () {
        onEnablingAudio();
      })
      .on(Events.DISABLING_AUDIO, function () {
        onDisablingAudio();
      })
      .on(Events.STARTING_OVER, function () {
        onStartingOver();
      })
      .on(Events.CONNECTED, function () {
        if (options.loadUserMediaOnRecord) {
          if (isShown(recordButton)) {
            enable(recordButton);
          }
        }
      })
      .on(Events.ERROR, function (err) {
        /*
         * since https://github.com/binarykitchen/videomail-client/issues/60
         * we hide areas to make it easier for the user
         */
        if (err.hideButtons && err.hideButtons() && options.adjustFormOnBrowserError) {
          self.hide();
        }
      });
  }

  this.reset = function () {
    options.debug("Buttons: reset()");

    disable(pauseButton);
    disable(resumeButton);
    disable(recordButton);
    disable(previewButton);
    disable(recordAgainButton);
    disable(audioOnRadioPair);
    disable(audioOffRadioPair);
  };

  this.isRecordAgainButtonEnabled = function () {
    return !recordAgainButton.disabled;
  };

  this.isReady = function () {
    if (!recordButton) {
      // No recordButton? Ok, must be in playerOnly mode. So, not ready for recording
      return false;
    }

    return this.isRecordButtonEnabled();
  };

  this.isRecordButtonEnabled = function () {
    return !recordButton.disabled;
  };

  this.setSubmitButton = function (newSubmitButton) {
    submitButton = newSubmitButton;
  };

  this.getSubmitButton = function () {
    return submitButton;
  };

  this.build = function () {
    buttonsElement = container.querySelector(`.${options.selectors.buttonsClass}`);

    if (!buttonsElement) {
      buttonsElement = h(`div.${options.selectors.buttonsClass}`);

      container.appendChild(buttonsElement);
    }

    buildButtons();

    !built && initEvents();

    built = true;
  };

  this.unload = function () {
    if (built) {
      debug("Buttons: unload()");

      self.removeAllListeners();

      built = false;
    }
  };

  this.hide = function (params) {
    hide(buttonsElement);

    if (params && params.deep) {
      hide(recordButton);
      hide(pauseButton);
      hide(resumeButton);
      hide(previewButton);
      hide(recordAgainButton);
      hide(submitButton);
    }
  };

  this.show = function () {
    show(buttonsElement);
  };

  this.isCountingDown = function () {
    return container.isCountingDown();
  };
};

inherits(Buttons, EventEmitter);

export default Buttons;
