import { VideoType } from "../../../types/VideoType";

function canPlayType(video: HTMLVideoElement, type: VideoType) {
  const canPlayType = video.canPlayType(`video/${type}`);

  // definitely cannot be played here
  if (canPlayType === "") {
    return false;
  }

  return canPlayType;
}

export default canPlayType;
