import { VideomailClientOptions } from "../../../../types/options";
import type { DespotEmitter } from "../../../../util/Despot";
import Despot from "../../../../util/Despot";
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

  public build() {
    this.facingModeElement = this.visuals.getElement()?.querySelector(".facingMode");

    if (!this.facingModeElement) {
      const switchCameraLabel = this.options.text.buttons.switchCamera;

      this.facingModeElement = document.createElement("button");
      this.facingModeElement.classList.add("facingMode");
      // Without a type, a button inside a form submits it, e.g. on Enter.
      this.facingModeElement.setAttribute("type", "button");
      // "⤾" alone means nothing to screen readers, and little to most people.
      this.facingModeElement.setAttribute("aria-label", switchCameraLabel);
      this.facingModeElement.title = switchCameraLabel;
      this.facingModeElement.textContent = "⤾";

      this.facingModeElement.onclick = (e?) => {
        e?.preventDefault();

        try {
          this.emit("SWITCH_FACING_MODE");
        } catch (exc) {
          this.emit("ERROR", { exc });
        }
      };

      this.hide();

      this.visuals.appendChild(this.facingModeElement);
    } else {
      this.hide();
    }

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
