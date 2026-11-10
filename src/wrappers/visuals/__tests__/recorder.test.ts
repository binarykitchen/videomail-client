import Resource from "../../../resource";
import mergeWithDefaultOptions from "../../../util/options/mergeWithDefaultOptions";
import type Visuals from "../../visuals";
import Recorder from "../recorder";
import type { RecorderLoop } from "../recorder/capture";
import type Replay from "../replay";
import UserMedia from "../userMedia";

interface RecorderInternals {
  connected: boolean;
  connecting: boolean;
  blocking: boolean;
  emit: (event: "SUBMITTING" | "BLOCKING") => void;
  key?: string;
  stream?: {
    destroyed: boolean;
    write(buffer: Buffer, callback: () => void): boolean;
    destroy(): void;
    emit?(event: string, ...args: unknown[]): boolean;
  };
  streamBackpressured: boolean;
  mediaTransmissionStarted: boolean;
  recordingTransportFailed: boolean;
  recordingActive: boolean;
  framesCount: number;
  samplesCount: number;
  recordingAudioSampleRate?: number;
  confirmedFrameNumber: number;
  writeStream(buffer: Buffer): void;
  onAudioSample(audioSample: { toBuffer: () => Buffer }): void;
  handleStreamDrain(stream: {
    destroyed: boolean;
    write(buffer: Buffer, callback: () => void): boolean;
  }): void;
  handleStreamClose(url2Connect: string): void;
  handleStreamError(url2Connect: string, err: unknown): void;
  preview(args: { key: string; duration: number }): void;
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
  submitting: boolean;
  userMediaLoaded?: boolean;
  connectionOpenedAt?: number;
  closeIdleConnection(reason: string): void;
  userMediaErrorCallback(err: Error, constraints: MediaStreamConstraints): void;
  loadGenuineUserMedia(): void;
  userMedia?: UserMedia;
  loop?: Pick<
    RecorderLoop,
    "complete" | "dispose" | "isRunning" | "on" | "start" | "stop"
  >;
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

function createRecoveryFixture() {
  vi.useFakeTimers();
  const fixture = recordFrames();
  fixture.options.reportErrors = false;
  const internals = fixture.recorder as unknown as RecorderInternals;
  const loop = internals.loop;
  if (!loop) {
    throw new Error("Expected a recorder loop");
  }
  loop.complete = vi.fn();
  const stoppedTrack = vi.fn();
  const stream = { getTracks: () => [{ stop: stoppedTrack }] } as unknown as MediaStream;
  const getUserMedia = vi.fn(() => Promise.resolve(stream));
  vi.stubGlobal("navigator", {
    userAgent: navigator.userAgent,
    mediaDevices: {
      getUserMedia,
      getSupportedConstraints: () => ({}),
    },
  });
  const live = vi.spyOn(fixture.userMedia, "hasLiveStream").mockReturnValue(false);
  const restorePlayback = vi
    .spyOn(fixture.userMedia, "restorePlayback")
    .mockResolvedValue();
  const initialize = vi
    .spyOn(fixture.userMedia, "init")
    .mockImplementation((_stream, ready) => {
      live.mockReturnValue(true);
      ready();
    });
  fixture.recorder.pause();
  vi.mocked(loop.start).mockClear();

  return {
    ...fixture,
    getUserMedia,
    initialize,
    internals,
    live,
    loop,
    restorePlayback,
    stoppedTrack,
    stream,
  };
}

describe("Recorder", () => {
  const PREVIEW_KEY = "00000000-0000-6000-8000-000000000001";

  afterEach(() => {
    if (vi.isFakeTimers()) {
      vi.clearAllTimers();
    }
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("prepares muted inline autoplay before requesting the camera", () => {
    const { recorder, element } = createFixture();

    buildWithoutConnecting(recorder);

    expect(element.querySelector("video")).toMatchObject({
      muted: true,
      defaultMuted: true,
      autoplay: true,
      playsInline: true,
    });
  });

  it("initializes a lazy silent camera without starting a recording", async () => {
    const { recorder } = createFixture();
    buildWithoutConnecting(recorder);
    const internals = recorder as unknown as RecorderInternals;
    const userMedia = internals.userMedia;
    if (!userMedia) {
      throw new Error("Expected the lazy camera to be built.");
    }
    const live = vi.spyOn(userMedia, "hasLiveStream").mockReturnValue(false);
    const mediaStream = {
      getTracks: () => [{ stop: vi.fn() }],
    } as unknown as MediaStream;
    const getUserMedia = vi.fn().mockResolvedValue(mediaStream);
    vi.stubGlobal("navigator", {
      userAgent: navigator.userAgent,
      mediaDevices: {
        getUserMedia,
        getSupportedConstraints: () => ({}),
      },
    });
    vi.spyOn(userMedia, "init").mockImplementation((_stream, ready) => {
      live.mockReturnValue(true);
      ready();
    });

    // This opens the first preview, rather than restoring an already-recorded take.
    const restored = await recorder.recoverCamera();

    expect({
      restored,
      hasRecordingLoop: Boolean(internals.loop),
      recording: recorder.isRecording(),
      audio: getUserMedia.mock.calls[0]?.[0]?.audio,
    }).toEqual({
      restored: true,
      hasRecordingLoop: true,
      recording: false,
      audio: false,
    });
  });

  it("does not resume recording without a live camera stream", () => {
    vi.useFakeTimers();

    try {
      const { recorder } = recordFrames();
      recorder.pause();

      recorder.resume();

      expect(recorder.isPaused()).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("recovers the camera without resetting or resuming the paused take", async () => {
    const { recorder, internals, loop, canvas, resetReplay } = createRecoveryFixture();
    internals.framesCount = 42;
    internals.samplesCount = 17;
    internals.confirmedFrameNumber = 40;
    const resetsBefore = resetReplay.mock.calls.length;

    const restored = await recorder.recoverCamera();

    expect({
      restored,
      paused: recorder.isPaused(),
      frames: internals.framesCount,
      samples: internals.samplesCount,
      confirmed: internals.confirmedFrameNumber,
      dimensions: recorder.getRecordingDimensions(),
      canvasWidth: canvas.width,
      loopStarts: vi.mocked(loop.start).mock.calls.length,
      previewResets: resetReplay.mock.calls.length - resetsBefore,
    }).toEqual({
      restored: true,
      paused: true,
      frames: 42,
      samples: 17,
      confirmed: 40,
      dimensions: { width: 320, height: 240 },
      canvasWidth: 320,
      loopStarts: 0,
      previewResets: 0,
    });
  });

  it("shares one camera request across repeated recovery calls", async () => {
    const { recorder, getUserMedia } = createRecoveryFixture();

    const first = recorder.recoverCamera();
    const second = recorder.recoverCamera();
    await first;

    expect({
      sameRequest: first === second,
      requests: getUserMedia.mock.calls.length,
    }).toEqual({ sameRequest: true, requests: 1 });
  });

  it("releases the old capture session before requesting its replacement", async () => {
    const { recorder, userMedia, getUserMedia } = createRecoveryFixture();
    const stop = vi.spyOn(userMedia, "stop");

    await recorder.recoverCamera();

    expect(stop).toHaveBeenCalledBefore(getUserMedia);
  });

  it("replaces live but frozen camera tracks without resuming or losing the take", async () => {
    const { recorder, userMedia, live, getUserMedia, internals, loop } =
      createRecoveryFixture();
    live.mockReturnValue(true);
    userMedia.resume();
    internals.framesCount = 42;
    internals.samplesCount = 17;

    const restored = await recorder.recoverCameraAfterStall();

    expect({
      restored,
      requests: getUserMedia.mock.calls.length,
      paused: recorder.isPaused(),
      frames: internals.framesCount,
      samples: internals.samplesCount,
      starts: vi.mocked(loop.start).mock.calls.length,
    }).toEqual({
      restored: true,
      requests: 1,
      paused: true,
      frames: 42,
      samples: 17,
      starts: 0,
    });
  });

  it("limits repeated stalls to one automatic restart and keeps the take retryable", async () => {
    const { recorder, getUserMedia, internals } = createRecoveryFixture();
    const failed = vi.fn();
    const fatal = vi.fn();
    recorder.on("CAMERA_RECOVERY_FAILED", failed);
    recorder.on("ERROR", fatal);
    internals.framesCount = 42;
    await recorder.recoverCameraAfterStall();

    const restored = await recorder.recoverCameraAfterStall();

    expect({
      restored,
      requests: getUserMedia.mock.calls.length,
      recoverable: failed.mock.calls.length,
      fatal: fatal.mock.calls.length,
      frames: internals.framesCount,
      paused: recorder.isPaused(),
    }).toEqual({
      restored: false,
      requests: 1,
      recoverable: 1,
      fatal: 0,
      frames: 42,
      paused: true,
    });
  });

  it("allows an explicit recovery to reset the automatic retry budget", async () => {
    const { recorder, getUserMedia } = createRecoveryFixture();
    await recorder.recoverCameraAfterStall();
    await recorder.recoverCameraAfterStall();
    await recorder.recoverCamera();

    await recorder.recoverCameraAfterStall();

    expect(getUserMedia).toHaveBeenCalledTimes(2);
  });

  it("gives a fresh camera request its own automatic retry budget", async () => {
    const { recorder, getUserMedia, internals } = createRecoveryFixture();
    await recorder.recoverCameraAfterStall();
    await recorder.recoverCameraAfterStall();

    internals.loadGenuineUserMedia();
    await Promise.resolve();
    await recorder.recoverCameraAfterStall();

    expect(getUserMedia).toHaveBeenCalledTimes(3);
  });

  it("never replaces an unsent preview after a stale stall callback", async () => {
    const { recorder, getUserMedia, internals } = createRecoveryFixture();
    internals.key = PREVIEW_KEY;

    const restored = await recorder.recoverCameraAfterStall();

    expect({ restored, requests: getUserMedia.mock.calls.length }).toEqual({
      restored: false,
      requests: 0,
    });
  });

  it("pauses an interrupted active take before reopening its camera", async () => {
    const { recorder, userMedia, loop } = createRecoveryFixture();
    userMedia.resume();

    const restored = await recorder.recoverCamera();

    expect({
      restored,
      paused: recorder.isPaused(),
      starts: vi.mocked(loop.start).mock.calls.length,
    }).toEqual({ restored: true, paused: true, starts: 0 });
  });

  it("restores an idle camera without starting a recording", async () => {
    const { recorder, userMedia, internals, loop } = createRecoveryFixture();
    internals.recordingActive = false;
    userMedia.resume();

    const restored = await recorder.recoverCamera();

    expect({
      restored,
      recording: internals.recordingActive,
      starts: vi.mocked(loop.start).mock.calls.length,
    }).toEqual({ restored: true, recording: false, starts: 0 });
  });

  it("does not reacquire a healthy camera", async () => {
    const { recorder, getUserMedia, live, restorePlayback } = createRecoveryFixture();
    live.mockReturnValue(true);

    const restored = await recorder.recoverCamera();

    expect({
      restored,
      requests: getUserMedia.mock.calls.length,
      playback: restorePlayback.mock.calls.length,
      paused: recorder.isPaused(),
    }).toEqual({ restored: true, requests: 0, playback: 1, paused: true });
  });

  it("reports playback failure without reacquiring healthy camera tracks", async () => {
    const { recorder, getUserMedia, live, restorePlayback } = createRecoveryFixture();
    live.mockReturnValue(true);
    restorePlayback.mockRejectedValue(new DOMException("Denied", "NotAllowedError"));
    const failed = vi.fn();
    recorder.on("CAMERA_RECOVERY_FAILED", failed);

    const restored = await recorder.recoverCamera();

    expect({
      restored,
      requests: getUserMedia.mock.calls.length,
      errors: failed.mock.calls.length,
      paused: recorder.isPaused(),
    }).toEqual({ restored: false, requests: 0, errors: 1, paused: true });
  });

  it("waits for camera recovery after an explicit Resume request", async () => {
    const { recorder, getUserMedia, stream, loop } = createRecoveryFixture();
    const pending = Promise.withResolvers<MediaStream>();
    getUserMedia.mockReturnValue(pending.promise);

    recorder.resume();
    const pausedWhileWaiting = recorder.isPaused();
    pending.resolve(stream);
    await pending.promise;

    expect({
      pausedWhileWaiting,
      pausedAfterReady: recorder.isPaused(),
      loopStarts: vi.mocked(loop.start).mock.calls.length,
    }).toEqual({ pausedWhileWaiting: true, pausedAfterReady: false, loopStarts: 1 });
  });

  it("waits for media initialization even when the new tracks are already live", async () => {
    const { recorder, initialize, live, loop } = createRecoveryFixture();
    const initialization: { ready?: () => void } = {};
    initialize.mockImplementation((_stream, ready) => {
      live.mockReturnValue(true);
      initialization.ready = ready;
    });

    const recovery = recorder.recoverCamera();
    await Promise.resolve();
    recorder.resume();
    const startsBeforeReady = vi.mocked(loop.start).mock.calls.length;
    initialization.ready?.();
    await recovery;

    expect({
      startsBeforeReady,
      startsAfterReady: vi.mocked(loop.start).mock.calls.length,
    }).toEqual({ startsBeforeReady: 0, startsAfterReady: 1 });
  });

  it("rejects a changed audio sample rate without losing the original PCM metadata", async () => {
    const { recorder, internals, userMedia } = createRecoveryFixture();
    internals.recordingAudioSampleRate = 48_000;
    internals.samplesCount = 17;
    vi.spyOn(userMedia, "getAudioSampleRate").mockReturnValue(44_100);

    const restored = await recorder.recoverCamera();

    expect({
      restored,
      paused: recorder.isPaused(),
      sampleRate: recorder.getAudioSampleRate(),
      samples: internals.samplesCount,
    }).toEqual({ restored: false, paused: true, sampleRate: 48_000, samples: 17 });
  });

  it("reports denied permissions without resetting the captured take", async () => {
    const { recorder, getUserMedia, internals } = createRecoveryFixture();
    internals.framesCount = 42;
    internals.samplesCount = 17;
    getUserMedia.mockRejectedValue(new DOMException("Denied", "NotAllowedError"));
    const failed = vi.fn();
    const fatal = vi.fn();
    recorder.on("CAMERA_RECOVERY_FAILED", failed);
    recorder.on("ERROR", fatal);

    const restored = await recorder.recoverCamera();

    expect({
      restored,
      paused: recorder.isPaused(),
      frames: internals.framesCount,
      samples: internals.samplesCount,
      recoverableErrors: failed.mock.calls.length,
      fatalErrors: fatal.mock.calls.length,
    }).toEqual({
      restored: false,
      paused: true,
      frames: 42,
      samples: 17,
      recoverableErrors: 1,
      fatalErrors: 0,
    });
  });

  it("allows a camera retry after permission failure", async () => {
    const { recorder, getUserMedia, stream } = createRecoveryFixture();
    getUserMedia.mockRejectedValueOnce(new DOMException("Denied", "NotAllowedError"));

    await recorder.recoverCamera();
    getUserMedia.mockResolvedValue(stream);
    const restored = await recorder.recoverCamera();

    expect({ restored, requests: getUserMedia.mock.calls.length }).toEqual({
      restored: true,
      requests: 2,
    });
  });

  it.each(["pause", "stop", "reset", "unload", "submission", "blocking"])(
    "stops a late camera stream after %s cancels recovery",
    async (action) => {
      const { recorder, getUserMedia, stream, initialize, stoppedTrack, internals } =
        createRecoveryFixture();
      const pending = Promise.withResolvers<MediaStream>();
      getUserMedia.mockReturnValue(pending.promise);

      const recovery = recorder.recoverCamera();
      if (action === "pause") {
        recorder.pause();
      }
      if (action === "stop") {
        recorder.stop();
      }
      if (action === "reset") {
        recorder.reset();
      }
      if (action === "unload") {
        recorder.unload();
      }
      if (action === "submission") {
        internals.emit("SUBMITTING");
      }
      if (action === "blocking") {
        internals.emit("BLOCKING");
      }
      pending.resolve(stream);
      await pending.promise;
      const restored = await recovery;

      expect({
        restored,
        attached: initialize.mock.calls.length,
        stopped: stoppedTrack.mock.calls.length,
      }).toEqual({ restored: false, attached: 0, stopped: 1 });
    },
  );

  it("times out camera recovery and stops a stream that arrives later", async () => {
    const { recorder, options, getUserMedia, stream, stoppedTrack } =
      createRecoveryFixture();
    const pending = Promise.withResolvers<MediaStream>();
    getUserMedia.mockReturnValue(pending.promise);

    const recovery = recorder.recoverCamera();
    await vi.advanceTimersByTimeAsync(options.timeouts.userMedia);
    const restored = await recovery;
    pending.resolve(stream);
    await pending.promise;

    expect({
      restored,
      paused: recorder.isPaused(),
      stopped: stoppedTrack.mock.calls.length,
    }).toEqual({ restored: false, paused: true, stopped: 1 });
  });

  it("leaves an unsent preview untouched without requesting the camera", async () => {
    const { recorder, internals, getUserMedia } = createRecoveryFixture();
    internals.key = PREVIEW_KEY;

    const restored = await recorder.recoverCamera();

    expect({
      restored,
      key: internals.key,
      requests: getUserMedia.mock.calls.length,
    }).toEqual({ restored: false, key: PREVIEW_KEY, requests: 0 });
  });

  it("does not request the camera during submission", async () => {
    const { recorder, internals, getUserMedia } = createRecoveryFixture();
    internals.submitting = true;

    const restored = await recorder.recoverCamera();

    expect({ restored, requests: getUserMedia.mock.calls.length }).toEqual({
      restored: false,
      requests: 0,
    });
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

  it("closes the WebSocket when unloaded during submission", () => {
    const { recorder } = createFixture();
    const internals = recorder as unknown as RecorderInternals;
    const destroy = vi.fn();
    buildWithoutConnecting(recorder);
    internals.stream = {
      destroyed: false,
      write: vi.fn(() => true),
      destroy,
    };
    internals.submitting = true;

    recorder.unload();

    expect(destroy).toHaveBeenCalledOnce();
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

  it("does not validate an empty recorder just because its socket is connected", () => {
    const { recorder } = createFixture();
    const internals = recorder as unknown as RecorderInternals;
    internals.connected = true;

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

  it.each(["initial", "idle"])(
    "reports %s constructor failures to the server with structured runtime diagnostics",
    (phase) => {
      const { recorder } = createFixture();
      const report = vi
        .spyOn(Resource.prototype, "reportError")
        .mockResolvedValue(undefined);
      const internals = recorder as unknown as RecorderInternals;
      if (phase === "idle") {
        internals.connectionOpenedAt = 0;
      }
      vi.stubGlobal("WebSocket", function WrappedSocket() {
        throw new DOMException("The provided URL is invalid.", "SyntaxError");
      });
      recorder.on("ERROR", vi.fn());

      internals.initSocket();

      expect(report).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Failed to construct WebSocket"),
          cause: expect.objectContaining({
            transportStage: "constructor",
            transportPhase: phase,
            mediaTransmissionStarted: false,
            webSocketDiagnostic: expect.objectContaining({
              version: 4,
              constructor: expect.objectContaining({ nativeLike: false }),
              endpoint: "wss://videomail.io/ws",
            }),
          }),
          err: expect.objectContaining({ name: "SyntaxError", code: 12 }),
        }),
      );
    },
  );

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

  it("marks initial transport failures separately from recorded-media failures", () => {
    const { options, recorder } = createFixture();
    options.reportErrors = false;
    const internals = recorder as unknown as RecorderInternals;
    const reported = vi.fn();
    recorder.on("ERROR", reported);

    internals.handleConnectionFailure({ url2Connect: options.socketUrl, cause: "error" });

    expect(reported).toHaveBeenCalledWith(
      expect.objectContaining({
        err: expect.objectContaining({
          cause: expect.objectContaining({
            transportPhase: "initial",
            mediaTransmissionStarted: false,
            framesCount: 0,
            samplesCount: 0,
            automation: { webdriver: false, userAgentMatched: false },
          }),
        }),
      }),
    );
  });

  it("keeps camera denial as the primary error and closes the idle socket", () => {
    const { options, recorder } = createFixture();
    options.reportErrors = false;
    buildWithoutConnecting(recorder);
    const internals = recorder as unknown as RecorderInternals;
    const destroy = vi.fn();
    internals.stream = { destroyed: false, destroy, write: vi.fn(() => true) };
    const reported = vi.fn();
    recorder.on("ERROR", reported);

    internals.userMediaErrorCallback(
      new DOMException("Camera access denied", "NotAllowedError"),
      { video: true },
    );

    expect({
      message: reported.mock.calls[0]?.[0].err.message,
      errors: reported.mock.calls.length,
      closed: destroy.mock.calls.length,
      connected: internals.connected,
    }).toEqual({ message: "Permission denied", errors: 1, closed: 1, connected: false });
  });

  it("does not replace a blocking camera error with a later idle socket error", () => {
    const { options, recorder } = createFixture();
    options.reportErrors = false;
    buildWithoutConnecting(recorder);
    const internals = recorder as unknown as RecorderInternals;
    const reported = vi.fn();
    recorder.on("ERROR", reported);
    internals.emit("BLOCKING");

    internals.handleStreamError(options.socketUrl, new Event("error"));
    internals.handleStreamClose(options.socketUrl);

    expect(reported).not.toHaveBeenCalled();
  });

  it("reconnects an idle camera-ready socket error without emitting a fatal error", () => {
    vi.useFakeTimers();
    const { options, recorder } = createFixture();
    options.reportErrors = false;
    const internals = recorder as unknown as RecorderInternals;
    internals.connected = true;
    internals.userMediaLoaded = true;
    const reconnect = vi
      .spyOn(internals, "initSocket")
      .mockImplementation(() => undefined);
    const reported = vi.fn();
    recorder.on("ERROR", reported);

    internals.handleStreamError(options.socketUrl, new Event("error"));
    vi.advanceTimersByTime(1000);

    expect({
      attempts: reconnect.mock.calls.length,
      errors: reported.mock.calls.length,
    }).toEqual({ attempts: 1, errors: 0 });
  });

  it("preserves backoff when a reconnection attempt emits an error", () => {
    vi.useFakeTimers();
    const { options, recorder } = createFixture();
    options.reportErrors = false;
    const internals = recorder as unknown as RecorderInternals;
    internals.reconnecting = true;
    internals.userMediaLoaded = true;
    const reconnect = vi
      .spyOn(internals, "initSocket")
      .mockImplementation(() => undefined);

    internals.handleStreamError(options.socketUrl, new Event("error"));
    vi.advanceTimersByTime(1000);

    expect(reconnect).toHaveBeenCalledOnce();
  });

  it("cancels a pending idle reconnect when an error becomes blocking", () => {
    vi.useFakeTimers();
    const { options, recorder } = createFixture();
    options.reportErrors = false;
    buildWithoutConnecting(recorder);
    const internals = recorder as unknown as RecorderInternals;
    internals.userMediaLoaded = true;
    internals.reconnecting = true;
    const reconnect = vi
      .spyOn(internals, "initSocket")
      .mockImplementation(() => undefined);
    internals.handleConnectionFailure({ url2Connect: options.socketUrl, cause: "error" });

    internals.emit("BLOCKING");
    vi.advanceTimersByTime(1000);

    expect(reconnect).not.toHaveBeenCalled();
  });

  it("reports idle failure diagnostics when no camera is loaded", () => {
    const { options, recorder } = createFixture();
    options.reportErrors = false;
    const internals = recorder as unknown as RecorderInternals;
    internals.connected = true;
    internals.connectionOpenedAt = Date.now() - 14000;
    const reported = vi.fn();
    recorder.on("ERROR", reported);

    internals.handleStreamError(options.socketUrl, new Event("error"));

    expect(reported).toHaveBeenCalledWith(
      expect.objectContaining({
        err: expect.objectContaining({
          cause: expect.objectContaining({
            transportPhase: "idle",
            mediaTransmissionStarted: false,
          }),
        }),
      }),
    );
  });

  it("ignores late error, connect and data events from a discarded socket", () => {
    vi.useFakeTimers();
    const { options, recorder } = createFixture();
    options.reportErrors = false;
    vi.stubGlobal(
      "WebSocket",
      vi.fn(function () {
        return { readyState: 0, OPEN: 1, addEventListener: vi.fn(), close: vi.fn() };
      }),
    );
    const internals = recorder as unknown as RecorderInternals;
    const reported = vi.fn();
    recorder.on("ERROR", reported);
    internals.initSocket();
    const previous = internals.stream;
    if (!previous?.emit) {
      throw new Error("Expected a WebSocket stream");
    }
    internals.closeIdleConnection("test-camera-denial");
    internals.initSocket();

    previous.emit("error", new Error("Late transport error"));
    previous.emit("close");
    previous.emit("connect");
    previous.emit("data", Buffer.from("invalid command"));

    expect({
      errors: reported.mock.calls.length,
      connected: internals.connected,
      connecting: internals.connecting,
      replaced: internals.stream !== previous,
    }).toEqual({ errors: 0, connected: false, connecting: true, replaced: true });
    internals.closeIdleConnection("test-cleanup");
  });

  it("does not fail a replacement socket from an already queued close callback", () => {
    vi.useFakeTimers();
    const { options, recorder } = createFixture();
    options.reportErrors = false;
    const internals = recorder as unknown as RecorderInternals;
    const reported = vi.fn();
    recorder.on("ERROR", reported);
    internals.stream = { destroyed: false, destroy: vi.fn(), write: vi.fn(() => true) };
    internals.handleStreamClose(options.socketUrl);
    internals.closeIdleConnection("test-camera-denial");
    internals.stream = { destroyed: false, destroy: vi.fn(), write: vi.fn(() => true) };

    vi.runAllTimers();

    expect(reported).not.toHaveBeenCalled();
  });

  it("does not hide an unfinished recording failure behind a blocking notification", () => {
    const { options, recorder } = createFixture();
    options.reportErrors = false;
    const internals = recorder as unknown as RecorderInternals;
    internals.blocking = true;
    internals.connected = true;
    internals.mediaTransmissionStarted = true;
    const reported = vi.fn();
    recorder.on("ERROR", reported);

    internals.handleStreamError(options.socketUrl, new Event("error"));

    expect(reported).toHaveBeenCalledWith(
      expect.objectContaining({
        err: expect.objectContaining({ message: "Recording interrupted" }),
      }),
    );
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

  it("keeps an encoded preview usable after an abnormal socket close", () => {
    vi.useFakeTimers();

    try {
      const { options, recorder } = recordFrames();
      const internals = recorder as unknown as RecorderInternals;
      options.reportErrors = false;
      internals.mediaTransmissionStarted = true;
      recorder.reset();
      internals.preview({ key: PREVIEW_KEY, duration: 182.031 });
      internals.lastCloseEvent = { code: 1006, reason: "", wasClean: false };

      let reportedError: Error | undefined;
      recorder.on("ERROR", ({ err }) => {
        reportedError = err;
      });

      internals.handleStreamClose("wss://videomail.io/ws");
      vi.runOnlyPendingTimers();

      expect({
        connected: recorder.isConnected(),
        key: internals.key,
        valid: recorder.validate(),
        reportedError,
      }).toEqual({
        connected: false,
        key: PREVIEW_KEY,
        valid: true,
        reportedError: undefined,
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it("invalidates the previous preview when the recorder is reset", () => {
    const { recorder } = recordFrames();
    const internals = recorder as unknown as RecorderInternals;
    recorder.reset();
    internals.preview({ key: PREVIEW_KEY, duration: 182.031 });

    recorder.reset();

    expect(recorder.validate()).toBe(false);
  });

  it("reconnects and clears the old preview when recording again after disconnect", () => {
    const { recorder } = recordFrames();
    const internals = recorder as unknown as RecorderInternals;
    recorder.reset();
    internals.preview({ key: PREVIEW_KEY, duration: 182.031 });
    internals.handleStreamClose("wss://videomail.io/ws");
    const initSocket = vi
      .spyOn(internals, "initSocket")
      .mockImplementation(() => undefined);

    recorder.back(() => undefined);

    expect({
      connectionAttempts: initSocket.mock.calls.length,
      key: internals.key,
      valid: recorder.validate(),
    }).toEqual({ connectionAttempts: 1, key: undefined, valid: false });
  });

  it("stops pause heartbeats when the preview socket closes", () => {
    vi.useFakeTimers();

    try {
      const { recorder } = recordFrames();
      const internals = recorder as unknown as RecorderInternals;
      recorder.pause();
      recorder.reset();
      internals.preview({ key: PREVIEW_KEY, duration: 182.031 });

      internals.handleStreamClose("wss://videomail.io/ws");

      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it.each(["before", "after"])(
    "preserves a completed preview when a stream error arrives %s close",
    (order) => {
      const { options, recorder } = recordFrames();
      const internals = recorder as unknown as RecorderInternals;
      options.reportErrors = false;
      recorder.reset();
      internals.preview({ key: PREVIEW_KEY, duration: 182.031 });
      const stream = {
        destroyed: false,
        destroy: vi.fn(() => {
          stream.destroyed = true;
        }),
        write: vi.fn(() => true),
      };
      internals.stream = stream;

      let reportedError: Error | undefined;
      recorder.on("ERROR", ({ err }) => {
        reportedError = err;
      });

      if (order === "after") {
        internals.handleStreamClose("wss://videomail.io/ws");
      }

      internals.handleStreamError("wss://videomail.io/ws", new Error("ECONNRESET"));

      if (order === "before") {
        internals.handleStreamClose("wss://videomail.io/ws");
      }

      expect({
        connected: recorder.isConnected(),
        key: internals.key,
        valid: recorder.validate(),
        reportedError,
        destroyCalls: stream.destroy.mock.calls.length,
      }).toEqual({
        connected: false,
        key: PREVIEW_KEY,
        valid: true,
        reportedError: undefined,
        destroyCalls: 1,
      });
    },
  );

  it("ignores a deferred connection failure after the server completed a preview", () => {
    const { options, recorder } = recordFrames();
    const internals = recorder as unknown as RecorderInternals;
    options.reportErrors = false;
    recorder.reset();
    internals.preview({ key: PREVIEW_KEY, duration: 182.031 });
    internals.connected = false;

    let reportedError: Error | undefined;
    recorder.on("ERROR", ({ err }) => {
      reportedError = err;
    });

    internals.failConnection({ url2Connect: "wss://videomail.io/ws", cause: "closed" });

    expect({ valid: recorder.validate(), reportedError }).toEqual({
      valid: true,
      reportedError: undefined,
    });
  });

  it("still fails an unfinished recording when its stream emits an error", () => {
    const { options, recorder } = createFixture();
    const internals = recorder as unknown as RecorderInternals;
    options.reportErrors = false;
    internals.connected = true;
    internals.mediaTransmissionStarted = true;
    internals.framesCount = 4;
    internals.confirmedFrameNumber = 2;

    let reportedError: Error | undefined;
    recorder.on("ERROR", ({ err }) => {
      reportedError = err;
    });

    internals.handleStreamError("wss://videomail.io/ws", new Error("ECONNRESET"));

    expect(reportedError?.message).toBe("Recording interrupted");
  });
});
