import type {
  FormReadyParams,
  VideomailUserMediaReadyParams,
} from "../types/events/params";
import { VideomailClientOptions } from "../types/options";
import type { DespotEmitter } from "../util/Despot";
import Despot from "../util/Despot";
import disableElement from "../util/html/disableElement";
import enableElement from "../util/html/enableElement";
import hideElement from "../util/html/hideElement";
import showElement from "../util/html/showElement";
import { isAudioEnabled } from "../util/options/audio";
import getOrCreateButton from "./buttons/getOrCreateButton";
import getOrCreateRadioButtonPair from "./buttons/getOrCreateRadioButtonPair";
import getRecorderControlView, {
  type RecorderControlState,
  type RecorderControlView,
  type TakePhase,
} from "./buttons/getRecorderControlView";
import Container from "./container";

type ClickHandler = (params: { event: MouseEvent }) => void;

const INITIAL_CONTROLS: RecorderControlState = {
  phase: "unready",
  shown: true,
  recordReady: false,
  audioReady: false,
  locked: false,
  previewLocked: false,
};

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
  private controlState = INITIAL_CONTROLS;

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

  private renderControls(previous?: RecorderControlView) {
    const view = getRecorderControlView(this.controlState);
    const elements: Record<keyof RecorderControlView, (HTMLElement | undefined)[]> = {
      record: [this.recordButton],
      pause: [this.pauseButton],
      resume: [this.resumeButton],
      preview: [this.previewButton],
      recordAgain: [this.recordAgainButton],
      audio: [this.audioOnRadioPair, this.audioOffRadioPair],
    };

    for (const control of Object.keys(elements) as (keyof RecorderControlView)[]) {
      const { visible, enabled } = view[control];
      for (const element of elements[control]) {
        if (previous?.[control].visible !== visible) {
          (visible ? showElement : hideElement)(element);
        }

        // A host form can temporarily lock its controls during submission.
        if (enabled !== undefined && previous?.[control].enabled !== enabled) {
          (enabled ? enableElement : disableElement)(element);
        }
      }
    }
  }

  private updateControls(changes: Partial<RecorderControlState>) {
    const previous = getRecorderControlView(this.controlState);
    this.controlState = { ...this.controlState, ...changes };
    this.renderControls(previous);
  }

  private setPhase(phase: TakePhase) {
    this.updateControls({ phase, locked: false });
  }

  private getPausedPhase() {
    // A paused countdown has no take to stop, but still needs Resume.
    return this.container.isCountingDown() ? "pausedCountdown" : "pausedTake";
  }

  private onFormReady(params?: FormReadyParams) {
    if (params?.paused) {
      this.setPhase(this.getPausedPhase());
    } else if (this.controlState.phase === "unready") {
      this.setPhase("idle");
    }

    if (!this.options.enableAutoValidation) {
      enableElement(this.submitButton);
    }
  }

  private onUserMediaReady(params: VideomailUserMediaReadyParams) {
    if (params.switchingFacingMode) {
      return;
    }

    this.onFormReady(params);
    showElement(this.buttonsElement);

    if (params.recovering && params.paused) {
      // Replacing a paused take's camera is not permission to start a new take.
      this.lockRecordAndAudio();
      return;
    }

    const ready = !params.recordWhenReady;
    this.updateControls({ recordReady: ready, audioReady: ready, locked: false });
    if (this.options.enableAutoValidation) {
      disableElement(this.submitButton);
    }
  }

  private updateSubmitForValidation(valid: boolean) {
    if (this.options.enableAutoValidation) {
      (valid ? enableElement : disableElement)(this.submitButton);
    }
  }

  private lockRecordAndAudio() {
    // Changing the stream or losing transport both make these controls unusable.
    this.updateControls({ recordReady: false, audioReady: false });
  }

  private recordAgain() {
    this.updateControls({ previewLocked: true });
    this.container.beginWaiting();
    this.container.recordAgain();
  }

  private submit() {
    void this.container.submit();
  }

  private record() {
    this.updateControls({ recordReady: false });
    this.container.record();
  }

  private initEvents() {
    this.options.logger.debug("Buttons: initEvents()");

    this.on("USER_MEDIA_READY", this.onUserMediaReady.bind(this));
    this.on("PREVIEW", () => {
      this.updateControls({
        phase: "preview",
        locked: false,
        previewLocked: false,
        recordReady: false,
        audioReady: false,
      });
      if (!this.options.enableAutoValidation) {
        enableElement(this.submitButton);
      }
    });
    this.on("PAUSED", () => {
      this.setPhase(this.getPausedPhase());
    });
    this.on("RECORDING", ({ framesCount }) => {
      this.updateControls({
        phase: framesCount > 1 ? "recording" : "starting",
        locked: false,
        recordReady: false,
        audioReady: false,
      });
    });
    this.on("FIRST_FRAME_SENT", () => {
      // A write can complete after Pause or Stop. It must not replace those controls.
      if (this.controlState.phase === "starting") {
        this.setPhase("recording");
      }
    });
    this.on("RESUMING", () => {
      this.setPhase("recording");
    });
    this.on("STOPPING", () => {
      this.setPhase("stopping");
    });
    this.on("COUNTDOWN", () => {
      this.updateControls({
        phase: "countdown",
        locked: false,
        recordReady: false,
        audioReady: false,
      });
    });
    this.on("SUBMITTING", () => {
      disableElement(this.submitButton);
      this.updateControls({ previewLocked: true });
    });
    this.on("RESETTING", () => {
      disableElement(this.submitButton);
      // Stop resets capture before the server replies with a preview.
      this.reset(this.controlState.phase === "stopping" ? "stopping" : "unready");
    });
    this.on("INVALID", () => {
      this.updateSubmitForValidation(false);
    });
    this.on("VALID", () => {
      this.updateSubmitForValidation(true);
    });
    this.on("SUBMITTED", () => {
      disableElement(this.submitButton);
      this.reset();
    });
    this.on("HIDE", () => {
      this.updateControls({ shown: false });
    });
    this.on("FORM_READY", this.onFormReady.bind(this));
    this.on("REPLAY_SHOWN", () => {
      this.hide();
    });
    this.on("GOING_BACK", () => {
      this.setPhase("idle");
      showElement(this.submitButton);
    });
    this.on("STARTING_OVER", () => {
      showElement(this.submitButton);
    });
    this.on("CONNECTED", () => {
      // In lazy mode transport can be ready before FORM_READY or camera permission.
      if (this.options.loadUserMediaOnRecord) {
        this.updateControls({ recordReady: true });
      }
    });
    const lockRecordAndAudio = this.lockRecordAndAudio.bind(this);
    this.on("ENABLING_AUDIO", lockRecordAndAudio);
    this.on("DISABLING_AUDIO", lockRecordAndAudio);
    this.on("DISCONNECTED", lockRecordAndAudio);
    this.on("ERROR", ({ err, recoverable }) => {
      if (recoverable) {
        this.updateControls({ previewLocked: false });
      }
      // Hide unusable controls so users can focus on the error (#60).
      if (err?.isBrowserProblem() && this.options.adjustFormOnBrowserError) {
        this.hide();
      }
    });
  }

  public reset(phase = this.controlState.phase) {
    this.controlState = {
      ...this.controlState,
      phase,
      locked: true,
      recordReady: false,
      audioReady: false,
    };
    this.renderControls();
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
    this.controlState = INITIAL_CONTROLS;
    this.renderControls();

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
      this.updateControls({ shown: false });
      hideElement(this.submitButton);
    }
  }

  public show() {
    this.updateControls({ shown: true });
    showElement(this.buttonsElement);
  }
}

export default Buttons;
