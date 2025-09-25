export const VideoType = {
  WebM: "webm",
  MP4: "mp4",
} as const;

export type VideoTypeValue = (typeof VideoType)[keyof typeof VideoType];
