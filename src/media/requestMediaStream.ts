import { isErrorLike } from "serialize-error";

const OPTIONAL_AUDIO_ERRORS = [
  "NotAllowedError",
  "PermissionDeniedError",
  "NotFoundError",
  "DevicesNotFoundError",
];

interface RequestMediaStreamParams {
  constraints: MediaStreamConstraints;
  followsMicrophonePermission: boolean;
  getPermission?: (() => Promise<PermissionState>) | undefined;
  isRequestCurrent: () => boolean;
}

type OptionalAudioRequestParams = Pick<
  RequestMediaStreamParams,
  "constraints" | "getPermission" | "isRequestCurrent"
>;

function isOptionalAudioError(error: unknown) {
  return (
    // WebRTC DOMExceptions need not have the stack expected by isErrorLike().
    (error instanceof Error || error instanceof DOMException || isErrorLike(error)) &&
    OPTIONAL_AUDIO_ERRORS.includes(error.name)
  );
}

function requestCameraOnly(constraints: MediaStreamConstraints) {
  return navigator.mediaDevices.getUserMedia({ ...constraints, audio: false });
}

function retryCameraOnlyAfterAudioError(
  error: unknown,
  constraints: MediaStreamConstraints,
  isRequestCurrent: () => boolean,
  audioRequested: boolean,
) {
  if (!isRequestCurrent()) {
    return undefined;
  }

  if (!audioRequested || !isOptionalAudioError(error)) {
    throw error;
  }

  // A microphone-only failure should not prevent silent video.
  return requestCameraOnly(constraints);
}

function requestWithOptionalAudio(params: OptionalAudioRequestParams) {
  const { constraints, getPermission, isRequestCurrent } = params;
  let audioRequested = Boolean(constraints.audio);
  const streamPromise = getPermission
    ? getPermission().then((permission) => {
        if (!isRequestCurrent()) {
          return undefined;
        }

        audioRequested = permission !== "denied" && Boolean(constraints.audio);

        return navigator.mediaDevices.getUserMedia({
          ...constraints,
          audio: audioRequested,
        });
      })
    : navigator.mediaDevices.getUserMedia(constraints);

  if (!constraints.audio) {
    return streamPromise;
  }

  return streamPromise.catch((error: unknown) =>
    retryCameraOnlyAfterAudioError(error, constraints, isRequestCurrent, audioRequested),
  );
}

function requestMediaStream(params: RequestMediaStreamParams) {
  if (!params.followsMicrophonePermission) {
    return navigator.mediaDevices.getUserMedia(params.constraints);
  }

  return requestWithOptionalAudio(params);
}

export default requestMediaStream;
