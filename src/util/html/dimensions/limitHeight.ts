import { Dimension } from "../../../types/dimension";
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
  const dimension: Dimension = {
    unit: "px",
  };

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

  dimension.value = limitedHeight;

  return dimension;
}

export default limitHeight;
