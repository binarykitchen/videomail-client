import Response from "superagent/lib/node/response";

import HTTPVideomailError from "./HTTPVideomailError";

function findOriginalExc(exc: unknown) {
  if (exc instanceof Error && "response" in exc) {
    const response = exc.response as Response;
    const body = response.body;

    if ("error" in body) {
      const message = body.error.message as string;
      const cause = body.error.cause;

      const error = new HTTPVideomailError(message, { cause });

      if (body.error.name) {
        error.name = body.error.name;
      }

      if (body.error.explanation) {
        error.explanation = body.error.explanation;
      }

      if (body.error.stack) {
        error.stack = body.error.stack;
      }

      if (body.error.status) {
        error.status = body.error.status;
      }

      if (body.error.code) {
        error.code = body.error.code;
      }

      return error;
    }
  }

  return exc;
}

export default findOriginalExc;
