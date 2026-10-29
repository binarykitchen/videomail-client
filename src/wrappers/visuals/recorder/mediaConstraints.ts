import type { Dimension } from "../../../types/dimension";
import type { VideomailUserMediaReadyParams } from "../../../types/events/params";
import type { VideomailClientOptions } from "../../../types/options";
import { isAudioEnabled } from "../../../util/options/audio";

interface UserMediaConstraintsParams {
  options: VideomailClientOptions;
  facingMode: ConstrainDOMString;
  limitedWidth?: Dimension | undefined;
  userMediaParams?: VideomailUserMediaReadyParams | undefined;
}

function createUserMediaConstraints({
  options,
  facingMode,
  limitedWidth,
  userMediaParams,
}: UserMediaConstraintsParams) {
  const video: MediaTrackConstraints = {
    facingMode: userMediaParams?.switchingFacingMode || facingMode,
    frameRate: { ideal: options.video.fps },
  };

  if (options.video.width) {
    video.width = { ideal: options.video.width };
  } else if (limitedWidth?.value) {
    video.width = { ideal: limitedWidth.value };
  }

  if (options.video.height) {
    video.height = { ideal: options.video.height };
  }

  return {
    audio: isAudioEnabled(options),
    video,
  };
}

export default createUserMediaConstraints;
