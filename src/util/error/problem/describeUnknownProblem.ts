import isObjectLike from "../../isObjectLike";
import pretty from "../../string/pretty";
import type { HTTPVideomailErrorLike } from "./../HTTPVideomailError";
import type { ErrorParams } from "./../types";
import isThrownNonError from "./isThrownNonError";
import isNonTextMessage from "./util/isNonTextMessage";

// For when nothing at all describes what went wrong, not even an error name.
const UNKNOWN_ERROR_MESSAGE = "Unknown error";

// No friendly words for this error, so make the most of whatever came in.
function describeUnknownProblem(
  errorParams: ErrorParams,
  err: HTTPVideomailErrorLike | undefined,
  errName: string | undefined,
) {
  const { exc } = errorParams;
  let { message, explanation } = errorParams;

  /*
   * JavaScript callers can pass anything as a message. An object would read
   * "[object Object]" and a bare number means nothing, so spell out what came in. 🔍
   */
  if (isNonTextMessage(message)) {
    message = `Unexpected ${typeof message} as message: ${pretty(message)}`;
  }

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

  // Keep a thrown string or object visible instead of a vague "Unknown error".
  if (!message && isThrownNonError(exc)) {
    message = "Unexpected error";
    explanation ??= pretty(exc);
  }

  // Keep the error name if no message is available.
  if (!message && errName) {
    message = `${errName} (weird)`;
  }

  // Nobody said what went wrong. The report's stack still shows who raised it.
  if (!message) {
    message = UNKNOWN_ERROR_MESSAGE;
  }

  return { message, explanation };
}

export default describeUnknownProblem;
