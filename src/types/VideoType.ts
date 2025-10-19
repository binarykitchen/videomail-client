// TODO This isn't actually a type and should be moved elsewhere
export const VideoType = {
  WebM: "webm",
  MP4: "mp4",
} as const;

export type VideoTypeType = (typeof VideoType)[keyof typeof VideoType];
