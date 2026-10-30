// Event reference: https://bbc.github.io/tal/jsdoc/events_mediaevent.js.html

const MEDIA_EVENTS = [
  // The browser starts looking for media.
  "loadstart",

  // Fetching is paused, though the download is incomplete (NETWORK_IDLE).
  "suspend",

  // 'play' and 'loadedmetadata' have their own handlers.

  // Media data is arriving.
  "progress",

  // Fetching stopped before the download finished.
  "abort",

  // The element returned to NETWORK_EMPTY after a load reset or failure.
  "emptied",

  // The browser is waiting for data that has stopped arriving.
  "stalled",

  // Playback paused.
  "pause",

  // The first frame at the current position is ready (HAVE_CURRENT_DATA).
  "loadeddata",

  // Playback needs more data. This is buffering, not a pause, end, or error.
  "waiting",

  // Playback has started or resumed after buffering.
  "playing",

  // Playback can start, but may need to buffer later (HAVE_FUTURE_DATA).
  "canplay",

  // The browser expects to play through without buffering (HAVE_ENOUGH_DATA).
  "canplaythrough",

  // Moving to a new playback position.
  "seeking",

  // The new playback position is ready.
  "seeked",

  // Playback reached the end.
  "ended",

  // The default or current playback speed changed.
  "ratechange",

  // The media duration changed.
  "durationchange",

  // The volume or mute setting changed.
  "volumechange",

  // Skip 'timeupdate': it fires too often for logging.
];

export default MEDIA_EVENTS;
