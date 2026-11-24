import isRecord from "../isRecord";
import HTTPVideomailError from "./HTTPVideomailError";

// Superagent attaches the server's HTTP response to errors from failed requests.
function hasResponse(exc: unknown): exc is Error & { response: unknown } {
  return exc instanceof Error && "response" in exc;
}

function findOriginalExc(exc: unknown) {
  if (!hasResponse(exc)) {
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
