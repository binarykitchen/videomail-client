import Response from "superagent/lib/node/response";

import VideomailError from "../../util/error/VideomailError";
import { RecordingStats } from "../RecordingStats";
import { Videomail } from "../Videomail";

// All these event params are always exported from this library

export interface VideomailUserMediaReadyParams {
  switchingFacingMode?: ConstrainDOMString | undefined;
  recordWhenReady?: boolean | undefined;
  paused?: boolean | undefined;
}

export interface VideomailErrorParams {
  exc?: unknown;
  err?: VideomailError;
}

export interface VideomailRecordingParams {
  framesCount: number;
}

export interface VideomailStoppingParams {
  limitReached?: boolean | undefined;
}

export interface VideomailProgressParams {
  frameProgress: string;
  sampleProgress?: string | undefined;
}

export interface VideomailPreviewParams {
  key?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
  hasAudio: boolean;
  duration: number;
}

export interface VideomailStoppedParams {
  recordingStats?: RecordingStats | undefined;
}

export interface VideomailSubmittedParams {
  videomail: Videomail;
  response: Response;
}

export interface VideomailValidatingParams {
  targetName?: any;
  event?: any;
}

export interface VideomailInvalidParams {
  whyInvalid?: string | undefined;
  invalidData?: Record<string, string>;
}
