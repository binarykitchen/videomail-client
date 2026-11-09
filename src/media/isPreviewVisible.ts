function isPreviewVisible(video: HTMLVideoElement) {
  if (document.hidden || !video.isConnected || !video.srcObject) {
    return false;
  }

  const bounds = video.getBoundingClientRect();

  return (
    bounds.width > 0 &&
    bounds.height > 0 &&
    bounds.bottom > 0 &&
    bounds.right > 0 &&
    bounds.top < window.innerHeight &&
    bounds.left < window.innerWidth
  );
}

export default isPreviewVisible;
