import { VideoExtensionType } from "../../../types/VideoExtension";

function canPlayType(video: HTMLVideoElement, type: VideoExtensionType) {
  const canPlayType = video.canPlayType(`video/${type}`);

  // definitely cannot be played here
  if (canPlayType === "") {
    return false;
  }

  return canPlayType;
}

export default canPlayType;
