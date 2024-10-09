import hidden from "hidden";

import Visuals from "../../../visuals";

class RecordNote {
  private visuals: Visuals;
  private recordNoteElement: HTMLElement | null | undefined;

  constructor(visuals: Visuals) {
    this.visuals = visuals;
  }

  public build() {
    this.recordNoteElement = this.visuals.getElement()?.querySelector(".recordNote");

    if (!this.recordNoteElement) {
      this.recordNoteElement = document.createElement("p");
      this.recordNoteElement.classList.add("recordNote");

      this.hide();

      this.visuals.appendChild(this.recordNoteElement);
    } else {
      this.hide();
    }
  }

  public stop() {
    this.hide();

    this.recordNoteElement?.classList.remove("near");
    this.recordNoteElement?.classList.remove("nigh");
  }

  public setNear() {
    this.recordNoteElement?.classList.add("near");
  }

  public setNigh() {
    this.recordNoteElement?.classList.add("nigh");
  }

  public hide() {
    hidden(this.recordNoteElement, true);
  }

  public show() {
    hidden(this.recordNoteElement, false);
  }
}

export default RecordNote;
