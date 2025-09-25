import VideomailClient from "./client";
import type { Command, CommandArgs } from "./types/command";
import type DeliveryRecord from "./types/DeliveryRecord";
import type { EmailAddress, EmailAddresses } from "./types/EmailAddress";
import type { FullVideomailErrorData, VideomailErrorData } from "./types/error";
import type VideomailEvents from "./types/events";
import type { VideomailClientOptions } from "./types/options";
import type RecordingStats from "./types/RecordingStats";
import type { PartialVideomail, Videomail } from "./types/Videomail";
import { VideoType } from "./types/VideoType";

export type {
  Command,
  CommandArgs,
  DeliveryRecord,
  EmailAddress,
  EmailAddresses,
  FullVideomailErrorData,
  PartialVideomail,
  RecordingStats,
  Videomail,
  VideomailClientOptions,
  VideomailErrorData,
  VideomailEvents,
  VideoType,
};

export { VideomailClient };
