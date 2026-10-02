import mergeWithDefaultOptions from "../../../util/options/mergeWithDefaultOptions";
import type Visuals from "../../visuals";
import Recorder from "../recorder";
import type Replay from "../replay";

interface RecorderInternals {
  connected: boolean;
  connectingStartedAt?: number;
  failConnection(params: {
    url2Connect: string;
    cause: "timeout" | "closed" | "error";
  }): void;
  lastCloseEvent?: { code: number; reason: string; wasClean: boolean };
  lastSocketError?: Record<string, unknown>;
}

function createFixture() {
  const element = document.createElement("div");
  const limitWidth = vi.fn((width) => ({ unit: "px", value: width }));
  const visuals = {
    appendChild: (child: HTMLElement) => element.appendChild(child),
    checkTimer: vi.fn(),
    getElement: () => element,
    getRatio: vi.fn(() => 0.75),
    limitHeight: vi.fn((height) => ({ unit: "px", value: height })),
    limitWidth,
  } as unknown as Visuals;
  const resetReplay = vi.fn();
  const replay = {
    getVideoType: vi.fn(() => "webm"),
    reset: resetReplay,
  } as unknown as Replay;
  const options = mergeWithDefaultOptions({
    loadUserMediaOnRecord: true,
    video: { height: 300, stretch: true, width: 400 },
  });
  const recorder = new Recorder(visuals, replay, options);

  return { element, limitWidth, options, recorder, replay, resetReplay, visuals };
}

function buildWithoutConnecting(recorder: Recorder) {
  (recorder as unknown as RecorderInternals).connected = true;
  recorder.build();
}

describe("Recorder", () => {
  it("starts disconnected", () => {
    const { recorder } = createFixture();

    expect(recorder.isConnected()).toBe(false);
  });

  it("starts without loaded user media", () => {
    const { recorder } = createFixture();

    expect(recorder.isUserMediaLoaded()).toBeUndefined();
  });

  it("starts invalid for submission", () => {
    const { recorder } = createFixture();

    expect(recorder.validate()).toBe(false);
  });

  it("returns the configured non-responsive width", () => {
    const { recorder } = createFixture();

    expect(recorder.getRecorderWidth(false)).toEqual({ unit: "px", value: 400 });
  });

  it("delegates responsive width limiting", () => {
    const { limitWidth, recorder } = createFixture();

    recorder.getRecorderWidth(true);

    expect(limitWidth).toHaveBeenCalledWith(400);
  });

  it("returns the configured non-responsive height", () => {
    const { recorder } = createFixture();

    expect(recorder.getRecorderHeight(false)).toEqual({ unit: "px", value: 300 });
  });

  it("calculates a ratio from configured dimensions", () => {
    const { recorder } = createFixture();

    expect(recorder.getRatio()).toBe(0.75);
  });

  it("builds a muted inline user-media video", () => {
    const { element, recorder } = createFixture();

    buildWithoutConnecting(recorder);

    expect(element.querySelector<HTMLVideoElement>("video.userMedia")).toMatchObject({
      muted: true,
      playsInline: true,
    });
  });

  it("mirrors the built user-media video", () => {
    const { recorder } = createFixture();
    buildWithoutConnecting(recorder);

    expect(recorder.getRawVisualUserMedia()?.style.transform).toBe("rotateY(180deg)");
  });

  it("returns a bounding-box recorder height", () => {
    const { recorder } = createFixture();
    buildWithoutConnecting(recorder);
    const video = recorder.getRawVisualUserMedia();
    if (!video) {
      throw new Error("Expected a built user-media video");
    }
    const rectMock = vi.spyOn(video, "getBoundingClientRect").mockReturnValue({
      bottom: 300,
      height: 300,
      left: 0,
      right: 400,
      top: 0,
      width: 400,
      x: 0,
      y: 0,
      toJSON: () => undefined,
    });

    const dimension = recorder.getRecorderHeight(true, true);
    rectMock.mockRestore();

    expect(dimension).toEqual({ unit: "px", value: 300 });
  });

  it("hides the user-media video", () => {
    const { recorder } = createFixture();
    buildWithoutConnecting(recorder);

    recorder.hide();

    expect(recorder.getRawVisualUserMedia()?.style.display).toBe("none");
  });

  it("resets replay state", () => {
    const { recorder, resetReplay } = createFixture();

    recorder.reset();

    expect(resetReplay).toHaveBeenCalledOnce();
  });

  it("reports an unloaded state after unloading a built recorder", () => {
    const { recorder } = createFixture();
    buildWithoutConnecting(recorder);

    recorder.unload();

    expect(recorder.isUnloaded()).toBe(true);
  });

  it("returns no recording stats before recording", () => {
    const { recorder } = createFixture();

    expect(recorder.getRecordingStats()).toBeUndefined();
  });

  it("returns its raw video element after building", () => {
    const { recorder } = createFixture();
    buildWithoutConnecting(recorder);

    expect(recorder.getRawVisualUserMedia()).toBeInstanceOf(HTMLVideoElement);
  });

  it("reports structured WebSocket connection diagnostics", () => {
    const { options, recorder } = createFixture();
    options.reportErrors = false;

    const internals = recorder as unknown as RecorderInternals;
    internals.connectingStartedAt = Date.now() - 120;
    internals.lastCloseEvent = {
      code: 1006,
      reason: "",
      wasClean: false,
    };
    internals.lastSocketError = {
      type: "error",
      isTrusted: true,
    };

    let reportedError: Error | undefined;
    recorder.on("ERROR", ({ err }) => {
      reportedError = err;
    });

    internals.failConnection({
      url2Connect: "wss://videomail.io/ws",
      cause: "error",
    });

    expect(reportedError?.cause).toMatchObject({
      cause: "error",
      closeCode: 1006,
      closeReason: "",
      online: navigator.onLine,
      secureContext: globalThis.isSecureContext,
      socketError: { type: "error", isTrusted: true },
      timeoutMs: options.timeouts.connection,
      url: "wss://videomail.io/ws",
      wasClean: false,
      elapsedMs: expect.any(Number),
    });
  });
});
