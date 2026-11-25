import sanitizeUrl, { REDACTED } from "../../../url/sanitizeUrl";
import { PRIVATE_LOG_VALUE } from "../constants";

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

export default sanitizeText;
