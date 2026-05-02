import { PartialDeep } from "type-fest";

import { BrowserStats } from "./BrowserStats";
import { DeliveryRecord } from "./Delivery";
import { EmailAddress, EmailAddresses } from "./EmailAddress";
import { ReactionsByUserKey, ReactionsPrettyByUserKey } from "./reaction";
import { RecordingStats } from "./RecordingStats";
import { UserKey } from "./user";
import VideoFormat from "./VideoFormat";

// Remember, only primitive types are supported.
// LevelDB can't store for example Sets or Maps.
export interface Videomail {
  // First, typical email typings
  subject?: string;
  body?: string;

  from: EmailAddress;
  fromNickName?: string | null;

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
  mp4?: string;
  vtt?: string;
  captions?: string | undefined;
  poster?: string | undefined;
  browserStats?: BrowserStats | undefined;
  recordingStats?: RecordingStats | undefined;
  recordLocation?: string | undefined;

  parentKey?: string | undefined;

  reactions?: ReactionsByUserKey | undefined;
  reactionsPretty?: ReactionsPrettyByUserKey | undefined;

  replyAllUrl?: string;
  replyUrl: string;

  commentUrl?: string | undefined;
  shareUrl?: string | undefined;

  sending: boolean;
  sent?: boolean;

  sentDate?: number;
  sentDateIso?: string;
  sentDateServerPretty?: string;
  serverTimePretty?: string;

  whitelistKey: string;

  // Never stored, for snapshots only and retrieved via whitelist key
  // Consider removing once all has been migrated to the new whitelist system.
  siteName?: string | undefined;

  url: string;

  userKey?: UserKey | undefined;

  // Never stored. Points to the latest public videomail poster of the user, if any.
  // Used for the Videomail wall.
  userPublicPoster?: string | undefined;

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

  // When true, the videomail is visible to the Videomail wall
  public?: boolean;

  editUrl?: string;
  repeatUrl?: string;
}

export type PartialVideomail = PartialDeep<Videomail>;
