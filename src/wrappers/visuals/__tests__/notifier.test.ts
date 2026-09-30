import type VideomailError from "../../../util/error/VideomailError";
import mergeWithDefaultOptions from "../../../util/options/mergeWithDefaultOptions";
import type Visuals from "../../visuals";
import Notifier from "../notifier";

function createFixture() {
  const element = document.createElement("div");
  const endWaiting = vi.fn();
  const hideRecorder = vi.fn();
  const visuals = {
    appendChild: (child: HTMLElement) => element.appendChild(child),
    beginWaiting: vi.fn(),
    endWaiting,
    getElement: () => element,
    getRecorderHeight: vi.fn(() => ({ unit: "px", value: 300 })),
    getRecorderWidth: vi.fn(() => ({ unit: "px", value: 400 })),
    hideRecorder,
    hideReplay: vi.fn(),
    showVisuals: vi.fn(),
  } as unknown as Visuals;
  const options = mergeWithDefaultOptions();
  const notifier = new Notifier(visuals, options);

  return { element, endWaiting, hideRecorder, notifier, options, visuals };
}

function emit(notifier: Notifier, eventName: "CONNECTING" | "PROGRESS", params?) {
  const emitter = notifier as unknown as {
    emit: (name: string, eventParams?: unknown) => void;
  };
  emitter.emit(eventName, params);
}

describe("Notifier", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("reports an unbuilt state before building", () => {
    const { notifier } = createFixture();

    expect(notifier.isBuilt()).toBe(false);
  });

  it("builds a hidden notifier element", () => {
    const { element, notifier } = createFixture();

    notifier.build();

    expect((element.firstElementChild as HTMLElement | null)?.style.display).toBe("none");
  });

  it("reports a built state after building", () => {
    const { notifier } = createFixture();

    notifier.build();

    expect(notifier.isBuilt()).toBe(true);
  });

  it("shows a notification message", () => {
    const { element, notifier } = createFixture();
    notifier.build();

    notifier.notify("Connecting …");

    expect(element.querySelector("#notifierMessage")?.textContent).toBe("Connecting …");
  });

  it("shows an optional explanation", () => {
    const { element, notifier } = createFixture();
    notifier.build();

    notifier.notify("Unable to record", "Camera access was denied");

    expect(element.querySelector(".explanation")?.textContent).toBe(
      "Camera access was denied",
    );
  });

  it("reports a visible state after notifying", () => {
    const { notifier } = createFixture();
    notifier.build();

    notifier.notify("Connected");

    expect(notifier.isVisible()).toBe(true);
  });

  it("hides the recorder while notifying", () => {
    const { hideRecorder, notifier } = createFixture();
    notifier.build();

    notifier.notify("Connected");

    expect(hideRecorder).toHaveBeenCalledOnce();
  });

  it("ends waiting for an ordinary notification", () => {
    const { endWaiting, notifier } = createFixture();
    notifier.build();

    notifier.notify("Connected");

    expect(endWaiting).toHaveBeenCalledOnce();
  });

  it("renders errors as blocking problem notifications", () => {
    const { element, notifier } = createFixture();
    const error = {
      explanation: "Allow camera access and try again",
      getClassList: () => ["webcam-problem"],
      message: "Camera unavailable",
    } as VideomailError;
    notifier.build();

    notifier.error(error);

    expect(element.querySelector(".notifier")).toMatchObject({
      className: "notifier webcam-problem blocking",
      textContent: "☹ Camera unavailableAllow camera access and try again",
    });
  });

  it("emits BLOCKING for an error notification", () => {
    const { notifier } = createFixture();
    const listener = vi.fn();
    const error = {
      getClassList: () => undefined,
      message: "Camera unavailable",
    } as VideomailError;
    notifier.on("BLOCKING", listener);
    notifier.build();

    notifier.error(error);

    expect(listener).toHaveBeenCalledOnce();
  });

  it("responds to the connecting event", () => {
    const { element, notifier } = createFixture();
    notifier.build();

    emit(notifier, "CONNECTING");

    expect(element.querySelector("#notifierMessage")?.textContent).toBe("Connecting …");
  });

  it("shows combined audio and video progress", () => {
    const { element, notifier, options } = createFixture();
    options.audio.enabled = true;
    notifier.build();

    emit(notifier, "PROGRESS", {
      frameProgress: "50%",
      sampleProgress: "25%",
    });

    expect(element.querySelector(".explanation")?.textContent).toBe(
      "Video: 50%, Audio: 25%",
    );
  });

  it("applies an entertainment background class", () => {
    vi.useFakeTimers();
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    const { element, notifier, options } = createFixture();
    options.notifier.entertain = true;
    notifier.build();

    notifier.notify("Encoding …", undefined, { entertain: true });
    random.mockRestore();

    expect(element.querySelector(".notifier")?.className).toBe("notifier entertain bg1");
  });

  it("hides the notifier", () => {
    const { notifier } = createFixture();
    notifier.build();
    notifier.notify("Connected");

    notifier.hide();

    expect(notifier.isVisible()).toBe(false);
  });
});
