// The player still holds a video source, preview <source> children or a preview stream.
function hasMediaToUnload(
  video: HTMLVideoElement,
  sources: ArrayLike<HTMLSourceElement>,
  discardPreview: boolean,
) {
  return (
    video.hasAttribute("src") ||
    sources.length > 0 ||
    (discardPreview && Boolean(video.currentSrc))
  );
}

export default hasMediaToUnload;
