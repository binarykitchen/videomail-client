import { VideoType } from "./types/VideoType";

export { VideomailClient } from "./client";
export type { Command } from "./types/command";
export type { VideomailCommandArgs } from "./types/command";
export type { DeliveryRecord } from "./types/Delivery";
export type { EmailAddress, EmailAddresses } from "./types/EmailAddress";
export type { FullVideomailErrorData, VideomailErrorData } from "./types/error";
export type { VideomailEvents, VideomailPreviewParams } from "./types/events";
export type { VideomailClientOptions } from "./types/options";
export type { RecordingStats } from "./types/RecordingStats";
export type { PartialVideomail, Videomail } from "./types/Videomail";
export type { VideoTypeType } from "./types/VideoType";

// TODO Will sort this out later after the TS v10 release
export { VideoType };
