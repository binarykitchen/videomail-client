import VideomailClient from "./client";
import { FullVideomailErrorData, VideomailErrorData } from "./types/error";
import VideomailEvents from "./types/events";
import RecordingStats from "./types/RecordingStats";
import Videomail from "./types/Videomail";
import { VideoType } from "./types/VideoType";

export type { Videomail };
export type { VideomailEvents };
export type { RecordingStats };
export { VideoType, VideomailClient };
export type { VideomailErrorData, FullVideomailErrorData };
