import hidden from "hidden";

import Despot from "../../../../util/Despot";
import Visuals from "../../../visuals";
import { VideomailClientOptions } from "../../../../types/options";

class FacingMode extends Despot {
  private visuals: Visuals;
  private facingModeElement?: HTMLElement | null | undefined;

  constructor(visuals: Visuals, options: VideomailClientOptions) {
    super("Facing Mode", options);

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
      this.facingModeElement = document.createElement("button");
      this.facingModeElement.classList.add("facingMode");
      this.facingModeElement.innerHTML = "⤾";

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
    hidden(this.facingModeElement, true);
  }

  public show() {
    hidden(this.facingModeElement, false);
  }
}

export default FacingMode;
