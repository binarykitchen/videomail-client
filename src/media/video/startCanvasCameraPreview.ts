import isDOMExceptionNamed from "../../util/error/isDOMExceptionNamed";
import hasDrawableFrame from "./hasDrawableFrame";

const PREVIEW_DRAW_INTERVAL_MS = 1000 / 30;

function startCanvasCameraPreview(
  video: HTMLVideoElement,
  warn: (message: string) => void,
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    warn("Unable to create a canvas camera preview; using the native preview.");
    return;
  }

  let frameRequest: number | undefined;
  let nextDrawAt = 0;
  let hasReportedMissingFrame = false;

  function stop() {
    if (frameRequest === undefined) {
      return;
    }

    window.cancelAnimationFrame(frameRequest);
    frameRequest = undefined;
    video.classList.remove("cameraPreviewSource");
    canvas.remove();
    canvas.width = canvas.height = 0;
  }

  function shouldDrawFrame(now: number) {
    return !document.hidden && now >= nextDrawAt && hasDrawableFrame(video);
  }

  // Keep painting independently of WebKit's native video presentation after a handoff.
  const drawFrame = (now: number) => {
    if (frameRequest === undefined) {
      return;
    }

    frameRequest = window.requestAnimationFrame(drawFrame);
    if (!shouldDrawFrame(now)) {
      return;
    }
    nextDrawAt = now + PREVIEW_DRAW_INTERVAL_MS;

    const { videoWidth, videoHeight } = video;
    if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
      canvas.width = videoWidth;
      canvas.height = videoHeight;
    }

    try {
      context.drawImage(video, 0, 0, videoWidth, videoHeight);
      hasReportedMissingFrame = false;
    } catch (error) {
      if (!isDOMExceptionNamed(error, "InvalidStateError")) {
        stop();
        warn(`Canvas camera preview failed; using the native preview: ${String(error)}`);
        return;
      }

      // Cameras may need several frames before pixels are ready. Do not uncover the bad layer.
      if (!hasReportedMissingFrame) {
        warn("⚠️ Canvas camera preview is waiting for drawable frames.");
        hasReportedMissingFrame = true;
      }
    }
  };

  // Keep the source video laid out and playing, but never present its native picture.
  canvas.className = "cameraPreviewCanvas";
  canvas.setAttribute("aria-hidden", "true");
  video.classList.add("cameraPreviewSource");
  video.after(canvas);
  frameRequest = window.requestAnimationFrame(drawFrame);
  return stop;
}

export default startCanvasCameraPreview;
