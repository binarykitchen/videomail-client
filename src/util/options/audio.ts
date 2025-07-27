import { VideomailClientOptions } from "../../types/options";

function isAudioEnabled(options: VideomailClientOptions) {
  return Boolean(options.audio.enabled);
}

// TODO Change to state
function setAudioEnabled(enabled: boolean, options: VideomailClientOptions) {
  options.audio.enabled = enabled;

  return options;
}

function isAutoPauseEnabled(options: VideomailClientOptions) {
  return options.enableAutoPause && options.enablePause;
}

export { isAudioEnabled, isAutoPauseEnabled,setAudioEnabled };
