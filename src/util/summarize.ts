export type Contents = Record<
  string,
  string | number | boolean | undefined | Record<string, unknown>
>;

import pretty from "./pretty";

function summarize(title: string, contents: Contents) {
  const lines = Object.entries(contents)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => {
      const formattedValue =
        value === undefined
          ? "undefined"
          : typeof value === "object"
            ? pretty(value)
            : value;

      return `  • ${key}: ${formattedValue}`;
    });

  const line = [`🔎 ${title}`, ...lines].join("\n");

  return line;
}

export default summarize;
