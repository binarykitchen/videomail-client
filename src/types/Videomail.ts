import { PartialDeep } from "type-fest";
import RecordingStats from "./RecordingStats";
import VideoFormat from "./VideoFormat";

// Remember, only primitive types are supported.
// LevelDB can't store for example Sets or Maps
interface Videomail {
  alias: string;
  bcc?: string[] | undefined;
  body?: string;
  cc?: string[] | undefined;
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
  rejectedBcc?: string[];
  rejectedCc?: string[];
  rejectedTo?: string[];
  accepted?: string[];
  replyAllUrl?: string;
  replyUrl: string;
  sending: boolean;
  sent?: boolean;
  sentBcc?: string[];
  sentCc?: string[];
  sentDate?: number;
  sentDateIso?: string;
  sentDatePretty?: string;
  sentTo?: string[];
  siteName: string;
  siteTitle?: string;
  subject?: string;
  to?: string[] | undefined;
  url: string;
  versions: {
    videomailNinjaFormPlugin?: string;
    videomailClient: string;
  };
  webm?: string;
  width?: number | undefined;
}

export type PartialVideomail = PartialDeep<Videomail>;

export default Videomail;
