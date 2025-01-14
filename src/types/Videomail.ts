import { DeepPartial } from "./DeepPartial";
import RecordingStats from "./RecordingStats";
import VideoFormat from "./VideoFormat";

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
    ninjaFormPlugin?: string;
    videomailClient: string;
  };
  webm?: string;
  width?: number | undefined;
}

export type PartialVideomail = DeepPartial<Videomail>;

export default Videomail;
