import type Response from "superagent/lib/node/response";

import VideomailError from "../../util/error/VideomailError";
import { RecordingStats } from "../RecordingStats";
import { Videomail } from "../Videomail";

// All these event params are always exported from this library

export interface VideomailUserMediaReadyParams {
  // Requested camera facing mode when readiness follows a camera switch.
  switchingFacingMode?: ConstrainDOMString | undefined;
  // True when the ready stream replaces one lost during an existing take.
  recovering?: boolean | undefined;
  // True when recording should start as soon as media is ready.
  recordWhenReady?: boolean | undefined;
  // Whether the current take is paused when media becomes ready.
  paused?: boolean | undefined;
}

export interface VideomailCameraRecoveryFailedParams {
  // The error that prevented the replacement camera stream from becoming ready.
  err: VideomailError;
}

export interface VideomailErrorParams {
  // The original thrown value, before conversion to VideomailError.
  exc?: unknown;
  // Normalized error details, when available.
  err?: VideomailError;
  // True for submission failures: keep the take and restore the form for retry.
  recoverable?: boolean | undefined;
}

export interface VideomailRecordingParams {
  framesCount: number;
}

export interface VideomailStoppingParams {
  // True when the configured recording-duration limit caused this stop.
  limitReached?: boolean | undefined;
}

export interface VideomailProgressParams {
  // Confirmed video-frame progress, formatted as a percentage string.
  frameProgress: string;
  // Confirmed audio-sample progress, formatted as a percentage string.
  sampleProgress?: string | undefined;
}

export interface VideomailPreviewParams {
  // Videomail key for this take, when it has one.
  key?: string | undefined;
  // Preview dimensions reported by the recorder.
  width?: number | undefined;
  height?: number | undefined;
  // Whether the recorded take includes audio.
  hasAudio: boolean;
  // Encoded clip duration; -1 is used when the server omits it.
  duration: number;
}

export interface VideomailStoppedParams {
  // Recording statistics collected for this take, when available.
  recordingStats?: RecordingStats | undefined;
}

export interface VideomailSubmittedParams {
  // Videomail record returned by the server.
  videomail: Videomail;
  // Videomail API response when uploading a video; form response for text-only sends.
  response: Response;
}

export interface VideomailValidatingParams {
  // Name of the form field that triggered validation, when available.
  targetName?: string | undefined;
  // Original DOM event when the triggering field has no name.
  event?: Event | undefined;
}

export interface VideomailInvalidParams {
  // Human-readable reason the form failed validation, when available.
  whyInvalid?: string | undefined;
  // Values associated with invalid fields, when available.
  invalidData?: VideomailInvalidFormData | undefined;
}

// Field names mapped to their reported value; undefined can mark a missing video key.
export type VideomailInvalidFormData = Record<string, string | null | undefined>;
