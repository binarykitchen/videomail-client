import { VideomailClientOptions } from "../../../types/options";
import createError from "../../error/createError";

function figureMinHeight(height: number, options: VideomailClientOptions) {
  let minHeight: number | undefined;

  if (options.video.height) {
    minHeight = Math.min(options.video.height, height);

    if (minHeight < 1) {
      throw createError({
        message: `Got a min height less than 1 (${minHeight})!`,
        options,
      });
    }
  } else {
    minHeight = height;
  }

  return minHeight;
}

export default figureMinHeight;
