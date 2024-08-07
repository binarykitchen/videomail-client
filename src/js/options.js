import { version } from "../../package.json";

const PRODUCTION = process.env.NODE_ENV === "production";

/* eslint-disable no-multi-spaces */
/* eslint indent: ["error", 2, { "ignoreComments": true }] */

export default {
  logger: null, // define logging instance. leave null for default, console.
  logStackSize: 30, // limits the stack size of log outputs to collect
  verbose: !PRODUCTION, // set true to log more info
  baseUrl: "https://videomail.io", // leave as it, permanent url to post videos
  socketUrl: "wss://videomail.io", // leave as it, permanent url to send frames
  siteName: "videomail-client-demo", // Required for API, use https://videomail.io/whitelist
  cache: true, // reduces GET queries when loading videos
  insertCss: true, // inserts predefined CSS, see examples
  enablePause: true, // enable pause/resume button
  enableAutoPause: true, // automatically pauses when window becomes inactive
  enableSpace: true, // hitting space can pause recording
  submitWithVideomail: false, // when enabled, all videomail metadata is submitted
  // under the `videomail` key inside the form data body.
  disableSubmit: false, // set this to true if you do not want to submit videos,
  // but just want to record and replay these temporarily
  enableAutoValidation: true, // automatically validates all form inputs if any exist and
  /*
   * does not /enable disable submit button after recording
   * when something else seems invalid.
   */
  enableAutoSubmission: true, // automatically submits the form where the videomail-client
  /*
   * appears upon press of submit button. disable it when
   * you want a framework to deal with the form submission itself.
   */

  enctype: "application/json", // enctype for the form submission. currently implemented are:
  // 'application/json' and 'application/x-www-form-urlencoded'

  // default CSS selectors you can alter, see examples
  selectors: {
    containerId: "videomail",
    replayClass: "replay",
    userMediaClass: "userMedia",
    visualsClass: "visuals",
    buttonClass: null, // can also be used as a default class for all buttons
    buttonsClass: "buttons",

    recordButtonClass: "record",
    pauseButtonClass: "pause",
    resumeButtonClass: "resume",
    previewButtonClass: "preview",
    recordAgainButtonClass: "recordAgain",
    submitButtonClass: "submit",

    subjectInputName: "subject", // the form input name for subject
    fromInputName: "from", // the form input name for the from email
    toInputName: "to", // the form input name for the to email
    ccInputName: "cc", // the form input name for the cc email
    bccInputName: "bcc", // the form input name for the bcc email
    bodyInputName: "body", // the form input name for the message (body)
    sendCopyInputName: "sendCopy", // the form checkbox name for sending myself a copy

    keyInputName: "videomail_key",
    parentKeyInputName: "videomail_parent_key",
    aliasInputName: "videomail_alias",

    formId: null, // automatically detects form if any
    submitButtonId: null, // semi-automatically detects submit button in the form
    // but if that does not work, try using the
    submitButtonSelector: null, // submitButtonSelector
  },

  audio: {
    enabled: false, // set to true for experimental audio recording
    switch: false, // enables a switcher for audio recording (on/off)
    volume: 0.2, // must be between 0 .. 1 but 0.20 is recommended to avoid
    // distorting at the higher volume peaks
    bufferSize: "auto", // decides how often the audio is being sampled,
    /*
     * can be 'auto' or an integer being a power of two like 512 or 2048
     * the higher the less traffic, but harder to adjust with rubberband
     * to match with the video length on server side during encoding
     */
  },

  video: {
    fps: 15, // depends on your connection
    limitSeconds: 30, // recording automatically stops after that limit
    countdown: 3, // set it to 0 or false to disable it

    /*
     * it is recommended to set one dimension only and leave the other one to auto
     * because each webcam has a different aspect ratio
     */

    width: "auto", // or use an integer for exact pixels
    height: "auto", // or use an integer for exact pixels
    facingMode: "user", // can be 'user', 'environment', 'left' or 'right'. useful for mobiles.
    facingModeButton: false,

    stretch: false, // Set to true if you want the video to take the full width of the parent container
  },

  image: {
    quality: 0.42,
    types: ["webp", "jpeg"], // recommended settings to make most of all browsers
  },

  // alter these text for internationalisation
  text: {
    pausedHeader: "Paused",
    pausedHint: null,
    sending: "Teleporting",
    encoding: "Encoding",
    limitReached: "Limit reached",
    audioOff: "Audio off",
    audioOn: "Audio on",
    buttons: {
      record: "Record video",
      recordAgain: "Record again",
      resume: "Resume",
      pause: "Pause",
      preview: "Preview",
    },
  },

  notifier: {
    entertain: false, // when true, user is entertained while waiting, see examples
    entertainClass: "bg",
    entertainLimit: 6,
    entertainInterval: 9000,
  },

  timeouts: {
    userMedia: 20e3, // in milliseconds, increase if you want user give more time to enable webcam
    connection: 1e4, // in seconds, increase if api is slow
    pingInterval: 35e3, // in milliseconds, keeps web stream (connection) alive when pausing
  },

  loadUserMediaOnRecord: false, // when true, user media is loaded only when record button is pressed

  callbacks: {
    /*
     * a custom callback to tweak form data before posting to server
     * this is for advanced use only and shouldn't be used if possible
     */
    adjustFormDataBeforePosting: null,
  },

  defaults: {
    from: null, // define default FROM email address
    to: null, // define default TO email address
    cc: null, // define default CC email address
    bcc: null, // define default BCC email address
    subject: null, // define default subject line
    body: null, // define default body content
  },

  /*
   * a special flag to indicate that everything to be initialised
   * serves only for playing existing videomails with the replay function
   */
  playerOnly: false,

  // show errors inside the container?
  displayErrors: true,

  // true = all form inputs get disabled and disappear when browser can't record
  adjustFormOnBrowserError: false,

  /*
   * when true, any errors will be sent to the videomail server for analysis
   * ps: can be a function too returning a boolean
   */
  reportErrors: false,

  // just for testing purposes to simulate browser agent handling
  fakeUaString: null,

  version,
};
