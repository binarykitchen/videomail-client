import mergeWithDefaultOptions from "../../../util/options/mergeWithDefaultOptions";
import type Recorder from "../recorder";
import UserMedia from "../userMedia";

vi.mock("../../../util/error/createError", () => ({
  default: ({ message }: { message: string }) => new Error(message),
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
});
