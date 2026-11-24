import isObjectLike from "../../util/isObjectLike";
import { AudioSamplesMessage } from "./types";

// The worklet posts { recordingId, samples } batches. Anything else gets ignored.
function isAudioSamplesMessage(message: unknown): message is AudioSamplesMessage {
  return (
    isObjectLike(message) &&
    "recordingId" in message &&
    "samples" in message &&
    message.samples instanceof Float32Array
  );
}

export default isAudioSamplesMessage;
