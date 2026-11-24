import type { Dimension } from "../../../types/dimension";
import type { VideomailClientOptions } from "../../../types/options";
import createError from "../../error/createError";
import figureMinHeight from "./figureMinHeight";
import getRatio from "./getRatio";
import isNegativeHeight from "./isNegativeHeight";
import limitWidth from "./limitWidth";
function calculateHeight(
  responsive: boolean,
  videoWidth: number | undefined,
  options: VideomailClientOptions,
  ratio?: number,
  element?: HTMLElement | null,
) {
  const dimension: Dimension = {
    unit: "px",
  };

  let width: number | undefined = videoWidth;

  if (responsive && element) {
    const limitedDimension = limitWidth(element, options, width);
    width = limitedDimension.value;
  }

  const chosenRatio = ratio ?? getRatio(options, undefined, videoWidth);
  const height = width ? Math.round(width * chosenRatio) : undefined;

  if (isNegativeHeight(height)) {
    throw createError({
      message: "Just calculated a height less than 1 which is wrong.",
      options,
    });
  }

  const minHeight = figureMinHeight(height, options);

  dimension.value = minHeight;

  return dimension;
}

export default calculateHeight;
