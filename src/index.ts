import VideomailClient from "./client";

export type { Command } from "./types/command";
export type { VideomailCommandArgs } from "./types/command";
export type { DeliveryRecord } from "./types/Delivery";
export type { EmailAddress, EmailAddresses } from "./types/EmailAddress";
export type { FullVideomailErrorData, VideomailErrorData } from "./types/error";
export type { VideomailEvents, VideomailPreviewParams } from "./types/events";
export type { VideomailClientOptions } from "./types/options";
export type RecordingStats = "./types/RecordingStats";
export type { PartialVideomail, Videomail } from "./types/Videomail";

export { VideomailClient };
