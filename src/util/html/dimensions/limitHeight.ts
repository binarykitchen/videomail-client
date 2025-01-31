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
  if (height === undefined) {
    throw createError({
      message: `Passed limit-height argument height cannot be undefined (Called from ${calledFrom})`,
      options,
    });
  } else if (height < 1) {
    throw createError({
      message: `Passed limit-height argument ${height} cannot be less than 1! (Called from ${calledFrom})`,
      options,
    });
  }

  const limitedHeight = Math.min(
    height,
    // document.body.scrollHeight,
    document.documentElement.clientHeight,
  );

  if (limitedHeight < 1) {
    throw createError({
      message: `Limited height ${limitedHeight} cannot be less than 1!`,
      options,
    });
  }

  return limitedHeight;
}

export default limitHeight;
