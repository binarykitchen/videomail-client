import type { VideomailCommandArgs } from "../../../types/command";
import type { VideomailClientOptions } from "../../../types/options";
import createError from "../../../util/error/createError";

type ProgressKind = "frame" | "sample";

interface ConfirmedProgressParams {
  args?: VideomailCommandArgs | undefined;
  kind: ProgressKind;
  options: VideomailClientOptions;
}

function calculateProgress(confirmedCount: number, totalCount: number) {
  return `${((confirmedCount / (totalCount || 1)) * 100).toFixed(2)}%`;
}

function getConfirmedProgressNumber({ args, kind, options }: ConfirmedProgressParams) {
  const label = kind === "frame" ? "frame" : "audio sample";

  if (!args) {
    throw createError({
      message: `Arguments are missing for updating the ${label} progress`,
      options,
    });
  }

  const confirmedNumber = args[kind];

  if (!confirmedNumber) {
    throw createError({
      message: `The ${label} number is missing`,
      options,
    });
  }

  return confirmedNumber;
}

export { calculateProgress, getConfirmedProgressNumber };
