import { VideomailClientOptions } from "../../../types/options";
import createError from "../../error/createError";

function figureMinHeight(height: number | undefined, options: VideomailClientOptions) {
  let minHeight: number | undefined;

  if (options.video.height) {
    if (height) {
      minHeight = Math.min(options.video.height, height);
    } else {
      minHeight = options.video.height;
    }

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
