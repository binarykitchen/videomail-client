import { PartialDeep } from "type-fest";

import { BrowserStats } from "./BrowserStats";
import { DeliveryRecord } from "./Delivery";
import { EmailAddress, EmailAddresses } from "./EmailAddress";
import { ReactionsByUserKey, ReactionsPrettyByUserKey } from "./reaction";
import { RecordingStats } from "./RecordingStats";
import { UserKey } from "./user";
import VideoFormat from "./VideoFormat";

export type VideomailIdentifierType = "snapshot" | "thread";

// Keep this data serializable for LevelDB. No Sets or Maps.
export interface Videomail {
  url: string;

  // Email fields

  subject?: string;
  body?: string;

  from: EmailAddress;
  fromNickName?: string | null;

  to?: EmailAddresses | undefined;
  bcc?: EmailAddresses | undefined;
  cc?: EmailAddresses | undefined;

  alias: string;

  replyAllUrl?: string;
  replyUrl: string;

  // Deliveries

  sentTo?: DeliveryRecord;
  sentCc?: DeliveryRecord;
  sentBcc?: DeliveryRecord;

  rejectedTo?: DeliveryRecord;
  rejectedCc?: DeliveryRecord;
  rejectedBcc?: DeliveryRecord;

  editUrl?: string;
  repeatUrl?: string;

  // Video details

  connection?: Record<string, number | string>;
  dateCreated: number;
  dateCreatedServerPretty: string;
  dateUpdated?: number;
  dateUpdatedServerPretty?: string;

  expired?: boolean;
  expiresAfter: number;
  expiresAfterIso: string;
  expiresAfterServerPretty: string;

  // The server deleted the expired video's files, but kept its metadata.
  orphaned?: boolean;

  permanent?: boolean;

  format?: VideoFormat;
  height?: number | undefined;
  width?: number | undefined;
  key: string;
  mp4?: string;
  webm?: string;
  vtt?: string;
  captions?: string | undefined;
  poster?: string | undefined;
  browserStats?: BrowserStats | undefined;
  recordingStats?: RecordingStats | undefined;
  recordLocation?: string | undefined;

  parentKey?: string | undefined;

  // Social features

  userKey?: UserKey | undefined;

  reactions?: ReactionsByUserKey | undefined;
  reactionsPretty?: ReactionsPrettyByUserKey | undefined;

  commentUrl?: string | undefined;
  commentCount?: number | undefined;

  shareUrl?: string | undefined;

  // Not stored. The user's latest public video poster, for the Videomail wall.
  userPublicPoster?: string | undefined;

  // Visible on the Videomail wall.
  public?: boolean;

  // Sending stats

  sending: boolean;
  sent?: boolean;

  sentDate?: number;
  sentDateIso?: string;
  sentDateServerPretty?: string;
  serverTimePretty?: string;

  // Whitelist

  whitelistKey: string;

  // Not stored. Looked up by whitelist key for snapshots only.
  // TODO Remove once the new whitelist system is fully in use.
  siteName?: string | undefined;

  // General info

  versions: {
    videomailNinjaFormPlugin?: string;
    videomailClient: string;
  };
}

export type PartialVideomail = PartialDeep<Videomail>;
