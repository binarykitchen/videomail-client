import { VideomailClientOptions } from "./types/options";
import isProduction from "./util/env/isProduction";

const PRODUCTION = isProduction();

const options: VideomailClientOptions = {
  logger: console, // Swap in your own logger if needed.
  logStackSize: 30, // Recent log lines to keep in memory.
  verbose: !PRODUCTION, // Show debug output.
  apiUrl: "https://videomail.io/api", // API endpoint for videos.
  socketUrl: "wss://videomail.io/ws", // WebSocket endpoint for frames.
  whitelistKey: "videomail-client-demo", // Get your key at https://videomail.io/whitelist.
  enablePause: true, // Show pause/resume controls.
  enableAutoPause: true, // Pause when the page becomes inactive.
  enableSpace: true, // Let the space bar pause recording.
  submitWithVideomail: false, // Include full metadata under `videomail` in your form submission.
  disableSubmit: false, // Set true to record and replay without submitting.
  enableAutoValidation: true, // Validate form inputs and update the submit button.
  enableAutoUnload: true, // Release resources when leaving the page.
  enableAutoSubmission: true, // Set false if your app handles form submission.

  // Supports 'application/json' and 'application/x-www-form-urlencoded'.
  enctype: "application/json",

  // Match these to your markup. See the Storybook examples.
  selectors: {
    containerId: undefined,
    containerClass: "videomail",
    replayClass: "replay",
    userMediaClass: "userMedia",
    visualsClass: "visuals",
    buttonClass: undefined, // Optional shared class for all buttons.
    buttonsClass: "buttons",

    recordButtonClass: "record",
    pauseButtonClass: "pause",
    resumeButtonClass: "resume",
    previewButtonClass: "preview",
    recordAgainButtonClass: "recordAgain",
    submitButtonClass: "submit",

    subjectInputName: "subject",
    fromInputName: "from",
    toInputName: "to",
    ccInputName: "cc",
    bccInputName: "bcc",
    bodyInputName: "body",
    sendCopyInputName: "sendCopy", // Checkbox for sending yourself a copy.

    keyInputName: "videomail_key",
    parentKeyInputName: "videomail_parent_key",

    formId: undefined, // Auto-detect the nearest form.
    submitButtonId: undefined, // Auto-detect its submit button.
    submitButtonSelector: undefined, // Use this if auto-detection needs a hand.
  },

  audio: {
    enabled: false, // Opt in to audio recording.
    switch: false, // Let users toggle audio.
    // Recording gain from 0 (silence) to 1 (unchanged microphone level).
    volume: 1,
    /*
     * PCM frames per batch, not the sample rate.
     * Use 'auto' for 2048, or a power of two from 256 to 16384.
     * Smaller batches arrive sooner; larger batches mean fewer messages.
     */
    bufferSize: "auto",
  },

  video: {
    fps: 15, // The connection may limit the actual frame rate.
    limitSeconds: 30, // Stop recording at this limit.
    countdown: 3, // Set 0 or false to skip the countdown.

    // Set one dimension in pixels. Let the camera's aspect ratio decide the other.
    width: undefined,
    height: undefined,
    facingMode: "user", // Initial camera: 'user', 'environment', 'left', or 'right'.
    facingModeButton: false,

    stretch: false, // Fill the parent container's width.

    // Use full width below this breakpoint.
    mobileBreakPoint: undefined,

    // Let the user choose when to play.
    autoPlay: undefined,
  },

  image: {
    quality: 0.42,
    types: ["webp", "jpeg"], // Try WebP first, then JPEG.
  },

  // Translate or customize the UI text here.
  text: {
    pausedHeader: "Paused",
    pausedHint: undefined,
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
    entertain: false, // Show animations while waiting. See the examples.
    entertainClass: "bg",
    entertainLimit: 6,
    entertainInterval: 9000,
  },

  timeouts: {
    userMedia: 20e3, // Milliseconds to allow for camera permission.
    connection: 1e4, // Milliseconds to wait for the connection.
    pingInterval: 30e3, // Keep the connection alive while paused, in milliseconds.
  },

  loadUserMediaOnRecord: false, // Wait for Record before asking for camera access.

  callbacks: {
    /*
     * Advanced: adjust form data before sending. Prefer the standard options.
     */
    adjustFormDataBeforePosting: undefined,

    // Adjust a value before filling in the form.
    adjustFormValueBeforePopulating: undefined,
  },

  defaults: {
    from: undefined,
    to: undefined,
    cc: undefined,
    bcc: undefined,
    subject: undefined,
    body: undefined,
  },

  // Show errors inside the container.
  displayErrors: true,

  // Hide and disable form inputs if the browser cannot record.
  adjustFormOnBrowserError: true,

  // Send error reports to Videomail for troubleshooting.
  reportErrors: true,

  // WordPress integrations can set false to avoid clashes with other plugins.
  disableFormWhenSubmitting: true,

  // Override the user agent for tests.
  fakeUaString: undefined,

  // Experimental: resize the video area when the window changes size.
  recalculateDimensionsOnWindowResize: false,

  versions: {
    videomailNinjaFormPlugin: undefined,
  },
};

export default options;
