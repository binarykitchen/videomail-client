const VIRTUAL_KEYWORDS = ["obs", "virtual", "manycam", "vcam", "splitcam", "droidcam"];

/*
 * Checks if a video track is likely from a virtual camera based on its label.
 * Returns true if the label contains any known virtual camera keywords.
 *
 * In this check, do not check capabilities. Because missing frame-rate capabilities or an unavailable `getCapabilities()` API do not classify a camera as virtual.
 */
function isVirtualCamera(videoTrack: Pick<MediaStreamTrack, "label">) {
  return VIRTUAL_KEYWORDS.some((keyword) =>
    videoTrack.label.toLowerCase().includes(keyword),
  );
}

export default isVirtualCamera;
