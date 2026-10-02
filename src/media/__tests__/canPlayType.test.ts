import { VideoType } from "../../types/VideoType";
import canPlayType from "../canPlayType";

describe("canPlayType", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false when the browser cannot play the video type", () => {
    const video = document.createElement("video");
    vi.spyOn(video, "canPlayType").mockReturnValue("");

    expect(canPlayType(video, VideoType.WebM)).toBe(false);
  });

  it.each(["maybe", "probably"] as const)(
    "returns the browser confidence value %s",
    (confidence) => {
      const video = document.createElement("video");
      vi.spyOn(video, "canPlayType").mockReturnValue(confidence);

      expect(canPlayType(video, VideoType.MP4)).toBe(confidence);
    },
  );

  it("asks the browser about the requested MIME type", () => {
    const video = document.createElement("video");
    const canPlay = vi.spyOn(video, "canPlayType").mockReturnValue("maybe");

    canPlayType(video, VideoType.WebM);

    expect(canPlay).toHaveBeenCalledWith("video/webm");
  });
});
