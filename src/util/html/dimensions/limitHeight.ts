import { VideomailClientOptions } from "../../../types/options";
import createError from "../../error/createError";

/*
 * this is difficult to compute and is not entirely correct.
 * but good enough for now to ensure some stability.
 */
function limitHeight(height: number | undefined, options: VideomailClientOptions) {
  if (!height || height < 1) {
    throw createError({
      message: "Passed limit-height argument cannot be less than 1!",
      options,
    });
  }

  const limitedHeight = Math.min(
    height,
    // document.body.scrollHeight,
    document.documentElement.clientHeight,
  );

  if (limitedHeight < 1) {
    throw createError({ message: "Limited height cannot be less than 1!", options });
  }

  return limitedHeight;
}

export default limitHeight;
