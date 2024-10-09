import hidden from "hidden";

import { VideomailClientOptions } from "../../../../types/options";
import Visuals from "../../../visuals";

class PausedNote {
  private visuals: Visuals;
  private options: VideomailClientOptions;

  private pausedBlockElement?: HTMLElement | null | undefined;
  private pausedHeaderElement?: HTMLElement | null | undefined;
  private pausedHintElement?: HTMLElement | null | undefined;

  constructor(visuals: Visuals, options: VideomailClientOptions) {
    this.visuals = visuals;
    this.options = options;
  }

  private hasPausedHintText() {
    return this.options.text.pausedHint;
  }

  public build() {
    this.pausedBlockElement = this.visuals.getElement()?.querySelector(".paused");
    this.pausedHeaderElement = this.visuals.getElement()?.querySelector(".pausedHeader");

    if (!this.pausedHeaderElement) {
      this.pausedBlockElement = document.createElement("div");
      this.pausedBlockElement.classList.add("paused");

      this.pausedHeaderElement = document.createElement("p");
      this.pausedHeaderElement.classList.add("pausedHeader");

      this.hide();

      this.pausedHeaderElement.innerHTML = this.options.text.pausedHeader;

      this.pausedBlockElement.appendChild(this.pausedHeaderElement);

      if (this.hasPausedHintText()) {
        this.pausedHintElement = this.visuals.getElement()?.querySelector(".pausedHint");

        if (!this.pausedHintElement) {
          this.pausedHintElement = document.createElement("p");
          this.pausedHintElement.classList.add("pausedHint");
          this.pausedBlockElement.appendChild(this.pausedHintElement);
        }

        if (this.options.text.pausedHint) {
          this.pausedHintElement.innerHTML = this.options.text.pausedHint;
        }
      }

      this.visuals.appendChild(this.pausedBlockElement);
    } else {
      this.hide();

      this.pausedHeaderElement.innerHTML = this.options.text.pausedHeader;

      if (this.options.text.pausedHint && this.pausedHintElement) {
        this.pausedHintElement.innerHTML = this.options.text.pausedHint;
      }
    }
  }

  public hide() {
    hidden(this.pausedBlockElement, true);
  }

  public show() {
    hidden(this.pausedBlockElement, false);
  }
}

export default PausedNote;
