import { Dimension } from "../../../types/dimension";
import { VideomailClientOptions } from "../../../types/options";
import createError from "../../error/createError";
import figureMinHeight from "./figureMinHeight";
import getRatio from "./getRatio";
import limitWidth from "./limitWidth";

function calculateHeight(
  responsive: boolean,
  videoWidth: number | undefined,
  options: VideomailClientOptions,
  target: string,
  ratio?: number,
  element?: HTMLElement | null,
) {
  const dimension: Dimension = {
    unit: "px",
  };

  let width: number | undefined = videoWidth;

  if (width !== undefined && width < 1) {
    throw createError({
      message: `Unable to calculate height for target ${target} when width is less than 1 (= ${width}) and responsive mode is set to ${responsive}`,
      options,
    });
  } else if (responsive && element) {
    const limitedDimension = limitWidth(element, options, width);
    width = limitedDimension.value;
  }

  const chosenRatio = ratio ?? getRatio(options, undefined, videoWidth);
  const height = width ? Math.round(width * chosenRatio) : undefined;

  if (height && Number.isInteger(height) && height < 1) {
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
