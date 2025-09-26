import VideomailClient from "./client";
import { Command, CommandArgs } from "./types/command";
import DeliveryRecord from "./types/DeliveryRecord";
import { EmailAddress, EmailAddresses } from "./types/EmailAddress";
import { FullVideomailErrorData, VideomailErrorData } from "./types/error";
import VideomailEvents from "./types/events";
import { VideomailClientOptions } from "./types/options";
import RecordingStats from "./types/RecordingStats";
import Videomail, { PartialVideomail } from "./types/Videomail";
import { VideoType, VideoTypeType } from "./types/VideoType";

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
  VideoTypeType,
};

export { VideomailClient, VideoType };
