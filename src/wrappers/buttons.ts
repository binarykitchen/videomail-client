import type {
  FormReadyParams,
  VideomailErrorParams,
  VideomailRecordingParams,
  VideomailUserMediaReadyParams,
} from "../types/events/params";
import { VideomailClientOptions } from "../types/options";
import type { DespotEmitter } from "../util/Despot";
import Despot from "../util/Despot";
import disableElement from "../util/html/disableElement";
import enableElement from "../util/html/enableElement";
import hideElement from "../util/html/hideElement";
import isShown from "../util/html/isShown";
import showElement from "../util/html/showElement";
import { isAudioEnabled } from "../util/options/audio";
import getOrCreateButton from "./buttons/getOrCreateButton";
import getOrCreateRadioButtonPair from "./buttons/getOrCreateRadioButtonPair";
import Container from "./container";

type ClickHandler = (params: { event: MouseEvent }) => void;

class Buttons extends Despot {
  private readonly container: Container;

  private buttonsElement?: HTMLElement | null | undefined;
  private recordButton?: HTMLButtonElement;
  private pauseButton?: HTMLButtonElement;
  private resumeButton?: HTMLButtonElement;
  private previewButton?: HTMLButtonElement;
  private recordAgainButton?: HTMLButtonElement;
  private submitButton?: HTMLButtonElement;

  private audioOnRadioPair?: HTMLInputElement | undefined;
  private audioOffRadioPair?: HTMLInputElement | undefined;

  private built = false;

  constructor(
    container: Container,
    options: VideomailClientOptions,
    emitter?: DespotEmitter,
  ) {
    super("Buttons", options, emitter);

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

  /**
   * Wire up recorder actions without taking over the host form's submission.
   *
   * @param buttonsElement - This widget's controls area, which may already contain host
   *   buttons.
   */
  private buildButtons(buttonsElement: HTMLElement) {
    const { selectors, text, disableSubmit, enableAutoValidation, enablePause, audio } =
      this.options;

    // Resolve Submit first so new controls can be placed before it when it lives here.
    if (!disableSubmit) {
      if (!this.submitButton) {
        this.submitButton = getOrCreateButton(buttonsElement, {
          className: selectors.submitButtonClass,
          text: "Submit",
          sharedClass: selectors.buttonClass,
          show: true,
          id: selectors.submitButtonId,
          type: "submit",
          selector: selectors.submitButtonSelector,
          disabled: enableAutoValidation,
        });
      } else {
        disableElement(this.submitButton);
      }

      // Only standalone widgets need a click handler. Forms keep their native validation.
      if (!this.container.hasForm()) {
        this.replaceClickHandler(this.submitButton, this.submit.bind(this));
      }
    }

    // New recorder actions start hidden and disabled until recorder events make them available.
    const addButton = (className: string, label: string, clickHandler: ClickHandler) => {
      const button = getOrCreateButton(
        buttonsElement,
        { className, text: label, sharedClass: selectors.buttonClass },
        this.submitButton,
      );
      this.replaceClickHandler(button, clickHandler);
      return button;
    };

    this.recordButton = addButton(
      selectors.recordButtonClass,
      text.buttons.record,
      this.record.bind(this),
    );

    if (enablePause) {
      this.pauseButton = addButton(
        selectors.pauseButtonClass,
        text.buttons.pause,
        this.container.pause.bind(this.container),
      );

      this.resumeButton = addButton(
        selectors.resumeButtonClass,
        text.buttons.resume,
        this.container.resume.bind(this.container),
      );
    }

    this.previewButton = addButton(
      selectors.previewButtonClass,
      text.buttons.preview,
      this.container.stop.bind(this.container),
    );

    this.recordAgainButton = addButton(
      selectors.recordAgainButtonClass,
      text.buttons.recordAgain,
      this.recordAgain.bind(this),
    );

    if (audio.switch) {
      // Using the same radio name makes the two choices mutually exclusive.
      this.audioOffRadioPair = getOrCreateRadioButtonPair(
        buttonsElement,
        {
          id: "audioOffOption",
          name: "audio",
          value: "off",
          label: text.audioOff,
          checked: !isAudioEnabled(this.options),
          changeHandler: () => {
            this.container.disableAudio();
          },
        },
        this.submitButton,
      );

      this.audioOnRadioPair = getOrCreateRadioButtonPair(
        buttonsElement,
        {
          id: "audioOnOption",
          name: "audio",
          value: "on",
          label: text.audioOn,
          checked: isAudioEnabled(this.options),
          changeHandler: () => {
            this.container.enableAudio();
          },
        },
        this.submitButton,
      );
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

  private onUserMediaReady(params: VideomailUserMediaReadyParams) {
    this.onFormReady(params);

    showElement(this.buttonsElement);

    if (params.recovering && params.paused) {
      // Recovery restores this take; keep its Resume/Stop controls, not a fresh Record action. 🎥
      hideElement(this.recordButton);
      disableElement(this.recordButton);
      return;
    }

    showElement(this.audioOnRadioPair);
    showElement(this.audioOffRadioPair);

    if (isShown(this.recordButton) && !params.recordWhenReady) {
      enableElement(this.recordButton);
    } else if (isShown(this.recordAgainButton) && !params.recordWhenReady) {
      enableElement(this.recordAgainButton);
    }

    if (this.options.enableAutoValidation) {
      disableElement(this.submitButton);
    }

    if (!params.recordWhenReady) {
      // The radios were just shown; the helpers also handle a missing audio switch.
      enableElement(this.audioOnRadioPair);
      enableElement(this.audioOffRadioPair);
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
    // The Paused overlay is not a button; even 3-2-1 needs an explicit way to continue.
    hideElement(this.pauseButton);
    hideElement(this.recordButton);
    showElement(this.resumeButton);
    enableElement(this.resumeButton);

    if (this.isCountingDown()) {
      // The countdown needs Resume too, but there are no captured frames to preview yet.
      hideElement(this.previewButton);
      disableElement(this.previewButton);
    } else {
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

  private onRecording(params: VideomailRecordingParams) {
    // The UI can be hidden mid-take. Use the frame count to restore its controls.
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
    // Still show it so that the form height does not change abruptly.
    showElement(this.recordButton);
    hideElement(this.recordAgainButton);
    hideElement(this.pauseButton);
    hideElement(this.resumeButton);
    hideElement(this.previewButton);
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

  private lockRecordAndAudio() {
    // Changing the stream or losing transport both make these controls unusable.
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

    this.on("USER_MEDIA_READY", (params: VideomailUserMediaReadyParams) => {
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

    this.on("RECORDING", (params: VideomailRecordingParams) => {
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

    const lockRecordAndAudio = this.lockRecordAndAudio.bind(this);
    this.on("ENABLING_AUDIO", lockRecordAndAudio);
    this.on("DISABLING_AUDIO", lockRecordAndAudio);

    this.on("STARTING_OVER", () => {
      this.onStartingOver();
    });

    this.on("CONNECTED", () => {
      if (this.options.loadUserMediaOnRecord) {
        if (isShown(this.recordButton) && !this.isCountingDown()) {
          enableElement(this.recordButton);
        }
      }
    });

    this.on("DISCONNECTED", lockRecordAndAudio);

    this.on("ERROR", (params: VideomailErrorParams) => {
      // Hide unusable controls so users can focus on the error (#60).
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
      // Replay-only mode has no record button.
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

    hideElement(this.buttonsElement);

    this.buildButtons(this.buttonsElement);

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
