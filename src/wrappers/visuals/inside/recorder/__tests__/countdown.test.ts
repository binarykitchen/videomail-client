import mergeWithDefaultOptions from "../../../../../util/options/mergeWithDefaultOptions";
import Visuals from "../../../../visuals";
import Countdown from "../countdown";

function createVisuals() {
  const element = document.createElement("div");
  const visuals = {
    appendChild: (child: HTMLElement) => element.appendChild(child),
    getElement: () => element,
  } as unknown as Visuals;

  return { element, visuals };
}

describe("Countdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("builds a hidden countdown element", () => {
    const { element, visuals } = createVisuals();
    const countdown = new Countdown(visuals, mergeWithDefaultOptions());

    countdown.build();

    expect(element.querySelector<HTMLElement>(".countdown")?.style.display).toBe("none");
  });

  it("starts from the configured countdown value", () => {
    const { element, visuals } = createVisuals();
    const options = mergeWithDefaultOptions({ video: { countdown: 3 } });
    const countdown = new Countdown(visuals, options);
    countdown.build();

    countdown.start(vi.fn());

    expect(element.querySelector(".countdown")?.textContent).toBe("3");
  });

  it("reports that a countdown is running", () => {
    const { visuals } = createVisuals();
    const countdown = new Countdown(visuals, mergeWithDefaultOptions());
    countdown.build();

    countdown.start(vi.fn());

    expect(countdown.isCountingDown()).toBe(true);
  });

  it("fires the callback after counting down", () => {
    const { visuals } = createVisuals();
    const options = mergeWithDefaultOptions({ video: { countdown: 2 } });
    const countdown = new Countdown(visuals, options);
    const callback = vi.fn();
    countdown.build();
    countdown.start(callback);

    vi.advanceTimersByTime(1900);
    vi.runOnlyPendingTimers();

    expect(callback).toHaveBeenCalledOnce();
  });

  it("does not count backward while paused", () => {
    const { element, visuals } = createVisuals();
    const options = mergeWithDefaultOptions({ video: { countdown: 2 } });
    const countdown = new Countdown(visuals, options);
    countdown.build();
    countdown.start(vi.fn());

    countdown.pause();
    vi.advanceTimersByTime(950);

    expect(element.querySelector(".countdown")?.textContent).toBe("2");
  });

  it("continues counting after resuming", () => {
    const { element, visuals } = createVisuals();
    const options = mergeWithDefaultOptions({ video: { countdown: 2 } });
    const countdown = new Countdown(visuals, options);
    countdown.build();
    countdown.start(vi.fn());
    countdown.pause();
    vi.advanceTimersByTime(950);

    countdown.resume();
    vi.advanceTimersByTime(950);

    expect(element.querySelector(".countdown")?.textContent).toBe("1");
  });

  it("stops counting when hidden", () => {
    const { visuals } = createVisuals();
    const countdown = new Countdown(visuals, mergeWithDefaultOptions());
    countdown.build();
    countdown.start(vi.fn());

    countdown.hide();

    expect(countdown.isCountingDown()).toBe(false);
  });

  it("rejects starting before the element is built", () => {
    const { visuals } = createVisuals();
    const countdown = new Countdown(visuals, mergeWithDefaultOptions());

    expect(() => {
      countdown.start(vi.fn());
    }).toThrow("Unable to start countdown without an element");
  });

  it("rejects a non-numeric countdown option", () => {
    const { visuals } = createVisuals();
    const countdown = new Countdown(
      visuals,
      mergeWithDefaultOptions({ video: { countdown: false } }),
    );
    countdown.build();

    expect(() => {
      countdown.start(vi.fn());
    }).toThrow("The defined countdown is not a valid number: false");
  });
});
