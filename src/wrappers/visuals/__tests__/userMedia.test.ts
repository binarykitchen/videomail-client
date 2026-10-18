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
    vi.spyOn(AudioRecorder.prototype, "init").mockImplementation(() => undefined);
    vi.spyOn(AudioRecorder.prototype, "resume").mockResolvedValue();
    const record = vi
      .spyOn(AudioRecorder.prototype, "record")
      .mockImplementation(() => undefined);
    userMedia.record();
    userMedia.pause();

    userMedia.init(stream, ready, onAudio, failed, { recovering: true });
    videoElement.dispatchEvent(new Event("play"));
    videoElement.dispatchEvent(new Event("loadedmetadata"));
    await Promise.resolve();

    expect({
      callback: record.mock.calls[0]?.[0],
      ready: ready.mock.calls.length,
      paused: userMedia.isPaused(),
      recording: userMedia.isRecording(),
    }).toEqual({ callback: onAudio, ready: 1, paused: true, recording: true });
  });

  it("ignores delayed audio initialization after the media has been stopped", async () => {
    const { userMedia, videoElement, stream, ready, failed, onAudio } =
      createMediaFixture(true);
    const pending = Promise.withResolvers<undefined>();
    vi.spyOn(AudioRecorder.prototype, "init").mockImplementation(() => undefined);
    vi.spyOn(AudioRecorder.prototype, "resume").mockReturnValue(pending.promise);
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
