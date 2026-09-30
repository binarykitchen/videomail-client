/* eslint-disable max-classes-per-file */

import { EventEmitter } from "node:events";

import websocket from "websocket-stream";

import mergeWithDefaultOptions from "../../../util/options/mergeWithDefaultOptions";
import type Visuals from "../../visuals";
import Recorder from "../recorder";
import type Replay from "../replay";

vi.mock("websocket-stream", () => ({ default: vi.fn() }));

class FakeSocket extends EventTarget {
  public static readonly CLOSING = 2;
  public static readonly OPEN = 1;
  public readonly url: string;
  public readyState = 0;

  public constructor(url: string) {
    super();
    this.url = url;
  }

  public close() {
    this.readyState = 3;
  }
}

class FakeStream extends EventEmitter {
  public destroyed = false;
  public readonly socket: FakeSocket;
  public readonly write = vi.fn((_buffer: Buffer, callback: () => void) => {
    this.flushWrite = callback;
  });
  public flushWrite?: () => void;

  public constructor(socket: FakeSocket) {
    super();
    this.socket = socket;
  }

  public destroy() {
    this.destroyed = true;
    this.socket.close();
    this.emit("close");
  }
}

interface RecorderInternals {
  connected: boolean;
}

function createFixture() {
  const element = document.createElement("div");
  const limitWidth = vi.fn((width) => ({ unit: "px", value: width }));
  const visuals = {
    appendChild: (child: HTMLElement) => element.appendChild(child),
    checkTimer: vi.fn(),
    getElement: () => element,
    getRatio: vi.fn(() => 0.75),
    isNotifying: vi.fn(() => false),
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
});

describe("Recorder socket lifecycle", () => {
  const streams: FakeStream[] = [];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("WebSocket", FakeSocket);
    streams.length = 0;
    vi.mocked(websocket).mockImplementation((socket) => {
      const stream = new FakeStream(socket as FakeSocket);
      streams.push(stream);
      return stream as unknown as ReturnType<typeof websocket>;
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.mocked(websocket).mockReset();
  });

  it("shares a pending connection and calls both waiters on open", () => {
    const { recorder } = createFixture();
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();
    const initSocket = (
      recorder as unknown as { initSocket: (cb: () => void) => void }
    ).initSocket.bind(recorder);

    initSocket(firstCallback);
    initSocket(secondCallback);
    streams[0]?.emit("connect");

    expect({
      sockets: streams.length,
      first: firstCallback.mock.calls.length,
      second: secondCallback.mock.calls.length,
    }).toEqual({ sockets: 1, first: 1, second: 1 });
  });

  it("ignores an old socket's close and error after reconnecting", () => {
    const { recorder } = createFixture();
    const state = recorder as unknown as {
      initSocket: () => void;
      userMediaLoaded: boolean;
    };
    const errors = vi.fn();
    recorder.on("ERROR", errors);
    state.userMediaLoaded = true;
    state.initSocket();
    streams[0]?.emit("connect");
    streams[0]?.emit("close");
    streams[1]?.emit("connect");
    streams[0]?.emit("error", new Error("old socket error"));
    streams[0]?.emit("close");

    expect({
      sockets: streams.length,
      connected: recorder.isConnected(),
      errors: errors.mock.calls.length,
    }).toEqual({ sockets: 2, connected: true, errors: 0 });
  });

  it("retires a timed-out stream before trying again", () => {
    const { recorder, options } = createFixture();
    const state = recorder as unknown as {
      initSocket: () => void;
      userMediaLoaded: boolean;
    };
    state.userMediaLoaded = true;
    state.initSocket();

    vi.advanceTimersByTime(options.timeouts.connection);

    expect({
      sockets: streams.length,
      oldDestroyed: streams[0]?.destroyed,
    }).toEqual({ sockets: 2, oldDestroyed: true });
  });

  it("calls the command callback only after its stream write flushes", async () => {
    const { recorder } = createFixture();
    const state = recorder as unknown as {
      writeCommand: (command: string, args: unknown, cb: () => void) => void;
    };
    const callback = vi.fn();

    state.writeCommand("back", undefined, callback);
    streams[0]?.emit("connect");
    const beforeFlush = callback.mock.calls.length;
    streams[0]?.flushWrite?.();
    await Promise.resolve();

    expect({ beforeFlush, afterFlush: callback.mock.calls.length }).toEqual({
      beforeFlush: 0,
      afterFlush: 1,
    });
  });

  it("requests media once after server readiness when recording while disconnected", () => {
    const { recorder } = createFixture();
    const state = recorder as unknown as {
      loadUserMedia: (params: { recordWhenReady: boolean }) => void;
      executeCommand: (command: { command: string }) => void;
    };
    const loadUserMedia = vi.fn();
    state.loadUserMedia = loadUserMedia;

    recorder.record();
    recorder.record();
    streams[0]?.emit("connect");
    state.executeCommand({ command: "ready" });

    expect(loadUserMedia).toHaveBeenCalledExactlyOnceWith({ recordWhenReady: true });
  });

  it("clears a queued record request if its connection fails", () => {
    const { recorder, options } = createFixture();
    const state = recorder as unknown as {
      pendingRecord: boolean;
    };

    recorder.record();
    vi.advanceTimersByTime(options.timeouts.connection);

    expect(state.pendingRecord).toBe(false);
  });
});

describe("Recorder camera permissions", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stops a permission result that arrives after unload", async () => {
    let resolveStream: (stream: MediaStream) => void = () => undefined;
    const pending = new Promise<MediaStream>((resolve) => {
      resolveStream = resolve;
    });
    vi.stubGlobal("navigator", {
      mediaDevices: {
        getSupportedConstraints: () => ({}),
        getUserMedia: () => pending,
      },
      onLine: true,
      userAgent: "Chrome",
    });
    const { recorder } = createFixture();
    const state = recorder as unknown as { loadUserMedia: () => void };
    const stopTrack = vi.fn();
    const stream = { getTracks: () => [{ stop: stopTrack }] } as unknown as MediaStream;

    buildWithoutConnecting(recorder);
    state.loadUserMedia();
    recorder.unload();
    resolveStream(stream);
    await pending;
    await Promise.resolve();

    expect(stopTrack).toHaveBeenCalledOnce();
  });

  it("stops a superseded camera-switch result", async () => {
    const pending: ((stream: MediaStream) => void)[] = [];
    vi.stubGlobal("navigator", {
      mediaDevices: {
        getSupportedConstraints: () => ({}),
        getUserMedia: () =>
          new Promise<MediaStream>((resolve) => {
            pending.push(resolve);
          }),
      },
      onLine: true,
      userAgent: "Chrome",
    });
    const { recorder } = createFixture();
    const state = recorder as unknown as {
      loadGenuineUserMedia: (params: { switchingFacingMode: string }) => void;
    };
    const stopTrack = vi.fn();

    state.loadGenuineUserMedia({ switchingFacingMode: "environment" });
    state.loadGenuineUserMedia({ switchingFacingMode: "user" });
    pending[0]?.({ getTracks: () => [{ stop: stopTrack }] } as unknown as MediaStream);
    await Promise.resolve();

    expect(stopTrack).toHaveBeenCalledOnce();
  });

  it("stops acquired tracks if camera setup throws", () => {
    const { recorder } = createFixture();
    const state = recorder as unknown as {
      blocking: boolean;
      connected: boolean;
      getUserMediaCallback: (stream: MediaStream) => void;
      userMedia: { init: () => void };
    };
    const stopTrack = vi.fn();
    state.connected = true;
    state.blocking = true;
    state.userMedia = {
      init: () => {
        throw new Error("Failed to attach camera");
      },
    };
    recorder.on("ERROR", vi.fn());

    state.getUserMediaCallback({
      getTracks: () => [{ stop: stopTrack }],
    } as unknown as MediaStream);

    expect(stopTrack).toHaveBeenCalledOnce();
  });

  it("clears the camera timeout when permission arrives after a disconnect", () => {
    const { recorder } = createFixture();
    const state = recorder as unknown as {
      getUserMediaCallback: (stream: MediaStream) => void;
      userMedia: { init: () => void };
      userMediaLoading: boolean;
      userMediaTimeout?: number;
    };
    const stopTrack = vi.fn();
    state.userMedia = { init: vi.fn() };
    state.userMediaLoading = true;
    state.userMediaTimeout = window.setTimeout(() => undefined, 10_000);

    state.getUserMediaCallback({
      getTracks: () => [{ stop: stopTrack }],
    } as unknown as MediaStream);

    expect({
      stopped: stopTrack.mock.calls.length,
      loading: state.userMediaLoading,
      timeout: state.userMediaTimeout,
    }).toEqual({ stopped: 1, loading: false, timeout: undefined });
  });
});
