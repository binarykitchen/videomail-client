const VIRTUAL_KEYWORDS = ["obs", "virtual", "manycam", "vcam", "splitcam", "droidcam"];

function isVirtualCamera(videoTrack: MediaStreamTrack) {
  const capabilities = videoTrack.getCapabilities();

  // Real webcams usually have a range of frame rates or specific hardware controls
  if (!capabilities.frameRate) {
    return true;
  }

  return VIRTUAL_KEYWORDS.some((keyword) =>
    videoTrack.label.toLowerCase().includes(keyword),
  );
}

export default isVirtualCamera;
