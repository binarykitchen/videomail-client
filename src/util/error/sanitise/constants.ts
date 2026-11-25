export const PRIVATE_FIELDS = [
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

export const PRIVATE_FIELD = new RegExp(`^(?:${PRIVATE_FIELDS})$`, "iu");

export const PRIVATE_CONTENT_FIELD = /^(?:subject|body)$/iu;

export const URL_FIELD =
  /^(?:url|uri|href|location|recordLocation|blockedURI|responseURL)$/iu;
export const LOG_ASSIGNMENT = String.raw`(["']?\b(?:${PRIVATE_FIELDS}|subject|body)["']?\s*[:=]\s*)`;
export const LOG_VALUES = [
  /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/u.source,
  /(?:Bearer|Basic)\s+[^\s,;}]+/u.source,
  /[^\s,;{}[\]]+/u.source,
].join("|");

export const PRIVATE_LOG_VALUE = new RegExp(`${LOG_ASSIGNMENT}(?:${LOG_VALUES})`, "giu");
