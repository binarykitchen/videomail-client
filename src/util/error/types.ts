import type { VideomailClientOptions } from "../../types/options";
import type { HTTPVideomailErrorLike } from "./HTTPVideomailError";

export interface KnownProblem {
  message: string;
  // Without one, createError keeps the caller's explanation.
  explanation?: string | undefined;
  // Extra classes, so the notifier can style the error.
  classList?: readonly string[];
}

export interface ErrorParams {
  cause?: unknown;
  err?: HTTPVideomailErrorLike;
  exc?: unknown;
  message?: string;
  explanation?: string;
  options: VideomailClientOptions;
  classList?: string[];
  usedConstraints?: MediaStreamConstraints;
}
