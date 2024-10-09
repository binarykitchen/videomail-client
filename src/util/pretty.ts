import stringify from "safe-json-stringify";

const DASH = "- ";
const SEPARATOR = `<br/>${DASH}`;

function arrayToString(array?: any[]) {
  if (!array || array.length === 0) {
    return;
  }

  const lines: string[] = [];

  array.forEach(function (element) {
    if (element) {
      lines.push(stringify(element));
    }
  });

  return DASH + lines.join(SEPARATOR);
}

interface ObjectToStringOptions {
  excludes?: string[];
}

function objectToString(object, options?: ObjectToStringOptions) {
  const propertyNames = Object.getOwnPropertyNames(object);
  const excludes = options?.excludes ?? [];
  const lines: string[] = [];
  let sLines;

  // always ignore these
  excludes.push("stack");

  if (propertyNames.length > 0) {
    let exclude = false;

    propertyNames.forEach(function (name) {
      exclude = excludes.includes(name);

      if (!exclude && object[name]) {
        /*
         * this to cover this problem:
         * https://github.com/binarykitchen/videomail-client/issues/157
         */
        lines.push(stringify(object[name]));
      }
    });
  }

  if (lines.length === 1) {
    sLines = lines.join();
  } else if (lines.length > 1) {
    sLines = DASH + lines.join(SEPARATOR);
  }

  return sLines;
}

export default function (anything: unknown, options?: ObjectToStringOptions) {
  if (anything === null) {
    return "null";
  } else if (typeof anything === "undefined") {
    return "undefined";
  } else if (typeof anything === "string") {
    return anything;
  } else if (Array.isArray(anything)) {
    return arrayToString(anything);
  } else if (anything instanceof HTMLElement) {
    if (anything.id) {
      return `#${anything.id}`;
    } else if (anything.className) {
      return `.${anything.className}`;
    }
    return "(No HTML identifier available)";
  } else if (typeof anything === "object") {
    return objectToString(anything, options);
  }

  return anything;
}
