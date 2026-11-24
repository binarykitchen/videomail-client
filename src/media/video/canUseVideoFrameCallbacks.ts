// Frame callbacks report each painted camera frame. Anything requesting them must cancel them, too.
function canUseVideoFrameCallbacks(video: HTMLVideoElement) {
  return (
    typeof video.requestVideoFrameCallback === "function" &&
    typeof video.cancelVideoFrameCallback === "function"
  );
}

export default canUseVideoFrameCallbacks;
