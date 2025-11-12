import { Dimension } from "../../../types/dimension";
import { VideomailClientOptions } from "../../../types/options";
import createError from "../../error/createError";
import getOuterWidth from "./getOuterWidth";

function limitWidth(
  element: HTMLElement,
  options: VideomailClientOptions,
  width?: number,
) {
  const limitedDimension: Dimension = {
    unit: "px",
  };

  let limitedWidth: number;

  const outerWidth = getOuterWidth(element);

  if (width && typeof width === "number") {
    // only when that element has a defined width, apply this logic
    limitedWidth = outerWidth > 0 && outerWidth < width ? outerWidth : width;
  } else {
    // else apply the outer width when the element has no defined width yet
    limitedWidth = outerWidth;
  }

  if (Number.isInteger(limitedWidth) && limitedWidth < 1) {
    throw createError({ message: "Limited width cannot be less than 1!", options });
  }

  limitedDimension.value = limitedWidth;

  return limitedDimension;
}

export default limitWidth;
