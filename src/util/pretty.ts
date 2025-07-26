import util from "node:util";

function inspect(element: unknown) {
  return util
    .inspect(element, {
      colors: false,
      compact: true,
      depth: 4,
      breakLength: Infinity,
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

  return inspect(anything);
}

export default pretty;
