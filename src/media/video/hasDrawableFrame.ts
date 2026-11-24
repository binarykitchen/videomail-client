// The video has decoded a frame with real dimensions, so drawImage() has pixels to copy.
function hasDrawableFrame(video: HTMLVideoElement) {
  return (
    video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
    video.videoWidth > 0 &&
    video.videoHeight > 0
  );
}
export default hasDrawableFrame;
