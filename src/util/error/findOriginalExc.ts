import HTTPVideomailError from "./HTTPVideomailError";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findOriginalExc(exc: unknown) {
  if (!(exc instanceof Error) || !("response" in exc)) {
    return exc;
  }

  const response = exc.response;

  if (!isRecord(response) || !isRecord(response.body)) {
    return exc;
  }

  const serverError = response.body.error;

  if (!isRecord(serverError) || typeof serverError.message !== "string") {
    return exc;
  }

  const error = new HTTPVideomailError(serverError.message, { cause: serverError.cause });

  if (typeof serverError.name === "string" && serverError.name) {
    error.name = serverError.name;
  }

  if (typeof serverError.explanation === "string" && serverError.explanation) {
    error.explanation = serverError.explanation;
  }

  if (typeof serverError.stack === "string" && serverError.stack) {
    error.stack = serverError.stack;
  }

  if (typeof serverError.status === "number" && serverError.status) {
    error.status = serverError.status;
  }

  if (typeof serverError.code === "string" && serverError.code) {
    error.code = serverError.code;
  }

  return error;
}

export default findOriginalExc;
