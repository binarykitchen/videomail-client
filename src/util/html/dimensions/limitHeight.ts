import { VideomailClientOptions } from "../../../types/options";
import createError from "../../error/createError";

/*
 * This is difficult to compute and is not entirely correct.
 * But good enough for now to ensure some stability.
 */
function limitHeight(
  height: number | undefined,
  options: VideomailClientOptions,
  // TODO Remove later once we have narrowed it down
  calledFrom: string,
) {
  // Or consider document.body.scrollHeight
  let limitedHeight = document.documentElement.clientHeight;

  if (height) {
    limitedHeight = Math.min(height, limitedHeight);
  }

  if (limitedHeight < 1) {
    throw createError({
      message: `Limited height ${limitedHeight} cannot be less than 1! (Called from ${calledFrom})`,
      options,
    });
  }

  return limitedHeight;
}

export default limitHeight;
