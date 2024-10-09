import { VideomailClientOptions } from "../../types/options";

function toNumber(dimension: string | number | undefined) {
  if (typeof dimension === "string") {
    return parseInt(dimension);
  }

  return dimension;
}

function hasDefinedWidth(options: VideomailClientOptions) {
  return options.video.width && options.video.width !== "auto";
}

function hasDefinedHeight(options: VideomailClientOptions) {
  return options.video.height && options.video.height !== "auto";
}

function hasDefinedDimension(options: VideomailClientOptions) {
  return hasDefinedWidth(options) || hasDefinedHeight(options);
}

export { hasDefinedWidth, hasDefinedHeight, hasDefinedDimension, toNumber };
