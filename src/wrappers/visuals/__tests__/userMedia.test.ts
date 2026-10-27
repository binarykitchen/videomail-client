import AudioRecorder from "../../../util/html/media/AudioRecorder";
import mergeWithDefaultOptions from "../../../util/options/mergeWithDefaultOptions";
import type Recorder from "../recorder";
import UserMedia from "../userMedia";

vi.mock("../../../util/error/createError", () => ({
  default: ({ message }: { message: string }) => new Error(message),
}));

function createMediaFixture(audio = false) {
  const videoElement = document.createElement("video");
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
  const recorder = { getRawVisualUserMedia: () => videoElement } as Recorder;
  const userMedia = new UserMedia(
    recorder,
    mergeWithDefaultOptions({ audio: { enabled: audio } }),
  );
  vi.spyOn(videoElement, "load").mockImplementation(() => undefined);
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
    videoTrack,
    audioTrack,
    media,
    stream,
    ready,
    failed,
    onAudio,
  };
}

describe("UserMedia", () => {
  afterEach(() => {
    vi.restoreAllMocks();
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
    videoElement.dispatchEvent(new Event("play"));
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
    videoElement.dispatchEvent(new Event("play"));
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

  it("waits for audio initialization before reporting readiness", async () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio } =
      createMediaFixture(true);
    const pending = Promise.withResolvers<undefined>();
    vi.spyOn(AudioRecorder.prototype, "init").mockReturnValue(pending.promise);

    userMedia.init(stream, ready, onAudio, failed);
    videoElement.dispatchEvent(new Event("play"));
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
    vi.spyOn(AudioRecorder.prototype, "stop").mockImplementation(() => undefined);
    userMedia.record();
    userMedia.pause();
    userMedia.init(stream, ready, onAudio, failed, { recovering: true });
    videoElement.dispatchEvent(new Event("play"));
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
    videoElement.dispatchEvent(new Event("play"));
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
    videoElement.dispatchEvent(new Event("play"));
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
    videoElement.dispatchEvent(new Event("play"));
    videoElement.dispatchEvent(new Event("loadedmetadata"));
    userMedia.init(replacementStream, ready, onAudio, failed);
    videoElement.dispatchEvent(new Event("play"));
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
    videoElement.dispatchEvent(new Event("play"));
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
    videoElement.dispatchEvent(new Event("play"));
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
    } as Recorder;
    const userMedia = new UserMedia(recorder, mergeWithDefaultOptions());
    const readyCallback = vi.fn();
    const endedEarlyCallback = vi.fn();

    vi.spyOn(videoElement, "load").mockImplementation(() => undefined);
    vi.spyOn(videoElement, "play").mockResolvedValue();

    userMedia.init(stream, readyCallback, vi.fn(), endedEarlyCallback);

    videoElement.dispatchEvent(new Event("play"));

    Object.defineProperties(videoElement, {
      videoWidth: { configurable: true, value: 320 },
      videoHeight: { configurable: true, value: 240 },
    });
    videoElement.dispatchEvent(new Event("loadedmetadata"));

    expect([endedEarlyCallback.mock.calls, readyCallback.mock.calls]).toEqual([[], [[]]]);
  });
});
