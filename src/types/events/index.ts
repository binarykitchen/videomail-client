import { FormReadyParams } from "../../wrappers/container";
import {
  VideomailCameraRecoveryFailedParams,
  VideomailErrorParams,
  VideomailInvalidParams,
  VideomailPreviewParams,
  VideomailProgressParams,
  VideomailRecordingParams,
  VideomailStoppedParams,
  VideomailStoppingParams,
  VideomailSubmittedParams,
  VideomailUserMediaReadyParams,
  VideomailValidatingParams,
} from "./params";

export interface VideomailEvents {
  // About to ask for camera permission.
  ASKING_WEBCAM_PERMISSION: () => void;
  // Audio encoding has started.
  BEGIN_AUDIO_ENCODING: () => void;
  // Video encoding has started.
  BEGIN_VIDEO_ENCODING: () => void;
  // A blocking notice, usually an error, is shown.
  BLOCKING: () => void;
  // The UI elements are ready in the DOM.
  BUILT: () => void;
  CAMERA_RECOVERING: () => void;
  CAMERA_RECOVERY_FAILED: (params: VideomailCameraRecoveryFailedParams) => void;
  // The server connection is open.
  CONNECTED: () => void;
  // Connecting to the server.
  CONNECTING: () => void;
  // The recording countdown has started.
  COUNTDOWN: () => void;
  // About to turn audio off.
  DISABLING_AUDIO: () => void;
  // The server connection has closed.
  DISCONNECTED: () => void;
  // About to turn audio on.
  ENABLING_AUDIO: () => void;
  // An error needs handling.
  ERROR: (params: VideomailErrorParams) => void;
  // For debugging: an event about an event.
  EVENT_EMITTED: () => void;
  // The first frame has been sent. Fires once per take.
  FIRST_FRAME_SENT: () => void;
  // The form is ready in the DOM.
  FORM_READY: (params: FormReadyParams) => void;
  // Switching from replay to recording.
  GOING_BACK: () => void;
  // The UI has been hidden.
  HIDE: () => void;
  // The form needs corrections.
  INVALID: (params: VideomailInvalidParams) => void;
  // The page has become hidden.
  INVISIBLE: () => void;
  // The camera dimensions are available.
  LOADED_META_DATA: () => void;
  // Loading the camera stream.
  LOADING_USER_MEDIA: () => void;
  // A non-blocking notice is shown.
  NOTIFYING: () => void;
  // Pausing the recording.
  PAUSED: () => void;
  // The preview has been set.
  PREVIEW: (params?: VideomailPreviewParams) => void;
  // The preview is visible.
  PREVIEW_SHOWN: () => void;
  // Upload or encoding progress has changed.
  PROGRESS: (params: VideomailProgressParams) => void;
  // Recording is in progress.
  RECORDING: (params: VideomailRecordingParams) => void;
  // The submitted video is visible.
  REPLAY_SHOWN: () => void;
  // Resetting to the initial state.
  RESETTING: () => void;
  // Resuming the recording.
  RESUMING: () => void;
  // About to capture the first frame.
  SENDING_FIRST_FRAME: () => void;
  // The server has signalled it is ready to record.
  SERVER_READY: () => void;
  // Starting a fresh take.
  STARTING_OVER: () => void;
  // Recording has stopped.
  STOPPED: (params: VideomailStoppedParams) => void;
  // Stopping the recording to prepare a preview.
  STOPPING: (params: VideomailStoppingParams) => void;
  // The form was submitted successfully.
  SUBMITTED: (params: VideomailSubmittedParams) => void;
  // Submitting the form.
  SUBMITTING: () => void;
  // Switching between front and back cameras on mobile.
  SWITCH_FACING_MODE: () => void;
  UNLOADING: () => void;
  // The camera stream is ready.
  USER_MEDIA_READY: (params: VideomailUserMediaReadyParams) => void;
  // The form passed validation.
  VALID: () => void;
  // Checking the form.
  VALIDATING: (params?: VideomailValidatingParams) => void;
  // The page has become visible.
  VISIBLE: () => void;
  // The window's inner width has changed.
  WINDOW_RESIZE: (source: string) => void;
}
