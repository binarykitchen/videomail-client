import { VideomailClientOptions } from "../../types/options";

/*
 * Fixed width and height without stretch reserve one responsive frame. The camera
 * preview, notices and replays all fill it, so the layout stays put between takes.
 */
function hasFixedVideoFrame(options: Pick<VideomailClientOptions, "video">) {
  const { width, height, stretch } = options.video;

  return !stretch && Boolean(width) && Boolean(height);
}

export default hasFixedVideoFrame;
