import type { HTTPVideomailErrorLike } from "../HTTPVideomailError";

function explainOverconstrained({ constraint, message }: HTTPVideomailErrorLike) {
  if (constraint === "width") {
    return "Your webcam does not meet the width requirement.";
  }

  if (constraint) {
    return `Unmet constraint: ${constraint}`;
  }

  // An empty message tells nothing, so leave the explanation to the caller.
  return message || undefined;
}

export default explainOverconstrained;
