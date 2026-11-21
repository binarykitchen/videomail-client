function startCanvasCameraPreview(
  video: HTMLVideoElement,
  warn: (message: string) => void,
) {
  if (
    typeof video.requestVideoFrameCallback !== "function" ||
    typeof video.cancelVideoFrameCallback !== "function"
  ) {
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

    const { videoWidth, videoHeight, readyState } = video;
    if (readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && videoWidth && videoHeight) {
      if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
        canvas.width = videoWidth;
        canvas.height = videoHeight;
      }

      try {
        context.drawImage(video, 0, 0, videoWidth, videoHeight);
      } catch (error) {
        stop();
        warn(`Canvas camera preview failed; using the native preview: ${String(error)}`);
        return;
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
