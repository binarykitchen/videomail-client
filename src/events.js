import keymirror from 'keymirror'

export default keymirror({
  BUILT: null, // all dom elements are ready, are in the DOM
  FORM_READY: null, // form is ready, available in the DOM
  LOADING_USER_MEDIA: null, // asking for webcam access
  USER_MEDIA_READY: null, // user media (= webcam) is ready, loaded
  CONNECTING: null, // socket is connecting to server
  CONNECTED: null, // socket is connected to server
  DISCONNECTED: null, // socket to server is disconnected
  COUNTDOWN: null, // countdown for recording has started
  RECORDING: null, // webcam is recording
  STOPPING: null, // recording is being stopped (= preview)
  PROGRESS: null, // start sending
  BEGIN_AUDIO_ENCODING: null, // encoding video
  BEGIN_VIDEO_ENCODING: null, // encoding video
  RESETTING: null, // resetting everything to go back to initial state
  PAUSED: null, // recording is being paused
  RESUMING: null, // recording is resumed
  PREVIEW: null, // video preview is set
  PREVIEW_SHOWN: null, // video preview is shown
  REPLAY_SHOWN: null, // submitted video is shown
  INVALID: null, // form is invalid
  VALIDATING: null, // form is being validated
  VALID: null, // form is valid
  SUBMITTING: null, // form is being submitted
  SUBMITTED: null, // form has been successfully submitted
  ERROR: null, // an error occured
  BLOCKING: null, // something serious, most likely an error, is shown and blocks
  SENDING_FIRST_FRAME: null, // emitted before the first frame is being computed
  FIRST_FRAME_SENT: null, // emitted once when fist frame has been sent to server
  HIDE: null, // emitted when hidden
  NOTIFYING: null, // notifies user about something (not blocking)
  ENABLING_AUDIO: null, // about to enable audio
  DISABLING_AUDIO: null, // about to disable audio
  LOADED_META_DATA: null, // raised when webcam knows its dimensions
  EVENT_EMITTED: null, // for debugging only, is emitted when an event is emitted lol,
  GOING_BACK: null, // going back, starting all over again,
  ASKING_WEBCAM_PERMISSION: null, // when about to ask for webcam permissions
  VISIBLE: null, // document just became visible
  INVISIBLE: null  // document just became INvisible
})
