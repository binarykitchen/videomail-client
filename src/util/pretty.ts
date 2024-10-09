import util from "node:util";

function inspect(element: unknown) {
  return util
    .inspect(element, {
      colors: true,
      compact: true,
      depth: 4,
      breakLength: Infinity,
    })
    .replace(/\s+/gu, " ")
    .replace(/\r?\n/gu, "");
}

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
