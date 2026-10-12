import mergeWithDefaultOptions from "../../../util/options/mergeWithDefaultOptions";
import type Visuals from "../../visuals";
import Recorder from "../recorder";
import type Replay from "../replay";
import UserMedia from "../userMedia";

interface RecorderInternals {
  connected: boolean;
  stream?: {
    destroyed: boolean;
    write(buffer: Buffer, callback: () => void): boolean;
    destroy(): void;
  };
  streamBackpressured: boolean;
  mediaTransmissionStarted: boolean;
  recordingTransportFailed: boolean;
  recordingActive: boolean;
  framesCount: number;
  samplesCount: number;
  confirmedFrameNumber: number;
  writeStream(buffer: Buffer): void;
  onAudioSample(audioSample: { toBuffer: () => Buffer }): void;
  handleStreamDrain(stream: {
    destroyed: boolean;
    write(buffer: Buffer, callback: () => void): boolean;
  }): void;
  handleStreamClose(url2Connect: string): void;
  connectingStartedAt?: number;
  handleConnectionFailure(params: {
    url2Connect: string;
    cause: "timeout" | "closed" | "error";
  }): void;
  initSocket(): void;
  failConnection(params: {
    url2Connect: string;
    cause: "timeout" | "closed" | "error";
  }): void;
  lastCloseEvent?: { code: number; reason: string; wasClean: boolean };
  lastSocketError?: Record<string, unknown>;
  reconnecting: boolean;
  userMediaLoaded?: boolean;
  userMedia?: UserMedia;
  loop?: {
    on: () => void;
    isRunning: () => boolean;
    start: () => void;
    stop: () => void;
    dispose: () => void;
  };
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

function recordFrames(width = 320, height = 240) {
  const fixture = createFixture();
  const { recorder, options } = fixture;
  buildWithoutConnecting(recorder);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  vi.spyOn(canvas, "getContext").mockReturnValue({} as CanvasRenderingContext2D);
  vi.spyOn(canvas, "toDataURL").mockReturnValue("data:image/jpeg;base64,/9j/2Q==");
  const userMedia = new UserMedia(recorder, options);
  vi.spyOn(userMedia, "createCanvas").mockReturnValue(canvas);
  vi.spyOn(userMedia, "record").mockImplementation(() => undefined);
  vi.spyOn(userMedia, "stop").mockImplementation(() => undefined);
  const internals = recorder as unknown as RecorderInternals;
  internals.userMedia = userMedia;
  internals.userMediaLoaded = true;
  internals.loop = {
    on: vi.fn(),
    isRunning: vi.fn(() => false),
    start: vi.fn(),
    stop: vi.fn(),
    dispose: vi.fn(),
  };
  recorder.record();
  return { ...fixture, canvas, userMedia };
}

describe("Recorder", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retains captured frame dimensions after the camera and canvas are reset", () => {
    const { recorder } = recordFrames();

    recorder.reset();

    expect(recorder.getRecordingDimensions()).toEqual({ width: 320, height: 240 });
  });

  it("retains portrait frame dimensions without assuming a landscape ratio", () => {
    const { recorder } = recordFrames(240, 320);

    recorder.reset();

    expect(recorder.getRecordingDimensions()).toEqual({ width: 240, height: 320 });
  });

  it("does not expose mutable captured frame dimensions", () => {
    const { recorder } = recordFrames();
    const dimensions = recorder.getRecordingDimensions();
    if (!dimensions) {
      throw new Error("Expected recorded frame dimensions");
    }
    dimensions.height = 863;

    expect(recorder.getRecordingDimensions()).toEqual({ width: 320, height: 240 });
  });

  it("clears captured dimensions when the recorder is unloaded", () => {
    const { recorder } = recordFrames();

    recorder.unload();

    expect(recorder.getRecordingDimensions()).toBeUndefined();
  });

  it("updates captured dimensions when recording again", () => {
    const { recorder, canvas } = recordFrames();
    canvas.width = 640;
    canvas.height = 360;

    recorder.record();

    expect(recorder.getRecordingDimensions()).toEqual({ width: 640, height: 360 });
  });

  it("clears previous dimensions when a new canvas is invalid", () => {
    const { recorder, canvas } = recordFrames();
    canvas.width = 0;

    recorder.record();

    expect(recorder.getRecordingDimensions()).toBeUndefined();
  });

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

  it("retries reconnect failures without reporting an error", () => {
    vi.useFakeTimers();

    try {
      const { options, recorder } = createFixture();
      options.reportErrors = false;

      const internals = recorder as unknown as RecorderInternals;
      internals.reconnecting = true;
      internals.userMediaLoaded = true;

      const initSocket = vi.spyOn(internals, "initSocket");
      let reportedError: Error | undefined;
      recorder.on("ERROR", ({ err }) => {
        reportedError = err;
      });

      internals.handleConnectionFailure({
        url2Connect: "wss://videomail.io/ws",
        cause: "error",
      });

      const attemptsBeforeRetry = initSocket.mock.calls.length;
      vi.advanceTimersByTime(1000);

      expect({
        attemptsBeforeRetry,
        attemptsAfterRetry: initSocket.mock.calls.length,
        reportedError,
        reconnecting: internals.reconnecting,
      }).toEqual({
        attemptsBeforeRetry: 0,
        attemptsAfterRetry: 1,
        reportedError: undefined,
        reconnecting: true,
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it("still reports a failure before any connection was established", () => {
    const { options, recorder } = createFixture();
    options.reportErrors = false;

    const internals = recorder as unknown as RecorderInternals;
    let reportedError: Error | undefined;
    recorder.on("ERROR", ({ err }) => {
      reportedError = err;
    });

    internals.handleConnectionFailure({
      url2Connect: "wss://videomail.io/ws",
      cause: "error",
    });

    expect(reportedError?.message).toBe("Unable to connect to the server");
  });

  it("pauses video writes under backpressure and resumes after queued writes drain", () => {
    const { recorder } = createFixture();
    const internals = recorder as unknown as RecorderInternals;
    const writtenBuffers: Buffer[] = [];
    let isRunning = true;
    let writeCount = 0;
    const loop = {
      isRunning: vi.fn(() => isRunning),
      start: vi.fn(() => {
        isRunning = true;
      }),
      stop: vi.fn(() => {
        isRunning = false;
      }),
    };
    const stream = {
      destroyed: false,
      destroy: vi.fn(),
      write: vi.fn((buffer: Buffer, callback: () => void) => {
        writtenBuffers.push(buffer);
        callback();
        writeCount++;
        return writeCount > 1;
      }),
    };
    internals.loop = { ...loop, on: vi.fn(), dispose: vi.fn() };
    internals.recordingActive = true;
    internals.stream = stream;

    const firstBuffer = Buffer.from("first");
    const secondBuffer = Buffer.from("second");
    internals.writeStream(firstBuffer);
    internals.writeStream(secondBuffer);
    const buffersBeforeDrain = [...writtenBuffers];
    const stopsBeforeDrain = loop.stop.mock.calls.length;

    internals.handleStreamDrain(stream);

    expect({
      buffersBeforeDrain,
      buffersAfterDrain: writtenBuffers,
      stopsBeforeDrain,
      startsAfterDrain: loop.start.mock.calls.length,
      streamBackpressured: internals.streamBackpressured,
    }).toEqual({
      buffersBeforeDrain: [firstBuffer],
      buffersAfterDrain: [firstBuffer, secondBuffer],
      stopsBeforeDrain: 1,
      startsAfterDrain: 1,
      streamBackpressured: false,
    });
  });

  it("queues audio samples in order while the socket is backpressured", () => {
    const { recorder } = createFixture();
    const internals = recorder as unknown as RecorderInternals;
    const writtenBuffers: Buffer[] = [];
    let writeCount = 0;
    const stream = {
      destroyed: false,
      destroy: vi.fn(),
      write: vi.fn((buffer: Buffer, callback: () => void) => {
        writtenBuffers.push(buffer);
        callback();
        writeCount++;
        return writeCount > 1;
      }),
    };
    internals.stream = stream;
    const firstBuffer = Buffer.from("sample one");
    const secondBuffer = Buffer.from("sample two");

    internals.onAudioSample({ toBuffer: () => firstBuffer });
    internals.onAudioSample({ toBuffer: () => secondBuffer });
    const buffersBeforeDrain = [...writtenBuffers];
    const samplesCount = internals.samplesCount;

    internals.handleStreamDrain(stream);

    expect({
      buffersBeforeDrain,
      buffersAfterDrain: writtenBuffers,
      samplesCount,
    }).toEqual({
      buffersBeforeDrain: [firstBuffer],
      buffersAfterDrain: [firstBuffer, secondBuffer],
      samplesCount: 2,
    });
  });

  it("stops a recording when the bounded write queue fills", () => {
    const { options, recorder } = createFixture();
    const internals = recorder as unknown as RecorderInternals;
    const stream = {
      destroyed: false,
      destroy: vi.fn(() => {
        stream.destroyed = true;
      }),
      write: vi.fn(() => false),
    };
    options.reportErrors = false;
    internals.stream = stream;
    internals.streamBackpressured = true;
    internals.mediaTransmissionStarted = true;

    let reportedError: Error | undefined;
    recorder.on("ERROR", ({ err }) => {
      reportedError = err;
    });

    internals.writeStream(Buffer.alloc(1_048_577));

    expect({
      error: reportedError?.message,
      failed: internals.recordingTransportFailed,
      streamBackpressured: internals.streamBackpressured,
      destroyCalls: stream.destroy.mock.calls.length,
    }).toEqual({
      error: "WebSocket send buffer limit exceeded",
      failed: true,
      streamBackpressured: false,
      destroyCalls: 1,
    });
  });

  it("fails a video-only recording when backpressure never drains", () => {
    vi.useFakeTimers();

    try {
      const { options, recorder } = createFixture();
      const internals = recorder as unknown as RecorderInternals;
      const stream = {
        destroyed: false,
        destroy: vi.fn(() => {
          stream.destroyed = true;
        }),
        write: vi.fn((_buffer: Buffer, callback: () => void) => {
          callback();
          return false;
        }),
      };
      options.reportErrors = false;
      options.timeouts.connection = 100;
      internals.stream = stream;
      internals.mediaTransmissionStarted = true;

      let reportedError: Error | undefined;
      recorder.on("ERROR", ({ err }) => {
        reportedError = err;
      });

      internals.writeStream(Buffer.from("frame"));
      vi.advanceTimersByTime(100);

      expect({
        error: reportedError?.message,
        failed: internals.recordingTransportFailed,
        destroyCalls: stream.destroy.mock.calls.length,
      }).toEqual({
        error: "WebSocket write timed out",
        failed: true,
        destroyCalls: 1,
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it("fails instead of reconnecting when the socket closes after media was sent", () => {
    const { options, recorder } = createFixture();
    const internals = recorder as unknown as RecorderInternals;
    options.reportErrors = false;
    internals.connected = true;
    internals.userMediaLoaded = true;
    internals.mediaTransmissionStarted = true;
    internals.framesCount = 4;
    internals.confirmedFrameNumber = 2;

    let reportedError: Error | undefined;
    recorder.on("ERROR", ({ err }) => {
      reportedError = err;
    });

    internals.handleStreamClose("wss://videomail.io/ws");

    expect({
      error: reportedError?.message,
      connected: internals.connected,
      failed: internals.recordingTransportFailed,
      reconnecting: internals.reconnecting,
    }).toEqual({
      error: "Recording interrupted",
      connected: false,
      failed: true,
      reconnecting: false,
    });
  });
});
