import { VideoTypes } from "../../../types/VideoTypes";

function canPlayType(video: HTMLVideoElement, type: VideoTypes) {
  const canPlayType = video.canPlayType(`video/${type}`);

  // definitely cannot be played here
  if (canPlayType === "") {
    return false;
  }

  return canPlayType;
}

export default canPlayType;
