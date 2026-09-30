import type { Videomail } from "../../../types/Videomail";
import mergeWithDefaultOptions from "../../../util/options/mergeWithDefaultOptions";
import type Visuals from "../../visuals";
import Replay from "../replay";

let loadMock: ReturnType<typeof vi.spyOn>;

function createFixture() {
  const parent = document.createElement("div");
  const visualsElement = document.createElement("div");
  parent.appendChild(visualsElement);
  const visuals = {
    getElement: () => visualsElement,
    isHidden: vi.fn(() => false),
    show: vi.fn(),
  } as unknown as Visuals;
  const replay = new Replay(visuals, mergeWithDefaultOptions());

  return { parent, replay, visuals, visualsElement };
}

describe("Replay", () => {
  beforeEach(() => {
    loadMock = vi
      .spyOn(HTMLMediaElement.prototype, "load")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    loadMock.mockRestore();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("builds a hidden replay video", () => {
    const { replay, visualsElement } = createFixture();

    replay.build(visualsElement);

    expect(visualsElement.querySelector<HTMLVideoElement>("video.replay")).toMatchObject({
      style: expect.objectContaining({ display: "none" }),
    });
  });

  it("sets inline playback attributes", () => {
    const { replay, visualsElement } = createFixture();
    replay.build(visualsElement);

    expect(replay.getElement()?.getAttribute("playsinline")).toBe("true");
  });

  it("adds an MP4 source", () => {
    const { replay, visualsElement } = createFixture();
    replay.build(visualsElement);

    replay.setMp4Source("https://example.test/video.mp4");

    expect(replay.getVideoSource("mp4")?.getAttribute("type")).toBe("video/mp4");
  });

  it("adds the iOS thumbnail time fragment to a new source", () => {
    const { replay, visualsElement } = createFixture();
    replay.build(visualsElement);

    replay.setWebMSource("https://example.test/video.webm");

    expect(replay.getVideoSource("webm")?.src).toMatch(
      /^https:\/\/example\.test\/video\.webm#t=/u,
    );
  });

  it("removes an existing source when its URL is cleared", () => {
    const { replay, visualsElement } = createFixture();
    replay.build(visualsElement);
    replay.setMp4Source("https://example.test/video.mp4");

    replay.setMp4Source(undefined);

    expect(replay.getVideoSource("mp4")).toBeUndefined();
  });

  it("copies videomail attributes into matching containers", () => {
    const { replay, visualsElement } = createFixture();
    const subject = document.createElement("p");
    subject.className = "subject";
    visualsElement.appendChild(subject);
    replay.build(visualsElement);

    replay.setVideomail({ subject: "Hello in Sign Language" } as Videomail);

    expect(subject.textContent).toBe("Hello in Sign Language");
  });

  it("adds captions from a videomail", () => {
    const { replay, visualsElement } = createFixture();
    replay.build(visualsElement);

    replay.setVideomail({ vtt: "https://example.test/captions.vtt" } as Videomail);

    expect(replay.getElement()?.querySelector("track")?.kind).toBe("captions");
  });

  it("mutes a preview without audio", () => {
    const { replay, visualsElement } = createFixture();
    replay.build(visualsElement);

    replay.show(undefined, undefined, false);

    expect(replay.getElement()?.getAttribute("muted")).toBe("true");
  });

  it("reports a shown preview", () => {
    const { replay, visualsElement } = createFixture();
    replay.build(visualsElement);

    replay.show(undefined, undefined);

    expect(replay.isShown()).toBe(true);
  });

  it("emits PREVIEW_SHOWN when preview media can play", () => {
    const { replay, visualsElement } = createFixture();
    const listener = vi.fn();
    replay.on("PREVIEW_SHOWN", listener);
    replay.build(visualsElement);
    replay.show(undefined, undefined);

    replay.getElement()?.dispatchEvent(new Event("canplaythrough"));

    expect(listener).toHaveBeenCalledOnce();
  });

  it("emits REPLAY_SHOWN when videomail media can play", () => {
    const { replay, visualsElement } = createFixture();
    const listener = vi.fn();
    replay.on("REPLAY_SHOWN", listener);
    replay.build(visualsElement);
    replay.setVideomail({ poster: "https://example.test/poster.jpg" } as Videomail);

    replay.getElement()?.dispatchEvent(new Event("canplaythrough"));

    expect(listener).toHaveBeenCalledOnce();
  });

  it("hides the replay video", () => {
    const { replay, visualsElement } = createFixture();
    replay.build(visualsElement);
    replay.show(undefined, undefined);

    replay.hide();

    expect(replay.isShown()).toBe(false);
  });

  it("clears video sources when reset", () => {
    vi.useFakeTimers();
    const { replay, visualsElement } = createFixture();
    replay.build(visualsElement);
    replay.setMp4Source("https://example.test/video.mp4");

    replay.reset();
    vi.advanceTimersByTime(15);

    expect(replay.getVideoSource("mp4")).toBeUndefined();
  });

  it("removes the replay video when unloaded", () => {
    const { replay, visualsElement } = createFixture();
    replay.build(visualsElement);

    replay.unload();

    expect(replay.getElement()).toBeUndefined();
  });

  it("returns its visuals owner", () => {
    const { replay, visuals } = createFixture();

    expect(replay.getVisuals()).toBe(visuals);
  });
});
