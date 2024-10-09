import { VideomailClientOptions } from "../../../types/options";

function getRatio(
  options: VideomailClientOptions,
  videoHeight?: number,
  videoWidth?: number,
) {
  // just a default one when no computations are possible
  let ratio = 1;

  const hasVideoDimensions = videoHeight && videoWidth;

  const desiredHeight = options.video.height;
  const desiredWidth = options.video.width;

  const hasDesiredDimensions = desiredHeight && desiredWidth;

  if (hasDesiredDimensions) {
    if (hasVideoDimensions) {
      // figure out first which one to pick
      if (videoHeight < desiredHeight || videoWidth < desiredWidth) {
        ratio = videoHeight / videoWidth;
      } else {
        ratio = desiredHeight / desiredWidth;
      }
    } else {
      ratio = desiredHeight / desiredWidth;
    }
  } else if (hasVideoDimensions) {
    ratio = videoHeight / videoWidth;
  }

  return ratio;
}

export default getRatio;
