import { PartialDeep } from "type-fest";

import { BrowserStats } from "./BrowserStats";
import { DeliveryRecord } from "./Delivery";
import { EmailAddress, EmailAddresses } from "./EmailAddress";
import { RecordingStats } from "./RecordingStats";
import VideoFormat from "./VideoFormat";

// Remember, only primitive types are supported.
// LevelDB can't store for example Sets or Maps
export interface Videomail {
  // First, typical email typings
  subject?: string;
  body?: string;

  from: EmailAddress;
  to?: EmailAddresses | undefined;
  bcc?: EmailAddresses | undefined;
  cc?: EmailAddresses | undefined;

  alias: string;

  // Then Videomail specific stuff

  connection?: Record<string, number | string>;
  dateCreated: number;
  dateCreatedServerPretty: string;
  dateUpdated?: number;
  dateUpdatedServerPretty?: string;
  expiresAfter: number;
  expiresAfterIso: string;
  expiresAfterServerPretty: string;
  format?: VideoFormat;
  height?: number | undefined;
  key: string;
  parentKey?: string;
  mp4?: string;
  vtt?: string;
  captions?: string | undefined;
  poster: string;
  browserStats?: BrowserStats | undefined;
  recordingStats?: RecordingStats | undefined;
  recordLocation?: string | undefined;

  replyAllUrl?: string;
  replyUrl: string;
  sending: boolean;
  sent?: boolean;

  sentDate?: number;
  sentDateIso?: string;
  sentDateServerPretty?: string;
  serverTimePretty?: string;

  whitelistKey: string;

  siteTitle?: string;
  url: string;
  userKey?: string;
  versions: {
    videomailNinjaFormPlugin?: string;
    videomailClient: string;
  };
  webm?: string;
  width?: number | undefined;

  // Deliveries

  sentTo?: DeliveryRecord;
  sentCc?: DeliveryRecord;
  sentBcc?: DeliveryRecord;

  rejectedTo?: DeliveryRecord;
  rejectedCc?: DeliveryRecord;
  rejectedBcc?: DeliveryRecord;

  editUrl?: string;
  repeatUrl?: string;
}

export type PartialVideomail = PartialDeep<Videomail>;
