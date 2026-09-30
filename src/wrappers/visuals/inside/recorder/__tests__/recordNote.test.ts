import Visuals from "../../../../visuals";
import RecordNote from "../recordNote";

function createVisuals() {
  const element = document.createElement("div");
  const visuals = {
    appendChild: (child: HTMLElement) => element.appendChild(child),
    getElement: () => element,
  } as unknown as Visuals;

  return { element, visuals };
}

describe("RecordNote", () => {
  it("builds a hidden record note", () => {
    const { element, visuals } = createVisuals();
    const recordNote = new RecordNote(visuals);

    recordNote.build();

    expect(element.querySelector<HTMLElement>(".recordNote")?.style.display).toBe("none");
  });

  it("shows the record note", () => {
    const { element, visuals } = createVisuals();
    const recordNote = new RecordNote(visuals);
    recordNote.build();

    recordNote.show();

    expect(element.querySelector<HTMLElement>(".recordNote")?.style.display).toBe("");
  });

  it("marks the end as near", () => {
    const { element, visuals } = createVisuals();
    const recordNote = new RecordNote(visuals);
    recordNote.build();

    recordNote.setNear();

    expect(element.querySelector(".recordNote")?.classList.contains("near")).toBe(true);
  });

  it("marks the end as nigh", () => {
    const { element, visuals } = createVisuals();
    const recordNote = new RecordNote(visuals);
    recordNote.build();

    recordNote.setNigh();

    expect(element.querySelector(".recordNote")?.classList.contains("nigh")).toBe(true);
  });

  it("clears threshold markers when stopped", () => {
    const { element, visuals } = createVisuals();
    const recordNote = new RecordNote(visuals);
    recordNote.build();
    recordNote.setNear();
    recordNote.setNigh();

    recordNote.stop();

    expect(element.querySelector<HTMLElement>(".recordNote")).toMatchObject({
      className: "recordNote",
      style: expect.objectContaining({ display: "none" }),
    });
  });
});
