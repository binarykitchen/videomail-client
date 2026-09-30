import mergeWithDefaultOptions from "../../../../../util/options/mergeWithDefaultOptions";
import Visuals from "../../../../visuals";
import PausedNote from "../pausedNote";

function createVisuals() {
  const element = document.createElement("div");
  const visuals = {
    appendChild: (child: HTMLElement) => element.appendChild(child),
    getElement: () => element,
  } as unknown as Visuals;

  return { element, visuals };
}

describe("PausedNote", () => {
  it("builds the configured paused header", () => {
    const { element, visuals } = createVisuals();
    const options = mergeWithDefaultOptions({
      text: { pausedHeader: "Recording paused" },
    });
    const pausedNote = new PausedNote(visuals, options);

    pausedNote.build();

    expect(element.querySelector(".pausedHeader")?.textContent).toBe("Recording paused");
  });

  it("builds an optional paused hint", () => {
    const { element, visuals } = createVisuals();
    const options = mergeWithDefaultOptions({
      text: { pausedHint: "Press resume when ready" },
    });
    const pausedNote = new PausedNote(visuals, options);

    pausedNote.build();

    expect(element.querySelector(".pausedHint")?.textContent).toBe(
      "Press resume when ready",
    );
  });

  it("omits the paused hint when no hint is configured", () => {
    const { element, visuals } = createVisuals();
    const pausedNote = new PausedNote(visuals, mergeWithDefaultOptions());

    pausedNote.build();

    expect(element.querySelector(".pausedHint")).toBeNull();
  });

  it("shows and hides the paused block", () => {
    const { element, visuals } = createVisuals();
    const pausedNote = new PausedNote(visuals, mergeWithDefaultOptions());
    pausedNote.build();

    pausedNote.show();
    const shownDisplay = element.querySelector<HTMLElement>(".paused")?.style.display;
    pausedNote.hide();

    expect([
      shownDisplay,
      element.querySelector<HTMLElement>(".paused")?.style.display,
    ]).toEqual(["", "none"]);
  });
});
