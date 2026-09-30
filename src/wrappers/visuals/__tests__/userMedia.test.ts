import AudioRecorder from "../../../media/AudioRecorder";
import mergeWithDefaultOptions from "../../../util/options/mergeWithDefaultOptions";
import type Recorder from "../recorder";
import UserMedia from "../userMedia";

vi.mock("../../../util/error/createError", () => ({
  default: ({ message }: { message: string }) => new Error(message),
}));
vi.mock("../../../media/AudioRecorder", () => ({
  default: class {
    public init() {
      return Promise.resolve();
    }

    public stop() {}

    public record() {}
  },
}));

describe("UserMedia", () => {
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

  it("stops the previous stream after switching camera", () => {
    const videoElement = document.createElement("video");
    const userMedia = new UserMedia(
      { getRawVisualUserMedia: () => videoElement } as Recorder,
      mergeWithDefaultOptions(),
    );
    const state = userMedia as unknown as {
      setVisualStream: (stream: MediaStream) => void;
    };
    const stopTrack = vi.fn();
    const firstStream = {
      getTracks: () => [{ stop: stopTrack }],
    } as unknown as MediaStream;
    const secondStream = { getTracks: () => [] } as unknown as MediaStream;

    state.setVisualStream(firstStream);
    state.setVisualStream(secondStream);

    expect({
      current: videoElement.srcObject,
      stopped: stopTrack.mock.calls.length,
    }).toEqual({
      current: secondStream,
      stopped: 1,
    });
  });

  it.each([
    [false, 1],
    [true, 0],
  ])(
    "waits for audio setup before reporting camera ready (stopped: %s)",
    async (stopped, readyCount) => {
      const videoElement = document.createElement("video");
      const videoTrack = {
        enabled: true,
        getCapabilities: () => ({ frameRate: { max: 30, min: 1 } }),
        kind: "video",
        label: "Camera",
        muted: false,
      } as MediaStreamTrack;
      const stream = {
        active: true,
        getTracks: () => [{ stop: vi.fn() }],
        getVideoTracks: () => [videoTrack],
      } as unknown as MediaStream;
      let finishAudio: () => void = () => undefined;
      vi.spyOn(AudioRecorder.prototype, "init").mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            finishAudio = resolve;
          }),
      );
      const userMedia = new UserMedia(
        { getRawVisualUserMedia: () => videoElement } as Recorder,
        mergeWithDefaultOptions({ audio: { enabled: true } }),
      );
      const ready = vi.fn();
      vi.spyOn(videoElement, "load").mockImplementation(() => undefined);
      vi.spyOn(videoElement, "play").mockResolvedValue();

      userMedia.init(stream, ready, vi.fn(), vi.fn());
      videoElement.dispatchEvent(new Event("play"));
      videoElement.dispatchEvent(new Event("loadedmetadata"));
      const before = ready.mock.calls.length;
      if (stopped) {
        userMedia.stop();
      }
      finishAudio();
      await Promise.resolve();

      expect({ before, after: ready.mock.calls.length }).toEqual({
        before: 0,
        after: readyCount,
      });
    },
  );
});
