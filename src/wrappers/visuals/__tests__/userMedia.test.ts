import { createNanoEvents } from "nanoevents";

import type { VideomailEvents } from "../../../types/events";
import getBrowser from "../../../util/browser/getBrowser";
import AudioRecorder from "../../../util/html/media/AudioRecorder";
import mergeWithDefaultOptions from "../../../util/options/mergeWithDefaultOptions";
import type Recorder from "../recorder";
import UserMedia from "../userMedia";

vi.mock("../../../util/error/createError", () => ({
  default: ({ message }: { message: string }) => new Error(message),
}));

function createMediaFixture(audio = false) {
  const videoElement = document.createElement("video");
  const emitter = createNanoEvents<VideomailEvents>();
  const recoverCameraAfterStall = vi.fn();
  const videoTrack = {
    enabled: true,
    getCapabilities: () => ({ frameRate: { max: 30, min: 1 } }),
    kind: "video",
    label: "Built-in Camera",
    muted: false,
    readyState: "live",
    stop: vi.fn(),
  };
  const audioTrack = {
    enabled: true,
    kind: "audio",
    label: "Built-in Microphone",
    muted: false,
    readyState: "live",
    stop: vi.fn(),
  };
  const media = {
    active: true,
    getTracks: () => (audio ? [videoTrack, audioTrack] : [videoTrack]),
    getVideoTracks: () => [videoTrack],
    getAudioTracks: () => (audio ? [audioTrack] : []),
  };
  const stream = media as unknown as MediaStream;
  const recorder = {
    getRawVisualUserMedia: () => videoElement,
    recoverCameraAfterStall,
  } as unknown as Recorder;
  const options = mergeWithDefaultOptions({ audio: { enabled: audio } });
  const userMedia = new UserMedia(recorder, options, emitter);
  const load = vi.spyOn(videoElement, "load").mockImplementation(() => undefined);
  vi.spyOn(videoElement, "play").mockResolvedValue();
  Object.defineProperties(videoElement, {
    videoWidth: { configurable: true, value: 320 },
    videoHeight: { configurable: true, value: 240 },
  });
  const ready = vi.fn();
  const failed = vi.fn();
  const onAudio = vi.fn();

  return {
    userMedia,
    videoElement,
    emitter,
    videoTrack,
    audioTrack,
    media,
    stream,
    ready,
    failed,
    onAudio,
    options,
    recoverCameraAfterStall,
    load,
  };
}

function createCanvasPreviewFixture() {
  const fixture = createMediaFixture();
  const { options, videoElement } = fixture;
  vi.spyOn(getBrowser(options), "shouldUseCanvasCameraPreview").mockReturnValue(true);
  const container = document.createElement("div");
  container.className = "videomail";
  const frame = document.createElement("div");
  frame.className = "visuals fixedAspectRatio";
  frame.append(videoElement);
  container.append(frame);
  document.body.append(container);

  const drawImage = vi.fn<(image: CanvasImageSource, ...coordinates: number[]) => void>();
  const context: Pick<CanvasRenderingContext2D, "drawImage"> = { drawImage };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as CanvasRenderingContext2D,
  );
  let drawFrame: (() => void) | undefined;
  const cancel = vi.fn(() => {
    drawFrame = undefined;
  });
  Object.defineProperties(videoElement, {
    requestVideoFrameCallback: {
      value: (callback: () => void) => {
        drawFrame = callback;
        return 1;
      },
    },
    cancelVideoFrameCallback: { value: cancel },
    readyState: { value: HTMLMediaElement.HAVE_CURRENT_DATA },
  });

  function attachCamera() {
    fixture.userMedia.init(
      fixture.stream,
      fixture.ready,
      fixture.onAudio,
      fixture.failed,
    );
  }

  function submitFrame() {
    drawFrame?.();
  }

  return { ...fixture, frame, drawImage, cancel, attachCamera, submitFrame };
}

describe("UserMedia", () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("captures at the configured size even when the preview is narrower", () => {
    const { userMedia, videoElement, options } = createMediaFixture();
    options.video.width = 960;
    options.video.height = 720;
    Object.defineProperties(videoElement, {
      videoWidth: { configurable: true, value: 1280 },
      videoHeight: { configurable: true, value: 960 },
    });

    const canvas = userMedia.createCanvas();

    expect({ width: canvas.width, height: canvas.height }).toEqual({
      width: 960,
      height: 720,
    });
  });

  it("does not upscale when the camera cannot meet the configured capture size", () => {
    const { userMedia, options } = createMediaFixture();
    options.video.width = 960;
    options.video.height = 720;

    const canvas = userMedia.createCanvas();

    expect({ width: canvas.width, height: canvas.height }).toEqual({
      width: 320,
      height: 240,
    });
  });

  it("does not reload an attached live camera stream", () => {
    const { userMedia, load, stream, ready, failed, onAudio } = createMediaFixture();

    userMedia.init(stream, ready, onAudio, failed);

    expect(load).not.toHaveBeenCalled();
  });

  it("shows decoded camera frames without replacing the original video", () => {
    const { attachCamera, drawImage, frame, stream, submitFrame, videoElement } =
      createCanvasPreviewFixture();

    attachCamera();
    const overlay = frame.querySelector("canvas");
    submitFrame();

    expect({
      overlayHiddenFromAssistiveTech: overlay?.getAttribute("aria-hidden"),
      width: overlay?.width,
      height: overlay?.height,
      stream: frame.querySelector("video")?.srcObject,
      frames: drawImage.mock.calls,
    }).toEqual({
      overlayHiddenFromAssistiveTech: "true",
      width: 320,
      height: 240,
      stream,
      frames: [[videoElement, 0, 0, 320, 240]],
    });
  });

  it("keeps the native preview when no fixed frame is configured", () => {
    const { attachCamera, frame } = createCanvasPreviewFixture();
    frame.classList.remove("fixedAspectRatio");

    attachCamera();

    expect(frame.querySelector("canvas")).toBeNull();
  });

  it("cancels the preview frame callback and removes the canvas on stop", () => {
    const { attachCamera, cancel, drawImage, frame, submitFrame, userMedia } =
      createCanvasPreviewFixture();
    attachCamera();

    userMedia.stop();
    submitFrame();

    expect({
      overlay: frame.querySelector("canvas"),
      canceled: cancel.mock.calls.length,
      frames: drawImage.mock.calls.length,
    }).toEqual({ overlay: null, canceled: 1, frames: 0 });
  });

  it("keeps the canvas visible and retries when a camera frame is not yet drawable", () => {
    const { attachCamera, drawImage, frame, submitFrame, videoElement } =
      createCanvasPreviewFixture();
    drawImage.mockImplementationOnce(() => {
      throw new DOMException("No image data", "InvalidStateError");
    });

    attachCamera();
    const overlay = frame.querySelector("canvas");
    submitFrame();
    const coveredBetweenFrames = overlay?.isConnected;
    submitFrame();

    expect({
      coveredBetweenFrames,
      overlay: frame.querySelector("canvas"),
      frames: drawImage.mock.calls,
    }).toEqual({
      coveredBetweenFrames: true,
      overlay,
      frames: Array.from({ length: 2 }, () => [videoElement, 0, 0, 320, 240]),
    });
  });

  it.each([
    ["an unexpected draw error", new Error("Unable to draw")],
    ["a repeated missing frame", new DOMException("No image data", "InvalidStateError")],
  ])("falls back to the native video after %s", (_scenario, error) => {
    const { attachCamera, drawImage, frame, options, stream, submitFrame, videoElement } =
      createCanvasPreviewFixture();
    const warn = vi.spyOn(options.logger, "warn").mockImplementation(() => undefined);
    drawImage.mockImplementation(() => {
      throw error;
    });

    attachCamera();
    submitFrame();
    submitFrame();

    expect({
      overlay: frame.querySelector("canvas"),
      stream: videoElement.srcObject,
      warnings: warn.mock.calls,
    }).toEqual({
      overlay: null,
      stream,
      warnings: [[expect.stringContaining("using the native preview")]],
    });
  });

  it("does not report readiness from play before playback actually starts", () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio } =
      createMediaFixture();

    userMedia.init(stream, ready, onAudio, failed);
    videoElement.dispatchEvent(new Event("play"));
    videoElement.dispatchEvent(new Event("loadedmetadata"));

    expect(ready).not.toHaveBeenCalled();
  });

  it("reports readiness when metadata and actual playback are available", () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio } =
      createMediaFixture();

    userMedia.init(stream, ready, onAudio, failed);
    videoElement.dispatchEvent(new Event("loadedmetadata"));
    videoElement.dispatchEvent(new Event("playing"));

    expect(ready).toHaveBeenCalledExactlyOnceWith();
  });

  it("asks the recorder to recover a frozen iOS preview", () => {
    vi.useFakeTimers();
    const fixture = createMediaFixture();
    const { userMedia, videoElement, stream, ready, failed, onAudio } = fixture;
    vi.spyOn(getBrowser(fixture.options), "isIOS").mockReturnValue(true);
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    vi.spyOn(videoElement, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 320, 240),
    );
    document.body.appendChild(videoElement);

    userMedia.init(stream, ready, onAudio, failed);
    videoElement.dispatchEvent(new Event("loadedmetadata"));
    videoElement.dispatchEvent(new Event("playing"));
    vi.advanceTimersByTime(3000);

    expect(fixture.recoverCameraAfterStall).toHaveBeenCalledExactlyOnceWith();
  });

  it.each(["stop", "unload"])("stops monitoring iOS playback on %s", (action) => {
    vi.useFakeTimers();
    const fixture = createMediaFixture();
    const { userMedia, videoElement, stream, ready, failed, onAudio } = fixture;
    vi.spyOn(getBrowser(fixture.options), "isIOS").mockReturnValue(true);
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    vi.spyOn(videoElement, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 320, 240),
    );
    document.body.appendChild(videoElement);
    userMedia.init(stream, ready, onAudio, failed);
    videoElement.dispatchEvent(new Event("loadedmetadata"));
    videoElement.dispatchEvent(new Event("playing"));

    if (action === "stop") {
      userMedia.stop();
    } else {
      userMedia.unloadRemainingEventListeners();
    }
    vi.advanceTimersByTime(10_000);

    expect(fixture.recoverCameraAfterStall).not.toHaveBeenCalled();
  });

  it("gives restored iOS playback a fresh frame deadline", async () => {
    vi.useFakeTimers();
    const fixture = createMediaFixture();
    const { userMedia, videoElement, stream, ready, failed, onAudio } = fixture;
    vi.spyOn(getBrowser(fixture.options), "isIOS").mockReturnValue(true);
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    vi.spyOn(videoElement, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 320, 240),
    );
    document.body.appendChild(videoElement);
    userMedia.init(stream, ready, onAudio, failed);
    videoElement.dispatchEvent(new Event("loadedmetadata"));
    videoElement.dispatchEvent(new Event("playing"));
    vi.advanceTimersByTime(2000);

    await userMedia.restorePlayback();
    vi.advanceTimersByTime(2000);

    expect(fixture.recoverCameraAfterStall).not.toHaveBeenCalled();
  });

  describe.each([
    {
      description: "missing frame-rate capabilities",
      getCapabilities: () => ({}),
    },
    {
      description: "missing capability APIs",
      getCapabilities: undefined,
    },
    {
      description: "throwing capability APIs",
      getCapabilities: () => {
        throw new Error("Capabilities unavailable");
      },
    },
    {
      description: "reported frame rates",
      getCapabilities: () => ({ frameRate: { min: 1, max: 30 } }),
    },
  ])("camera detection with $description", ({ getCapabilities }) => {
    it("accepts a physical camera through readiness", () => {
      const { userMedia, videoElement, videoTrack, stream, ready, failed, onAudio } =
        createMediaFixture();
      videoTrack.label = "Integrated Camera";
      Object.defineProperty(videoTrack, "getCapabilities", { value: getCapabilities });

      userMedia.init(stream, ready, onAudio, failed);
      videoElement.dispatchEvent(new Event("playing"));
      videoElement.dispatchEvent(new Event("loadedmetadata"));

      expect({
        ready: ready.mock.calls.length,
        failures: failed.mock.calls,
        stream: videoElement.srcObject,
      }).toEqual({ ready: 1, failures: [], stream });
    });

    it("rejects a known virtual camera before attaching its stream", () => {
      const { userMedia, videoElement, videoTrack, stream, ready, failed, onAudio } =
        createMediaFixture();
      videoTrack.label = "OBS Virtual Camera";
      Object.defineProperty(videoTrack, "getCapabilities", { value: getCapabilities });

      userMedia.init(stream, ready, onAudio, failed);

      expect({
        ready: ready.mock.calls.length,
        failures: failed.mock.calls,
        attached: Boolean(videoElement.srcObject),
      }).toEqual({
        ready: 0,
        failures: [[new Error("Virtual cameras are not allowed.")]],
        attached: false,
      });
    });
  });

  it("recognizes live camera tracks without resetting recording flags", () => {
    const { userMedia, stream, ready, failed, onAudio } = createMediaFixture();
    userMedia.record();
    userMedia.pause();

    userMedia.init(stream, ready, onAudio, failed, { recovering: true });

    expect({
      live: userMedia.hasLiveStream(),
      paused: userMedia.isPaused(),
      recording: userMedia.isRecording(),
    }).toEqual({ live: true, paused: true, recording: true });
  });

  it.each(["ended", "disabled", "muted", "inactive"])(
    "rejects a camera stream that is %s",
    (state) => {
      const { userMedia, videoTrack, media, stream, ready, failed, onAudio } =
        createMediaFixture();
      userMedia.init(stream, ready, onAudio, failed);
      if (state === "ended") {
        videoTrack.readyState = "ended";
      }
      if (state === "disabled") {
        videoTrack.enabled = false;
      }
      if (state === "muted") {
        videoTrack.muted = true;
      }
      if (state === "inactive") {
        media.active = false;
      }

      expect(userMedia.hasLiveStream()).toBe(false);
    },
  );

  it("requires a live microphone when audio is enabled", () => {
    const { userMedia, audioTrack, stream, ready, failed, onAudio } =
      createMediaFixture(true);
    userMedia.init(stream, ready, onAudio, failed);
    audioTrack.readyState = "ended";

    expect(userMedia.hasLiveStream()).toBe(false);
  });

  it("restores video playback without resuming the recorded take", async () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio } =
      createMediaFixture();
    userMedia.init(stream, ready, onAudio, failed);
    userMedia.record();
    userMedia.pause();
    const play = vi.spyOn(videoElement, "play");
    play.mockClear();

    await userMedia.restorePlayback();

    expect({
      plays: play.mock.calls.length,
      paused: userMedia.isPaused(),
    }).toEqual({ plays: 1, paused: true });
  });

  it("removes pending readiness listeners when the stream is stopped", () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio } =
      createMediaFixture();
    userMedia.init(stream, ready, onAudio, failed, { recovering: true });

    userMedia.stop();
    videoElement.dispatchEvent(new Event("playing"));
    videoElement.dispatchEvent(new Event("loadedmetadata"));

    expect(ready).not.toHaveBeenCalled();
  });

  it("reports a rejected preview play promise during recovery", async () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio } =
      createMediaFixture();
    vi.spyOn(videoElement, "play").mockRejectedValue(
      new DOMException("Denied", "NotAllowedError"),
    );

    userMedia.init(stream, ready, onAudio, failed, { recovering: true });

    await vi.waitFor(() => {
      expect({
        ready: ready.mock.calls.length,
        failed: failed.mock.calls.length,
      }).toEqual({ ready: 0, failed: 1 });
    });
  });

  it("reattaches audio processing after recovery while keeping the take paused", async () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio } =
      createMediaFixture(true);
    vi.spyOn(AudioRecorder.prototype, "init").mockResolvedValue();
    vi.spyOn(AudioRecorder.prototype, "resume").mockResolvedValue();
    const record = vi
      .spyOn(AudioRecorder.prototype, "record")
      .mockImplementation(() => undefined);
    userMedia.record();
    userMedia.pause();

    userMedia.init(stream, ready, onAudio, failed, { recovering: true });
    videoElement.dispatchEvent(new Event("playing"));
    videoElement.dispatchEvent(new Event("loadedmetadata"));
    await vi.waitFor(() => {
      expect({
        callback: record.mock.calls[0]?.[0],
        ready: ready.mock.calls.length,
        paused: userMedia.isPaused(),
        recording: userMedia.isRecording(),
      }).toEqual({ callback: onAudio, ready: 1, paused: true, recording: true });
    });
  });

  it("keeps other first-frame listeners when audio processing starts", async () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio, emitter } =
      createMediaFixture(true);
    vi.spyOn(AudioRecorder.prototype, "init").mockResolvedValue();
    vi.spyOn(AudioRecorder.prototype, "record").mockImplementation(() => undefined);
    userMedia.init(stream, ready, onAudio, failed);
    videoElement.dispatchEvent(new Event("playing"));
    videoElement.dispatchEvent(new Event("loadedmetadata"));

    await vi.waitFor(() => {
      if (!ready.mock.calls.length) {
        throw new Error("Expected the camera to be ready before starting audio.");
      }
    });

    const otherFirstFrameListener = vi.fn();
    emitter.on("SENDING_FIRST_FRAME", otherFirstFrameListener);
    emitter.emit("SENDING_FIRST_FRAME");

    expect({
      ready: ready.mock.calls.length,
      otherFirstFrameListeners: otherFirstFrameListener.mock.calls.length,
    }).toEqual({ ready: 1, otherFirstFrameListeners: 1 });
  });

  it("waits for audio initialization before reporting readiness", async () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio } =
      createMediaFixture(true);
    const pending = Promise.withResolvers<undefined>();
    vi.spyOn(AudioRecorder.prototype, "init").mockReturnValue(pending.promise);

    userMedia.init(stream, ready, onAudio, failed);
    videoElement.dispatchEvent(new Event("playing"));
    videoElement.dispatchEvent(new Event("loadedmetadata"));

    const readyBeforeInitialization = ready.mock.calls.length;
    pending.resolve(undefined);

    await vi.waitFor(() => {
      expect({
        before: readyBeforeInitialization,
        after: ready.mock.calls.length,
      }).toEqual({
        before: 0,
        after: 1,
      });
    });
  });

  it("ignores delayed audio initialization after the media has been stopped", async () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio } =
      createMediaFixture(true);
    const pending = Promise.withResolvers<undefined>();
    vi.spyOn(AudioRecorder.prototype, "init").mockReturnValue(pending.promise);
    vi.spyOn(AudioRecorder.prototype, "resume").mockResolvedValue();
    vi.spyOn(AudioRecorder.prototype, "stop").mockResolvedValue(undefined);
    userMedia.record();
    userMedia.pause();
    userMedia.init(stream, ready, onAudio, failed, { recovering: true });
    videoElement.dispatchEvent(new Event("playing"));
    videoElement.dispatchEvent(new Event("loadedmetadata"));

    userMedia.stop();
    pending.resolve(undefined);
    await pending.promise;

    expect(ready).not.toHaveBeenCalled();
  });

  it("reports asynchronous audio initialization failures and stops the stream", async () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio, videoTrack } =
      createMediaFixture(true);
    const error = new Error("Audio worklet could not load");
    vi.spyOn(AudioRecorder.prototype, "init").mockRejectedValue(error);

    userMedia.init(stream, ready, onAudio, failed);
    videoElement.dispatchEvent(new Event("playing"));
    videoElement.dispatchEvent(new Event("loadedmetadata"));

    await vi.waitFor(() => {
      expect({
        failures: failed.mock.calls,
        ready: ready.mock.calls.length,
        stops: videoTrack.stop.mock.calls.length,
      }).toEqual({ failures: [[error]], ready: 0, stops: 1 });
    });
  });

  it("ignores a rejected audio initializer after the stream was stopped", async () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio } =
      createMediaFixture(true);
    const pending = Promise.withResolvers<undefined>();
    vi.spyOn(AudioRecorder.prototype, "init").mockReturnValue(pending.promise);
    userMedia.init(stream, ready, onAudio, failed);
    videoElement.dispatchEvent(new Event("playing"));
    videoElement.dispatchEvent(new Event("loadedmetadata"));

    userMedia.stop();
    pending.reject(new Error("cancelled module load"));
    await pending.promise.catch(() => undefined);

    expect({ ready: ready.mock.calls.length, failed: failed.mock.calls.length }).toEqual({
      ready: 0,
      failed: 0,
    });
  });

  it("does not stop a replacement stream when its old audio initializer rejects", async () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio } =
      createMediaFixture(true);
    const replacementStream = createMediaFixture(true).stream;
    const pending = Promise.withResolvers<undefined>();
    vi.spyOn(AudioRecorder.prototype, "init")
      .mockReturnValueOnce(pending.promise)
      .mockResolvedValue();
    userMedia.init(stream, ready, onAudio, failed);
    videoElement.dispatchEvent(new Event("playing"));
    videoElement.dispatchEvent(new Event("loadedmetadata"));
    userMedia.init(replacementStream, ready, onAudio, failed);
    videoElement.dispatchEvent(new Event("playing"));
    videoElement.dispatchEvent(new Event("loadedmetadata"));
    pending.reject(new Error("old module failed"));
    await pending.promise.catch(() => undefined);

    await vi.waitFor(() => {
      expect({
        ready: ready.mock.calls.length,
        failed: failed.mock.calls.length,
        live: userMedia.hasLiveStream(),
      }).toEqual({ ready: 1, failed: 0, live: true });
    });
  });

  it("waits for both audio initialization and context recovery", async () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio } =
      createMediaFixture(true);
    const initializing = Promise.withResolvers<undefined>();
    const resuming = Promise.withResolvers<undefined>();
    vi.spyOn(AudioRecorder.prototype, "init").mockReturnValue(initializing.promise);
    const resume = vi
      .spyOn(AudioRecorder.prototype, "resume")
      .mockReturnValue(resuming.promise);

    userMedia.init(stream, ready, onAudio, failed, { recovering: true });
    videoElement.dispatchEvent(new Event("playing"));
    videoElement.dispatchEvent(new Event("loadedmetadata"));
    const resumesBeforeInitialization = resume.mock.calls.length;
    initializing.resolve(undefined);
    await initializing.promise;
    const readyBeforeResume = ready.mock.calls.length;
    resuming.resolve(undefined);

    await vi.waitFor(() => {
      expect({
        resumesBeforeInitialization,
        resumes: resume.mock.calls.length,
        readyBeforeResume,
        ready: ready.mock.calls.length,
      }).toEqual({
        resumesBeforeInitialization: 0,
        resumes: 1,
        readyBeforeResume: 0,
        ready: 1,
      });
    });
  });

  it("preserves a paused take when audio context recovery fails", async () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio } =
      createMediaFixture(true);
    const error = new Error("Audio context could not resume");
    vi.spyOn(AudioRecorder.prototype, "init").mockResolvedValue();
    vi.spyOn(AudioRecorder.prototype, "resume").mockRejectedValue(error);
    userMedia.record();
    userMedia.pause();

    userMedia.init(stream, ready, onAudio, failed, { recovering: true });
    videoElement.dispatchEvent(new Event("playing"));
    videoElement.dispatchEvent(new Event("loadedmetadata"));

    await vi.waitFor(() => {
      expect({
        failures: failed.mock.calls,
        ready: ready.mock.calls.length,
        recording: userMedia.isRecording(),
        paused: userMedia.isPaused(),
      }).toEqual({ failures: [[error]], ready: 0, recording: true, paused: true });
    });
  });

  it("updates audio-thread capture state on record, pause, and resume", () => {
    const { userMedia, stream, ready, failed, onAudio } = createMediaFixture(true);
    const states: boolean[][] = [];
    vi.spyOn(AudioRecorder.prototype, "updateRecordingState").mockImplementation(() => {
      states.push([userMedia.isRecording(), userMedia.isPaused()]);
    });
    userMedia.init(stream, ready, onAudio, failed);

    userMedia.record();
    userMedia.pause();
    userMedia.resume();

    expect(states).toEqual([
      [true, false],
      [true, true],
      [true, false],
    ]);
  });

  it("waits for metadata before validating initially unknown dimensions", () => {
    const videoElement = document.createElement("video");
    const videoTrack = {
      enabled: true,
      getCapabilities: () => ({ frameRate: { max: 30, min: 1 } }),
      kind: "video",
      label: "Built-in Camera",
      muted: false,
      readyState: "live",
    } as unknown as MediaStreamTrack;
    const stream = {
      active: true,
      getVideoTracks: () => [videoTrack],
    } as unknown as MediaStream;
    const recorder = {
      getRawVisualUserMedia: () => videoElement,
    } as unknown as Recorder;
    const userMedia = new UserMedia(recorder, mergeWithDefaultOptions());
    const readyCallback = vi.fn();
    const endedEarlyCallback = vi.fn();

    vi.spyOn(videoElement, "load").mockImplementation(() => undefined);
    vi.spyOn(videoElement, "play").mockResolvedValue();

    userMedia.init(stream, readyCallback, vi.fn(), endedEarlyCallback);

    videoElement.dispatchEvent(new Event("playing"));

    Object.defineProperties(videoElement, {
      videoWidth: { configurable: true, value: 320 },
      videoHeight: { configurable: true, value: 240 },
    });
    videoElement.dispatchEvent(new Event("loadedmetadata"));

    expect([endedEarlyCallback.mock.calls, readyCallback.mock.calls]).toEqual([[], [[]]]);
  });
});
