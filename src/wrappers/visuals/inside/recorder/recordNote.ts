import getOrCreateChild from "../../../../util/html/getOrCreateChild";
import hideElement from "../../../../util/html/hideElement";
import showElement from "../../../../util/html/showElement";
import type Visuals from "../../../visuals";

class RecordNote {
  private readonly visuals: Visuals;
  private recordNoteElement: HTMLElement | null | undefined;

  constructor(visuals: Visuals) {
    this.visuals = visuals;
  }

  public build() {
    this.recordNoteElement = getOrCreateChild(
      this.visuals.getElement(),
      "p",
      "recordNote",
    );
    this.hide();
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
