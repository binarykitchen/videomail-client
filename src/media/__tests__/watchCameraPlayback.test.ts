import watchCameraPlayback from "../watchCameraPlayback";

function createFixture(withFrameCallbacks = true) {
  const video = document.createElement("video");

  video.srcObject = new Blob();
  document.body.appendChild(video);
  vi.spyOn(video, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 320, 240));

  const callbacks = new Map<number, VideoFrameRequestCallback>();

  let nextRequest = 0;

  const request = vi.fn<HTMLVideoElement["requestVideoFrameCallback"]>((callback) => {
    const handle = ++nextRequest;
    callbacks.set(handle, callback);
    return handle;
  });

  const cancel = vi.fn<HTMLVideoElement["cancelVideoFrameCallback"]>((handle) => {
    callbacks.delete(handle);
  });

  Object.defineProperties(video, {
    requestVideoFrameCallback: {
      value: withFrameCallbacks ? request : undefined,
    },
    cancelVideoFrameCallback: { value: cancel },
  });

  const stalled = vi.fn();

  function presentFrame() {
    for (const [handle, callback] of callbacks) {
      callbacks.delete(handle);
      callback(performance.now(), {
        presentationTime: performance.now(),
        expectedDisplayTime: performance.now(),
        width: 320,
        height: 240,
        mediaTime: video.currentTime,
        presentedFrames: 1,
      });
    }
  }

  return { video, request, cancel, stalled, presentFrame };
}

describe("watchCameraPlayback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("allows a stall shorter than three seconds", () => {
    const { video, stalled } = createFixture();
    watchCameraPlayback(video, stalled);

    vi.advanceTimersByTime(2999);

    expect(stalled).not.toHaveBeenCalled();
  });

  it("reports a three-second frame stall exactly once", () => {
    const { video, stalled } = createFixture();
    watchCameraPlayback(video, stalled);

    vi.advanceTimersByTime(10_000);

    expect(stalled).toHaveBeenCalledExactlyOnceWith();
  });

  it("keeps a camera healthy while new frames arrive", () => {
    const { video, stalled, presentFrame } = createFixture();
    watchCameraPlayback(video, stalled);

    for (let second = 0; second < 10; second++) {
      presentFrame();
      vi.advanceTimersByTime(1000);
    }

    expect(stalled).not.toHaveBeenCalled();
  });

  it("does not mistake an advancing media clock for new frames", () => {
    const { video, stalled } = createFixture();
    watchCameraPlayback(video, stalled);

    for (let second = 1; second <= 3; second++) {
      video.currentTime = second;
      vi.advanceTimersByTime(1000);
    }

    expect(stalled).toHaveBeenCalledExactlyOnceWith();
  });

  it("samples at most one frame callback per check", () => {
    const { video, stalled, presentFrame, request } = createFixture();
    watchCameraPlayback(video, stalled);
    presentFrame();

    vi.advanceTimersByTime(999);

    expect(request).toHaveBeenCalledTimes(1);
  });

  it("uses the media clock when frame callbacks are unavailable", () => {
    const { video, stalled } = createFixture(false);
    watchCameraPlayback(video, stalled);

    for (let second = 1; second <= 10; second++) {
      video.currentTime = second;
      vi.advanceTimersByTime(1000);
    }

    expect(stalled).not.toHaveBeenCalled();
  });

  it("also detects a stopped media clock without frame callbacks", () => {
    const { video, stalled } = createFixture(false);
    watchCameraPlayback(video, stalled);

    vi.advanceTimersByTime(3000);

    expect(stalled).toHaveBeenCalledExactlyOnceWith();
  });

  it("does not recover while the document is backgrounded", () => {
    const { video, stalled } = createFixture();
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    watchCameraPlayback(video, stalled);

    vi.advanceTimersByTime(10_000);

    expect(stalled).not.toHaveBeenCalled();
  });

  it("gives playback a fresh deadline after foregrounding", () => {
    const { video, stalled } = createFixture();
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    watchCameraPlayback(video, stalled);
    vi.advanceTimersByTime(10_000);

    hidden.mockReturnValue(false);
    vi.advanceTimersByTime(2000);

    expect(stalled).not.toHaveBeenCalled();
  });

  it("allows recovery time when iOS resumes suspended JavaScript timers", () => {
    const { video, stalled } = createFixture();
    const now = vi.spyOn(performance, "now").mockReturnValue(0);
    watchCameraPlayback(video, stalled);

    now.mockReturnValue(60_000);
    vi.advanceTimersByTime(1000);

    expect(stalled).not.toHaveBeenCalled();
  });

  it.each(["offscreen", "hidden", "detached", "no stream"])(
    "does not restart a preview that is %s",
    (state) => {
      const { video, stalled } = createFixture();
      if (state === "offscreen") {
        vi.spyOn(video, "getBoundingClientRect").mockReturnValue(
          new DOMRect(0, window.innerHeight + 1, 320, 240),
        );
      }
      if (state === "hidden") {
        vi.spyOn(video, "getBoundingClientRect").mockReturnValue(new DOMRect());
      }
      if (state === "detached") {
        video.remove();
      }
      if (state === "no stream") {
        video.srcObject = null;
      }
      watchCameraPlayback(video, stalled);

      vi.advanceTimersByTime(10_000);

      expect(stalled).not.toHaveBeenCalled();
    },
  );

  it("stops timers and pending frame callbacks when disposed", () => {
    const { video, stalled, cancel } = createFixture();
    const stop = watchCameraPlayback(video, stalled);

    stop();
    vi.advanceTimersByTime(10_000);

    expect({
      errors: stalled.mock.calls.length,
      cancellations: cancel.mock.calls,
      timers: vi.getTimerCount(),
    }).toEqual({ errors: 0, cancellations: [[1]], timers: 0 });
  });
});
