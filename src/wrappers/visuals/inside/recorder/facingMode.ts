import { VideomailClientOptions } from "../../../../types/options";
import type { DespotEmitter } from "../../../../util/Despot";
import Despot from "../../../../util/Despot";
import getOrCreateChild from "../../../../util/html/getOrCreateChild";
import hideElement from "../../../../util/html/hideElement";
import showElement from "../../../../util/html/showElement";
import Visuals from "../../../visuals";

class FacingMode extends Despot {
  private readonly visuals: Visuals;
  private facingModeElement?: HTMLElement | null | undefined;

  constructor(
    visuals: Visuals,
    options: VideomailClientOptions,
    emitter?: DespotEmitter,
  ) {
    super("Facing Mode", options, emitter);

    this.visuals = visuals;
  }

  private initEvents() {
    this.on("ERROR", () => {
      this.hide();
    });
  }

  // Host markup keeps its own label and behaviour; only a new button gets ours.
  private setUpButton(button: HTMLButtonElement) {
    const switchCameraLabel = this.options.text.buttons.switchCamera;

    // Without a type, a button inside a form submits it, e.g. on Enter.
    button.setAttribute("type", "button");
    // "⤾" alone means nothing to screen readers, and little to most people.
    button.setAttribute("aria-label", switchCameraLabel);
    button.title = switchCameraLabel;
    button.textContent = "⤾";

    button.onclick = (e?) => {
      e?.preventDefault();

      try {
        this.emit("SWITCH_FACING_MODE");
      } catch (exc) {
        this.emit("ERROR", { exc });
      }
    };
  }

  public build() {
    this.facingModeElement = getOrCreateChild(
      this.visuals.getElement(),
      "button",
      "facingMode",
      (button) => {
        this.setUpButton(button);
      },
    );
    this.hide();

    this.initEvents();
  }

  public hide() {
    hideElement(this.facingModeElement);
  }

  public show() {
    showElement(this.facingModeElement);
  }

  public unload() {
    this.removeAllListeners();
  }
}

export default FacingMode;
