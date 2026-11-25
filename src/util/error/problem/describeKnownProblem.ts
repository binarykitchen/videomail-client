import type { VideomailClientOptions } from "../../../types/options";
import pretty from "../../string/pretty";
import { KNOWN_PROBLEMS } from "./../constants";
import type { HTTPVideomailErrorLike } from "./../HTTPVideomailError";
import VideomailError from "./../VideomailError";
import explainOverconstrained from "./explainOverconstrained";
import describeNoDevicesFound from "./util/describeNoDevicesFound";

// Returns undefined for error names we have no friendly words for.
// In that case, the other function describeUnknownProblem will provide a fallback description.
function describeKnownProblem(
  errName: string,
  err: HTTPVideomailErrorLike,
  options: VideomailClientOptions,
) {
  // These few depend on the error or the options, so they can't live in the table.
  switch (errName) {
    case VideomailError.OVERCONSTRAINED:
      return {
        message: "Your webcam cannot use these settings",
        explanation: explainOverconstrained(err),
      };
    case "NO_DEVICES_FOUND":
      return describeNoDevicesFound(options);
    case VideomailError.DOM_EXCEPTION:
      return { message: "DOM Exception", explanation: pretty(err) };
    // Chrome can report this if camera access starts too early.
    // The recorder normally retries; reaching here needs investigation.
    case VideomailError.MEDIA_DEVICE_NOT_SUPPORTED:
      return { message: "Media device not supported", explanation: pretty(err) };
    default:
      return KNOWN_PROBLEMS.get(errName);
  }
}

export default describeKnownProblem;
