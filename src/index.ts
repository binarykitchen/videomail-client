import VideomailClient from "./client";
import { Command, VideomailCommandArgs } from "./types/command";
import DeliveryRecord from "./types/DeliveryRecord";
import { EmailAddress, EmailAddresses } from "./types/EmailAddress";
import { FullVideomailErrorData, VideomailErrorData } from "./types/error";
import VideomailEvents, { VideomailPreviewParams } from "./types/events";
import { VideomailClientOptions } from "./types/options";
import RecordingStats from "./types/RecordingStats";
import Videomail, { PartialVideomail } from "./types/Videomail";
import { VideoType, VideoTypeType } from "./types/VideoType";

export type {
  Command,
  DeliveryRecord,
  EmailAddress,
  EmailAddresses,
  FullVideomailErrorData,
  PartialVideomail,
  RecordingStats,
  Videomail,
  VideomailClientOptions,
  VideomailCommandArgs,
  VideomailErrorData,
  VideomailEvents,
  VideomailPreviewParams,
  VideoTypeType,
};

export { VideomailClient, VideoType };
