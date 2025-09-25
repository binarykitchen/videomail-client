export const VideoExtension = {
  WebM: "webm",
  MP4: "mp4",
} as const;

export type VideoExtensionType = (typeof VideoExtension)[keyof typeof VideoExtension];
