import { Dimension } from "../../../types/dimension";
import { VideomailClientOptions } from "../../../types/options";
import createError from "../../error/createError";

// A viewport-based estimate. It does not cover every layout yet.
function limitHeight(
  height: number | undefined,
  options: VideomailClientOptions,
  // TODO Remove once the sizing issue is tracked down.
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
