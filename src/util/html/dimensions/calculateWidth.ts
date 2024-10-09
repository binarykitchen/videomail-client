import { VideomailClientOptions } from "../../../types/options";
import createError from "../../error/createError";
import figureMinHeight from "./figureMinHeight";
import getRatio from "./getRatio";
import limitHeight from "./limitHeight";

function calculateWidth(
  responsive: boolean,
  videoHeight: number,
  options: VideomailClientOptions,
  ratio?: number,
) {
  let height = figureMinHeight(videoHeight, options);

  if (responsive) {
    height = limitHeight(height, options);
  }

  if (!height || height < 1) {
    throw createError({
      message: "Height cannot be smaller than 1 when calculating width.",
      options,
    });
  }

  const chosenRatio = ratio ?? getRatio(options, videoHeight);
  const calculatedWidth = Math.round(height / chosenRatio);

  if (calculatedWidth < 1) {
    throw createError({
      message: "Calculated width cannot be smaller than 1!",
      options,
    });
  }

  return calculatedWidth;
}

export default calculateWidth;
