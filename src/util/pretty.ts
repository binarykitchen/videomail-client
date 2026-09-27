import util from "node:util";

import getEventDetails from "./error/getEventDetails";

function inspect(element: unknown) {
  return util
    .inspect(element, {
      colors: false,
      compact: false,
      depth: 4,
      breakLength: Infinity,
      showHidden: true,
    })
    .replace(/\s+/gu, " ")
    .replace(/\r?\n/gu, "");
}

// Prettifies any HTML element for better readability in logs
function pretty(anything: unknown) {
  if (anything instanceof HTMLElement) {
    if (anything.id) {
      return `#${anything.id}`;
    } else if (anything.className) {
      return `.${anything.className}`;
    }

    return "(No HTML identifier available)";
  }

  if (typeof Event !== "undefined" && anything instanceof Event) {
    return inspect(getEventDetails(anything));
  }

  return inspect(anything);
}

export default pretty;
