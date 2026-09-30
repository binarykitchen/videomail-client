import mergeWithDefaultOptions from "../../../../util/options/mergeWithDefaultOptions";
import type Visuals from "../../../visuals";
import RecorderInsides from "../recorderInsides";

function emitRecording(recorderInsides: RecorderInsides) {
  const emitter = recorderInsides as unknown as {
    emit: (eventName: "RECORDING") => void;
  };
  emitter.emit("RECORDING");
}

function createFixture() {
  const element = document.createElement("div");
  const visuals = {
    appendChild: (child: HTMLElement) => element.appendChild(child),
    getElement: () => element,
    stop: vi.fn(),
  } as unknown as Visuals;
  const options = mergeWithDefaultOptions({
    enablePause: true,
    video: { countdown: 3 },
  });
  const recorderInsides = new RecorderInsides(visuals, options);

  return { element, options, recorderInsides };
}

describe("RecorderInsides", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("builds the configured recorder overlays", () => {
    const { element, recorderInsides } = createFixture();

    recorderInsides.build();

    expect(
      element.querySelectorAll(".countdown, .paused, .recordNote, .recordTimer"),
    ).toHaveLength(4);
  });

  it("starts a configured countdown", () => {
    const { recorderInsides } = createFixture();
    recorderInsides.build();

    recorderInsides.startCountdown(vi.fn());

    expect(recorderInsides.isCountingDown()).toBe(true);
  });

  it("hides and stops the countdown", () => {
    const { recorderInsides } = createFixture();
    recorderInsides.build();
    recorderInsides.startCountdown(vi.fn());

    recorderInsides.hideCountdown();

    expect(recorderInsides.isCountingDown()).toBe(false);
  });

  it("shows the paused note", () => {
    const { element, recorderInsides } = createFixture();
    recorderInsides.build();

    recorderInsides.showPause();

    expect(element.querySelector<HTMLElement>(".paused")?.style.display).toBe("");
  });

  it("starts the record timer on the recording event", () => {
    const { element, recorderInsides } = createFixture();
    recorderInsides.build();

    emitRecording(recorderInsides);

    expect(element.querySelector(".recordTimer")?.textContent).toBe("0:30");
  });

  it("applies an updated recording limit", () => {
    const { element, recorderInsides } = createFixture();
    recorderInsides.build();
    recorderInsides.setLimitSeconds(45);

    emitRecording(recorderInsides);

    expect(element.querySelector(".recordTimer")?.textContent).toBe("0:45");
  });

  it("unloads an active countdown", () => {
    const { recorderInsides } = createFixture();
    recorderInsides.build();
    recorderInsides.startCountdown(vi.fn());

    recorderInsides.unload();

    expect(recorderInsides.isCountingDown()).toBe(false);
  });
});
