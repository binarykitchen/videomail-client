import mergeWithDefaultOptions from "../../util/options/mergeWithDefaultOptions";
import type Container from "../container";
import Visuals from "../visuals";

function createFixture(overrides = {}) {
  const element = document.createElement("div");
  const limitWidth = vi.fn((width) => ({ unit: "px", value: width }));
  const container = {
    appendChild: (child: HTMLElement) => element.appendChild(child),
    beginWaiting: vi.fn(),
    enableForm: vi.fn(),
    endWaiting: vi.fn(),
    insertBefore: (child: HTMLElement, reference: HTMLElement) =>
      element.insertBefore(child, reference),
    isOutsideElementOf: vi.fn(() => false),
    limitHeight: vi.fn((height) => ({ unit: "px", value: height })),
    limitWidth,
    querySelector: (selector: string) => element.querySelector(selector),
    validate: vi.fn(),
  } as unknown as Container;
  const options = mergeWithDefaultOptions({
    video: { countdown: false, stretch: true },
    ...overrides,
  });
  const visuals = new Visuals(container, options);

  return { container, element, limitWidth, options, visuals };
}

describe("Visuals", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("reports hidden before it is built", () => {
    const { visuals } = createFixture();

    expect(visuals.isHidden()).toBe(true);
  });

  it("builds a visuals container", () => {
    const { element, visuals } = createFixture();

    visuals.build();

    expect(element.querySelector(".visuals")).toBe(visuals.getElement());
  });

  it("adds a no-script fallback", () => {
    const { element, visuals } = createFixture();

    visuals.build();

    expect(element.querySelector("noscript")?.textContent).toBe(
      "Please enable JavaScript",
    );
  });

  it("builds a replay video", () => {
    const { element, visuals } = createFixture();

    visuals.build();

    expect(element.querySelector("video.replay")).not.toBeNull();
  });

  it("appends and removes visual children", () => {
    const { visuals } = createFixture();
    const child = document.createElement("p");
    visuals.build();
    visuals.appendChild(child);

    visuals.removeChild(child);

    expect(child.isConnected).toBe(false);
  });

  it("hides and shows its element", () => {
    const { visuals } = createFixture();
    visuals.build();
    visuals.hide();
    const hiddenDisplay = visuals.getElement()?.style.display;

    visuals.showVisuals();

    expect([hiddenDisplay, visuals.getElement()?.style.display]).toEqual(["none", ""]);
  });

  it("calculates its rendered ratio", () => {
    const { visuals } = createFixture();
    visuals.build();
    const element = visuals.getElement();
    Object.defineProperty(element, "clientWidth", { configurable: true, value: 400 });
    Object.defineProperty(element, "clientHeight", { configurable: true, value: 300 });

    expect(visuals.getRatio()).toBe(0.75);
  });

  it("delegates width limiting to the container", () => {
    const { limitWidth, visuals } = createFixture();

    visuals.limitWidth(320);

    expect(limitWidth).toHaveBeenCalledWith(320);
  });

  it("delegates recording when no countdown is configured", () => {
    const { visuals } = createFixture();
    const record = vi
      .spyOn(visuals.getRecorder(), "record")
      .mockImplementation(() => undefined);

    visuals.record();

    expect(record).toHaveBeenCalledOnce();
  });

  it("emits COUNTDOWN when a countdown is configured", () => {
    vi.useFakeTimers();
    const { visuals } = createFixture({ video: { countdown: 3, stretch: true } });
    const listener = vi.fn();
    visuals.on("COUNTDOWN", listener);
    visuals.build();

    visuals.record();

    expect(listener).toHaveBeenCalledOnce();
  });

  it("delegates stopping to the recorder", () => {
    const { visuals } = createFixture();
    const stop = vi
      .spyOn(visuals.getRecorder(), "stop")
      .mockImplementation(() => undefined);

    visuals.stop();

    expect(stop).toHaveBeenCalledOnce();
  });

  it("delegates pausing to the recorder", () => {
    const { visuals } = createFixture();
    const pause = vi
      .spyOn(visuals.getRecorder(), "pause")
      .mockImplementation(() => undefined);

    visuals.pause();

    expect(pause).toHaveBeenCalledOnce();
  });

  it("delegates resuming when no countdown is active", () => {
    const { visuals } = createFixture();
    const resume = vi
      .spyOn(visuals.getRecorder(), "resume")
      .mockImplementation(() => undefined);

    visuals.resume();

    expect(resume).toHaveBeenCalledOnce();
  });

  it("uses recorder validation when replay is hidden", () => {
    const { visuals } = createFixture();
    vi.spyOn(visuals.getRecorder(), "validate").mockReturnValue(true);

    expect(visuals.validate()).toBe(true);
  });

  it("updates the recording time limit", () => {
    const { options, visuals } = createFixture();

    visuals.setLimitSeconds(45);

    expect(options.video.limitSeconds).toBe(45);
  });

  it("returns to a hidden unbuilt state when unloaded", () => {
    const { visuals } = createFixture();
    visuals.build();

    visuals.unload();

    expect(visuals.isHidden()).toBe(true);
  });
});
