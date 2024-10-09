import { VideomailClientOptions } from "../../../types/options";
import createError from "../../error/createError";
import figureMinHeight from "./figureMinHeight";
import getRatio from "./getRatio";
import limitWidth from "./limitWidth";

function calculateHeight(
  responsive: boolean,
  videoWidth: number,
  options: VideomailClientOptions,
  ratio?: number,
  element?: HTMLElement | null,
) {
  let width = videoWidth;

  if (width < 1) {
    throw createError({
      message: "Unable to calculate height when width is less than 1.",
      options,
    });
  } else if (responsive && element) {
    width = limitWidth(element, options, width);
  }

  const chosenRatio = ratio ?? getRatio(options, undefined, videoWidth);
  const height = Math.round(width * chosenRatio);

  if (Number.isInteger(height) && height < 1) {
    throw createError({
      message: "Just calculated a height less than 1 which is wrong.",
      options,
    });
  }

  return figureMinHeight(height, options);
}

export default calculateHeight;
