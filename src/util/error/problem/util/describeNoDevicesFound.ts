import type { VideomailClientOptions } from "../../../../types/options";
import { isAudioEnabled } from "../../../options/audio";
import { WEBCAM_PROBLEM } from "../../constants";

function describeNoDevicesFound(options: VideomailClientOptions) {
  if (isAudioEnabled(options)) {
    return {
      message: "No webcam or microphone found",
      explanation: "Check that your webcam and microphone are connected.",
      classList: WEBCAM_PROBLEM,
    };
  }

  return {
    message: "No webcam found",
    explanation: "Check that your webcam is connected.",
    classList: WEBCAM_PROBLEM,
  };
}

export default describeNoDevicesFound;
