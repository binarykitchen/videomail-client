import getVersions from "../getVersions";
import describeKnownProblem from "./problem/describeKnownProblem";
import describeUnknownProblem from "./problem/describeUnknownProblem";
import type { ErrorParams } from "./types";
import type { ErrData } from "./VideomailError";
import VideomailError from "./VideomailError";

/*
 * Turns whatever went wrong into a VideomailError with a friendly message.
 *
 * No side effects: it never sends a report. Code that handles an error decides to
 * report it through ErrorReporter, once.
 */
function createError(errorParams: ErrorParams) {
  const { exc, options } = errorParams;

  let err = errorParams.err;

  if (!err && exc instanceof Error) {
    err = exc;
  }

  if (err instanceof VideomailError) {
    return err;
  }

  const errName = err?.name ?? err?.constructor.name;
  const knownProblem =
    err && errName ? describeKnownProblem(errName, err, options) : undefined;

  // Known problems without an explanation of their own keep the caller's one.
  const { message, explanation = errorParams.explanation } =
    knownProblem ?? describeUnknownProblem(errorParams, err, errName);

  // A fresh list, so the caller's classList never changes.
  const classList = [
    ...(errorParams.classList ?? []),
    ...(knownProblem?.classList ?? []),
  ];

  const logLines = options.logger.getLines?.();

  const args = [message, explanation].filter(Boolean).join(", ");

  options.logger.debug(`VideomailError: create(${args})`);

  const errData: ErrData = {
    cause: errorParams.cause,
    explanation,
    logLines,
    err,
  };

  // This starts a new stack trace; errData keeps the original error.
  const videomailError = new VideomailError(
    message ?? "(undefined message)",
    options,
    classList,
    errData,
  );

  if (err) {
    videomailError.status = err.status;
    videomailError.code = err.code;
    videomailError.constraint = err.constraint;
    videomailError.usedConstraints = err.usedConstraints;
  }

  videomailError.versions = getVersions(options);

  return videomailError;
}

export default createError;
