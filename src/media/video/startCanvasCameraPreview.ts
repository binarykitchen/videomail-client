import isDOMExceptionNamed from "../../util/error/isDOMExceptionNamed";
import canUseVideoFrameCallbacks from "./canUseVideoFrameCallbacks";
import hasDrawableFrame from "./hasDrawableFrame";

function startCanvasCameraPreview(
  video: HTMLVideoElement,
  warn: (message: string) => void,
) {
  if (!canUseVideoFrameCallbacks(video)) {
    warn("Video frame callbacks are unavailable; using the native camera preview.");
    return;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    warn("Unable to create a canvas camera preview; using the native preview.");
    return;
  }

  let frameRequest: number | undefined;
  let hasRetriedMissingFrame = false;
  function stop() {
    if (frameRequest === undefined) {
      return;
    }

    video.cancelVideoFrameCallback(frameRequest);
    frameRequest = undefined;
    canvas.remove();
    canvas.width = canvas.height = 0;
  }

  const drawFrame = () => {
    if (frameRequest === undefined) {
      return;
    }

    if (hasDrawableFrame(video)) {
      const { videoWidth, videoHeight } = video;

      if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
        canvas.width = videoWidth;
        canvas.height = videoHeight;
      }

      try {
        context.drawImage(video, 0, 0, videoWidth, videoHeight);
        hasRetriedMissingFrame = false;
      } catch (error) {
        // The first frame of a replacement stream may not have drawable pixels yet.
        if (hasRetriedMissingFrame || !isDOMExceptionNamed(error, "InvalidStateError")) {
          stop();
          warn(
            `Canvas camera preview failed; using the native preview: ${String(error)}`,
          );
          return;
        }

        hasRetriedMissingFrame = true;
      }
    }
    frameRequest = video.requestVideoFrameCallback(drawFrame);
  };

  // Cover the native video before its first frame without hiding or replacing it.
  canvas.className = "cameraPreviewCanvas";
  canvas.setAttribute("aria-hidden", "true");
  video.after(canvas);
  frameRequest = video.requestVideoFrameCallback(drawFrame);
  return stop;
}

export default startCanvasCameraPreview;
