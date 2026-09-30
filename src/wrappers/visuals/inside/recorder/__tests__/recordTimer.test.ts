import mergeWithDefaultOptions from "../../../../../util/options/mergeWithDefaultOptions";
import Visuals from "../../../../visuals";
import RecordNote from "../recordNote";
import RecordTimer from "../recordTimer";

function createFixture(limitSeconds = 100) {
  const element = document.createElement("div");
  const stopVisuals = vi.fn();
  const visuals = {
    appendChild: (child: HTMLElement) => element.appendChild(child),
    getElement: () => element,
    stop: stopVisuals,
  } as unknown as Visuals;
  const hideRecordNote = vi.fn();
  const showRecordNote = vi.fn();
  const recordNote = {
    hide: hideRecordNote,
    resume: vi.fn(),
    setNear: vi.fn(),
    setNigh: vi.fn(),
    show: showRecordNote,
    stop: vi.fn(),
  } as unknown as RecordNote;
  const options = mergeWithDefaultOptions({ video: { limitSeconds } });
  const recordTimer = new RecordTimer(visuals, recordNote, options);
  recordTimer.build();

  return {
    element,
    hideRecordNote,
    options,
    recordNote,
    recordTimer,
    showRecordNote,
    stopVisuals,
    visuals,
  };
}

describe("RecordTimer", () => {
  it("starts at the configured recording limit", () => {
    const { element, recordTimer } = createFixture(90);

    recordTimer.start();

    expect(element.querySelector(".recordTimer")?.textContent).toBe("1:30");
  });

  it("updates the displayed remaining time", () => {
    const { element, recordTimer } = createFixture(90);
    recordTimer.start();

    recordTimer.check(30_000);

    expect(element.querySelector(".recordTimer")?.textContent).toBe("1:00");
  });

  it("marks the timer near the end at sixty percent elapsed", () => {
    const { element, recordTimer } = createFixture();
    recordTimer.start();

    recordTimer.check(60_000);

    expect(element.querySelector(".recordTimer")?.classList.contains("near")).toBe(true);
  });

  it("marks the timer nigh at eighty percent elapsed", () => {
    const { element, recordTimer } = createFixture();
    recordTimer.start();
    recordTimer.check(60_000);

    recordTimer.check(80_000);

    expect(element.querySelector(".recordTimer")?.classList.contains("nigh")).toBe(true);
  });

  it("stops the visuals when time runs out", () => {
    const { recordTimer, stopVisuals } = createFixture();
    recordTimer.start();

    recordTimer.check(100_000);

    expect(stopVisuals).toHaveBeenCalledOnce();
  });

  it("hides the record note while paused", () => {
    const { hideRecordNote, recordTimer } = createFixture();

    recordTimer.pause();

    expect(hideRecordNote).toHaveBeenCalledOnce();
  });

  it("shows the record note when resumed", () => {
    const { recordTimer, showRecordNote } = createFixture();

    recordTimer.resume();

    expect(showRecordNote).toHaveBeenCalledOnce();
  });

  it("resets the timer when stopped", () => {
    const { recordTimer } = createFixture();
    recordTimer.start();

    recordTimer.stop();

    expect(recordTimer.isStopped()).toBe(true);
  });

  it("updates the configured limit", () => {
    const { options, recordTimer } = createFixture();

    recordTimer.setLimitSeconds(45);

    expect(options.video.limitSeconds).toBe(45);
  });
});
