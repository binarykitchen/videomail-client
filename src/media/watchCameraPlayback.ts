import isPreviewVisible from "./isPreviewVisible";

const CHECK_INTERVAL_MS = 1000;
const STALL_TIMEOUT_MS = 3000;

function watchCameraPlayback(video: HTMLVideoElement, onStalled: () => void) {
  let lastProgressAt = performance.now();
  let lastCheckAt = lastProgressAt;
  let lastMediaTime = video.currentTime;
  let frameRequest: number | undefined;

  const canWatchFrames = typeof video.requestVideoFrameCallback === "function";

  function requestFrame() {
    if (canWatchFrames && frameRequest === undefined) {
      // Sample actual frames once per check, rather than adding work to every frame.
      frameRequest = video.requestVideoFrameCallback(() => {
        frameRequest = undefined;
        lastProgressAt = performance.now();
      });
    }
  }

  function stop() {
    window.clearInterval(interval);
    if (frameRequest !== undefined) {
      video.cancelVideoFrameCallback(frameRequest);
      frameRequest = undefined;
    }
  }

  function check() {
    const now = performance.now();
    const mediaTime = video.currentTime;
    const wasSuspended = now - lastCheckAt > CHECK_INTERVAL_MS * 2;

    lastCheckAt = now;

    if (wasSuspended || !isPreviewVisible(video)) {
      // iOS can suspend JavaScript too, leaving no background timer ticks to observe.
      lastProgressAt = now;
      lastMediaTime = mediaTime;
      return;
    }

    if (!canWatchFrames && mediaTime !== lastMediaTime) {
      lastProgressAt = now;
    }

    lastMediaTime = mediaTime;

    if (now - lastProgressAt >= STALL_TIMEOUT_MS) {
      stop();
      onStalled();
      return;
    }

    requestFrame();
  }

  const interval = window.setInterval(check, CHECK_INTERVAL_MS);
  requestFrame();

  return stop;
}

export default watchCameraPlayback;
