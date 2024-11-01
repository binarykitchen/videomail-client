import VideomailClient from "./client";
import VideomailEvents from "./types/events";
import { PartialVideomailClientOptions } from "./types/options";
import RecordingStats from "./types/RecordingStats";
import Videomail from "./types/Videomail";
import { VideoType } from "./types/VideoType";

export type { Videomail };
export type { VideomailEvents };
export type { PartialVideomailClientOptions };
export type { RecordingStats };
export { VideoType };

export default VideomailClient;
