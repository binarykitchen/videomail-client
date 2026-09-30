import MEDIA_EVENTS from "../mediaEvents";

describe("mediaEvents", () => {
  it("lists the media lifecycle events monitored by user media", () => {
    expect(MEDIA_EVENTS).toEqual([
      "loadstart",
      "suspend",
      "progress",
      "abort",
      "emptied",
      "stalled",
      "pause",
      "loadeddata",
      "waiting",
      "playing",
      "canplay",
      "canplaythrough",
      "seeking",
      "seeked",
      "ended",
      "ratechange",
      "durationchange",
      "volumechange",
    ]);
  });
});
