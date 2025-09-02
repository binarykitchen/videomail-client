import { VideomailClientOptions } from "../../../../types/options";
import Despot from "../../../../util/Despot";
import hideElement from "../../../../util/html/hideElement";
import showElement from "../../../../util/html/showElement";
import Visuals from "../../../visuals";

class FacingMode extends Despot {
  private readonly visuals: Visuals;
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
    hideElement(this.facingModeElement);
  }

  public show() {
    showElement(this.facingModeElement);
  }
}

export default FacingMode;
