import hideElement from "../../../../util/html/hideElement";
import showElement from "../../../../util/html/showElement";
import Visuals from "../../../visuals";

class RecordNote {
  private readonly visuals: Visuals;
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
    hideElement(this.recordNoteElement);
  }

  public show() {
    showElement(this.recordNoteElement);
  }
}

export default RecordNote;
