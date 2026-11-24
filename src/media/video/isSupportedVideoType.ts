import { VideoType, VideoTypeType } from "../../types/VideoType";

// Videomail only serves MP4 and WebM videos.
function isSupportedVideoType(
  videoType: VideoTypeType | undefined,
): videoType is VideoTypeType {
  return videoType === VideoType.WebM || videoType === VideoType.MP4;
}

export default isSupportedVideoType;
