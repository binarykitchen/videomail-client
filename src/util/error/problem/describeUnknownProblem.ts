import isObjectLike from "../../isObjectLike";
import pretty from "../../string/pretty";
import type { HTTPVideomailErrorLike } from "./../HTTPVideomailError";
import type { ErrorParams } from "./../types";
import isThrownNonError from "./isThrownNonError";

// No friendly words for this error, so make the most of whatever came in.
function describeUnknownProblem(
  errorParams: ErrorParams,
  err: HTTPVideomailErrorLike | undefined,
  errName: string | undefined,
) {
  const { exc } = errorParams;
  let { message, explanation } = errorParams;

  const originalExplanation = explanation;

  if (isObjectLike(explanation)) {
    explanation = pretty(explanation);
  }

  // pretty() may return undefined for an error object.
  if (!explanation && originalExplanation) {
    explanation = `Inspected: ${originalExplanation}`;
  }

  // Fall back to the server's explanation.
  if (!explanation && err?.explanation) {
    explanation = err.explanation;
  }

  if (!message && err?.message) {
    message = err.message;
  }

  // Keep a thrown string or object visible instead of "(undefined message)".
  if (!message && isThrownNonError(exc)) {
    message = "Unexpected error";
    explanation ??= pretty(exc);
  }

  // Keep the error name if no message is available.
  if (!message && errName) {
    message = `${errName} (weird)`;
  }

  return { message, explanation };
}

export default describeUnknownProblem;
