import { PartialDeep } from "type-fest";
import RecordingStats from "./RecordingStats";
import VideoFormat from "./VideoFormat";

interface Videomail {
  alias: string;
  bcc?: Set<string> | undefined;
  body?: string;
  cc?: Set<string> | undefined;
  connection?: Record<string, number | string>;
  correctUrl: string;
  dateCreated: number;
  dateCreatedPretty: string;
  dateUpdated: number;
  expiresAfter: number;
  expiresAfterIso: string;
  expiresAfterPretty: string;
  format?: VideoFormat;
  from: string;
  height?: number | undefined;
  key: string;
  mp4?: string;
  vtt?: string;
  captions?: string | undefined;
  parentKey?: string;
  poster: string;
  recordingStats?: RecordingStats | undefined;
  rejectedBcc?: Set<string>;
  rejectedCc?: Set<string>;
  rejectedTo?: Set<string>;
  accepted?: Set<string>;
  replyAllUrl?: string;
  replyUrl: string;
  sending: boolean;
  sent?: boolean;
  sentBcc?: Set<string>;
  sentCc?: Set<string>;
  sentDate?: number;
  sentDateIso?: string;
  sentDatePretty?: string;
  sentTo?: Set<string>;
  siteName: string;
  siteTitle?: string;
  subject?: string;
  to?: Set<string> | undefined;
  url: string;
  versions: {
    ninjaFormPlugin?: string;
    videomailClient: string;
  };
  webm?: string;
  width?: number | undefined;
}

export type PartialVideomail = PartialDeep<Videomail>;

export default Videomail;
