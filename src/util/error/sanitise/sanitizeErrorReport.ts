import { serializeError } from "serialize-error";

import type { FullVideomailErrorData } from "../../../types/error";
import isObjectLike from "../../isObjectLike";
import sanitizeUrl, { REDACTED } from "../../url/sanitizeUrl";
import { PRIVATE_CONTENT_FIELD, PRIVATE_FIELD, URL_FIELD } from "./constants";
import sanitizeText from "./util/sanitizeText";

function sanitizeErrorReport(report: FullVideomailErrorData) {
  function redactField(key: string, value: unknown) {
    if (PRIVATE_FIELD.test(key)) {
      return REDACTED;
    }

    if (typeof value !== "string") {
      return value;
    }

    if (PRIVATE_CONTENT_FIELD.test(key)) {
      return REDACTED;
    }

    const text = URL_FIELD.test(key) ? sanitizeUrl(value, report.location) : value;

    return sanitizeText(text);
  }

  const json = JSON.stringify(serializeError(report), redactField);
  const sanitized: unknown = JSON.parse(json);

  if (!isObjectLike(sanitized)) {
    throw new TypeError("An error report must serialize to an object.");
  }

  return sanitized;
}

export default sanitizeErrorReport;
