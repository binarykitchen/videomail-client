// taken from
// https://bbc.github.io/tal/jsdoc/events_mediaevent.js.html

export default [
  // The user agent begins looking for media data, as part of
  // the resource selection algorithm.
  'loadstart',

  // The user agent is intentionally not currently fetching media data,
  // but does not have the entire media resource downloaded. networkState equals NETWORK_IDLE
  'suspend',

  // Playback has begun. Fired after the play() method has returned,
  // or when the autoplay attribute has caused playback to begin.
  // paused is newly false.
  // 'play', commented out since it has special treatment

  // The user agent has just determined the duration and dimensions of the
  // media resource and the timed tracks are ready.
  // readyState is newly equal to HAVE_METADATA or greater for the first time.
  // 'loadedmetadata', commented out since it has special treatment

  // The user agent is fetching media data.
  'progress',

  // The user agent is intentionally not currently fetching media data,
  // but does not have the entire media resource downloaded.
  // 'suspend', // commented out, we are already listening to it in code

  // Event The user agent stops fetching the media data before it is completely downloaded,
  // but not due to an error.  error is an object with the code MEDIA_ERR_ABORTED.
  'abort',

  // A media element whose networkState was previously not in the NETWORK_EMPTY
  // state has just switched to that state (either because of a fatal error
  // during load that's about to be reported, or because the load() method was
  // invoked while the resource selection algorithm was already running).
  'emptied',

  // The user agent is trying to fetch media data, but data is
  // unexpectedly not forthcoming
  'stalled',

  // Playback has been paused. Fired after the pause() method has returned.
  // paused is newly true.
  'pause',

   // The user agent can render the media data at the current playback position
   // for the first time.
   // readyState newly increased to HAVE_CURRENT_DATA or greater for the first time.
  'loadeddata',

  // Playback has stopped because the next frame is not available, but the user
  // agent expects that frame to become available in due course.
  // readyState is newly equal to or less than HAVE_CURRENT_DATA,
  // and paused is false. Either seeking is true, or the current playback
  // position is not contained in any of the ranges in buffered.
  // It is possible for playback to stop for two other reasons without
  // paused being false, but those two reasons do not fire this event:
  // maybe playback ended, or playback stopped due to errors.
  'waiting',

  // Playback has started. readyState is newly equal to or greater than
  // HAVE_FUTURE_DATA, paused is false, seeking is false,
  // or the current playback position is contained in one of the ranges in buffered.
  'playing',

  // The user agent can resume playback of the media data,
  // but estimates that if playback were to be started now, the media resource
  // could not be rendered at the current playback rate up to its end without
  // having to stop for further buffering of content.
  // readyState newly increased to HAVE_FUTURE_DATA or greater.
  'canplay',

  // The user agent estimates that if playback were to be started now,
  // the media resource could be rendered at the current playback rate
  // all the way to its end without having to stop for further buffering.
  // readyState is newly equal to HAVE_ENOUGH_DATA.
  'canplaythrough',

  // The seeking IDL attribute changed to true and the seek operation is
  // taking long enough that the user agent has time to fire the event.
  'seeking',

  // The seeking IDL attribute changed to false.
  'seeked',

  // Playback has stopped because the end of the media resource was reached.
  // currentTime equals the end of the media resource; ended is true.
  'ended',

  // Either the defaultPlaybackRate or the playbackRate attribute
  // has just been updated.
  'ratechange',

  // The duration attribute has just been updated.
  'durationchange',

  // Either the volume attribute or the muted attribute has changed.
  // Fired after the relevant attribute's setter has returned.
  'volumechange'

  // commented out, happen too often

  // The current playback position changed as part of normal playback or in
  // an especially interesting way, for example discontinuously.
  // 'timeupdate'
]
