var keymirror = require('keymirror')

module.exports = keymirror({
  FORM_READY:           null, // form is ready, available in the DOM
  USER_MEDIA_READY:     null, // user media (= webcam) is ready, loaded
  CONNECTED:            null, // socket is connected to server
  COUNTDOWN:            null, // countdown for recording has started
  RECORDING:            null, // webcam is recording
  STOPPING:             null, // recording is being stopped (= preview)
  PROGRESS:             null, // start processing
  BEGIN_AUDIO_ENCODING: null, // encoding video
  BEGIN_VIDEO_ENCODING: null, // encoding video
  RESETTING:            null, // resetting everything to go back to initial state
  PAUSED:               null, // recording is being paused
  RESUMING:             null, // recording is resumed
  PREVIEW:              null, // video preview is set
  PREVIEW_SHOWN:        null, // video preview is shown
  REPLAY_SHOWN:         null, // submitted video is shown
  INVALID:              null, // form is invalid
  VALIDATING:           null, // form is being validated
  VALID:                null, // form is valid
  SUBMITTING:           null, // form is being submitted
  SUBMITTED:            null, // form has been successfully submitted
  ERROR:                null, // an error occured
  BLOCKING:             null, // something serious, most likely an error, is shown and blocks
  SENDING_FIRST_FRAME:  null, // emitted before the first frame is being computed
  FIRST_FRAME_SENT:     null, // emitted once when fist frame has been sent to server
  HIDE:                 null, // emitted when hidden
  NOTIFYING:            null, // notifies user about something (not blocking)
  LOADED_META_DATA:     null  // raised when webcam knows its dimensions
})
