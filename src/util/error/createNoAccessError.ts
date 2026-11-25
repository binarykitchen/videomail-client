import type { VideomailClientOptions } from "../../types/options";
import createError from "./createError";
import explainNoAccess from "./util/explainNoAccess";

/*
 * For when the browser never answers our webcam request.
 *
 * Keep this out of Browser: VideomailError needs Browser, so Browser importing
 * createError would bring back an import cycle 🔁
 */
function createNoAccessError(options: VideomailClientOptions) {
  return createError({
    message: "Unable to access webcam",
    explanation: explainNoAccess(options),
    options,
  });
}

export default createNoAccessError;
