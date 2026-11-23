import getEventDetails from "../error/getEventDetails";

// Long enough for an object's gist, short enough to keep collected logs readable.
const MAX_PRETTY_LENGTH = 1_000;

function isEvent(value: unknown): value is Event {
  // Event is missing outside browser-like environments.
  return typeof Event !== "undefined" && value instanceof Event;
}

function describeElement(element: HTMLElement) {
  if (element.id) {
    return `#${element.id}`;
  } else if (element.className) {
    return `.${element.className}`;
  }

  return "(No HTML identifier available)";
}

/*
 * JSON, plus the things JSON cannot express on its own: elements, events, errors,
 * functions, big integers and circular references. Cheap enough for any log line,
 * unlike node:util's inspect(), which also needed a Node polyfill in browsers.
 */
function stringify(value: unknown) {
  // JSON has no text for undefined.
  if (value === undefined) {
    return "undefined";
  }

  const seen = new WeakSet<object>();

  return JSON.stringify(value, (_key, nested: unknown) => {
    if (nested instanceof HTMLElement) {
      return describeElement(nested);
    }

    if (isEvent(nested)) {
      return getEventDetails(nested);
    }

    if (nested instanceof Error) {
      return describeError(nested);
    }

    if (typeof nested === "function") {
      return `[Function ${nested.name || "anonymous"}]`;
    }

    if (typeof nested === "bigint") {
      return `${nested}n`;
    }

    if (typeof nested === "symbol") {
      return nested.toString();
    }

    if (typeof nested === "object" && nested !== null) {
      if (seen.has(nested)) {
        return "[Circular]";
      }

      seen.add(nested);
    }

    return nested;
  });
}

// Errors serialize to {} in JSON. Spell out what matters instead.
function describeError(error: Error) {
  const description = `${error.name}: ${error.message}`;

  if (error.cause === undefined) {
    return description;
  }

  return `${description} (cause: ${stringify(error.cause)})`;
}

function truncate(text: string) {
  if (text.length <= MAX_PRETTY_LENGTH) {
    return text;
  }

  return `${text.slice(0, MAX_PRETTY_LENGTH)} …`;
}

// Prettifies anything for log lines and explanations, in one line
function pretty(anything: unknown) {
  if (anything instanceof HTMLElement) {
    return describeElement(anything);
  }

  if (anything instanceof Error) {
    return truncate(describeError(anything));
  }

  if (isEvent(anything)) {
    return truncate(stringify(getEventDetails(anything)));
  }

  return truncate(stringify(anything));
}

export default pretty;
