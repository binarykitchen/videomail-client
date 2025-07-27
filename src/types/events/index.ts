import Response from "superagent/lib/node/response";

import VideomailError from "../../util/error/VideomailError";
import { FormReadyParams } from "../../wrappers/container";
import RecordingStats from "../RecordingStats";
import Videomail from "../Videomail";

export interface UserMediaReadyParams {
  switchingFacingMode?: ConstrainDOMString | undefined;
  recordWhenReady?: boolean | undefined;
  paused?: boolean | undefined;
}

export interface ErrorParams {
  exc?: unknown;
  err?: VideomailError;
}

export interface RecordingParams {
  framesCount: number;
}

export interface StoppingParams {
  limitReached?: boolean | undefined;
}

export interface ProgressParams {
  frameProgress: string;
  sampleProgress?: string | undefined;
}

export interface PreviewParams {
  key?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
  hasAudio: boolean;
}

export interface StoppedParams {
  recordingStats?: RecordingStats | undefined;
}

export interface SubmittedParams {
  videomail: Videomail;
  response: Response;
}

export interface ValidatingParams {
  targetName?: any;
  event?: any;
}

export interface InvalidParams {
  whyInvalid?: string;
  invalidData?: Record<string, string>;
}

interface VideomailEvents {
  // when about to ask for webcam permissions
  ASKING_WEBCAM_PERMISSION: () => void;
  // encoding video
  BEGIN_AUDIO_ENCODING: () => void;
  // encoding video
  BEGIN_VIDEO_ENCODING: () => void;
  // something serious, most likely an error, is shown and blocks
  BLOCKING: () => void;
  // all dom elements are ready, are in the DOM
  BUILT: () => void;
  // socket is connected to server
  CONNECTED: () => void;
  // socket is connecting to server
  CONNECTING: () => void;
  // countdown for recording has started
  COUNTDOWN: () => void;
  // about to disable audio
  DISABLING_AUDIO: () => void;
  // socket to server is disconnected
  DISCONNECTED: () => void;
  // about to enable audio
  ENABLING_AUDIO: () => void;
  // an error occurred
  ERROR: (params: ErrorParams) => void;
  // for debugging only, is emitted when an event is emitted lol,
  EVENT_EMITTED: () => void;
  // emitted once when fist frame has been sent to server
  FIRST_FRAME_SENT: () => void;
  // form is ready, available in the DOM
  FORM_READY: (params: FormReadyParams) => void;
  // switch from replaying back to recording
  GOING_BACK: () => void;
  // emitted when hidden
  HIDE: () => void;
  // form is invalid
  INVALID: (params: InvalidParams) => void;
  // document just became INvisible
  INVISIBLE: () => void;
  // raised when webcam knows its dimensions
  LOADED_META_DATA: () => void;
  // asking for webcam access
  LOADING_USER_MEDIA: () => void;
  // notifies user about something (not blocking)
  NOTIFYING: () => void;
  // recording is being paused
  PAUSED: () => void;
  // video preview is set
  PREVIEW: (params?: PreviewParams) => void;
  // video preview is shown
  PREVIEW_SHOWN: () => void;
  // start sending
  PROGRESS: (params: ProgressParams) => void;
  // webcam is recording
  RECORDING: (params: RecordingParams) => void;
  // submitted video is shown
  REPLAY_SHOWN: () => void;
  // resetting everything to go back to initial state
  RESETTING: () => void;
  // recording is resumed
  RESUMING: () => void;
  // emitted before the first frame is being computed
  SENDING_FIRST_FRAME: () => void;
  // Gets emitted when the ready command is sent through sockets from the server for recording
  SERVER_READY: () => void;
  // starting all over again back to its initial state
  STARTING_OVER: () => void;
  // recording has stopped
  STOPPED: (params: StoppedParams) => void;
  // recording is being stopped (= preview)
  STOPPING: (params: StoppingParams) => void;
  // form has been successfully submitted
  SUBMITTED: (params: SubmittedParams) => void;
  // form is being submitted
  SUBMITTING: () => void;
  // to switch camera on mobiles between front and back
  SWITCH_FACING_MODE: () => void;
  UNLOADING: () => void;
  // user media (= webcam) is ready, loaded
  USER_MEDIA_READY: (params: UserMediaReadyParams) => void;
  // form is valid
  VALID: () => void;
  // form is being validated
  VALIDATING: (params?: ValidatingParams) => void;
  // document just became visible
  VISIBLE: () => void;
}

export default VideomailEvents;
