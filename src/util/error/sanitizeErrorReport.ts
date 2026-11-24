import { serializeError } from "serialize-error";

import type { FullVideomailErrorData } from "../../types/error";
import isObjectLike from "../isObjectLike";
import sanitizeUrl, { REDACTED } from "../url/sanitizeUrl";

const PRIVATE_FIELDS = [
  "cookies?|set[-_]?cookie",
  "(?:proxy[-_]?)?authorization",
  "pass(?:word|phrase|wd)",
  "(?:client[-_]?)?secret",
  "(?:x[-_]?)?api[-_]?key",
  "(?:access|refresh|id|auth|session)[-_]?token|token",
  "(?:x[-_]?)?(?:csrf|xsrf)(?:[-_]?token)?",
  "session(?:[-_]?id)?",
  "e[-_]?mail|from|to|cc|bcc|recipients?|sender",
].join("|");
const PRIVATE_FIELD = new RegExp(`^(?:${PRIVATE_FIELDS})$`, "iu");
const PRIVATE_CONTENT_FIELD = /^(?:subject|body)$/iu;
const URL_FIELD = /^(?:url|uri|href|location|recordLocation|blockedURI|responseURL)$/iu;
const LOG_ASSIGNMENT = String.raw`(["']?\b(?:${PRIVATE_FIELDS}|subject|body)["']?\s*[:=]\s*)`;
const LOG_VALUES = [
  /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/u.source,
  /(?:Bearer|Basic)\s+[^\s,;}]+/u.source,
  /[^\s,;{}[\]]+/u.source,
].join("|");
const PRIVATE_LOG_VALUE = new RegExp(`${LOG_ASSIGNMENT}(?:${LOG_VALUES})`, "giu");

function sanitizeText(text: string) {
  return text
    .replace(/\b(?:https?|wss?):\/\/[^\s"'<>(){}]+/giu, (value) => {
      const position = /:\d+:\d+$/u.exec(value)?.[0] ?? "";
      const address = position ? value.slice(0, -position.length) : value;

      return `${sanitizeUrl(address)}${position}`;
    })
    .replace(PRIVATE_LOG_VALUE, `$1${REDACTED}`)
    .replace(/\b(Bearer|Basic)\s+[\w.+/~=-]+/giu, `$1 ${REDACTED}`)
    .replace(/\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b/giu, REDACTED);
}

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
