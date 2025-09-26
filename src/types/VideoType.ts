export const VideoType = {
  WebM: "webm",
  MP4: "mp4",
} as const;

export type VideoTypeType = (typeof VideoType)[keyof typeof VideoType];
