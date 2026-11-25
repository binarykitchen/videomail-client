import type { KnownProblem } from "./types";
import VideomailError from "./VideomailError";

const BROWSER_PROBLEM = [VideomailError.BROWSER_PROBLEM];
export const WEBCAM_PROBLEM = [VideomailError.WEBCAM_PROBLEM];

// Browsers use different names for the next three problems, so they share their words.
const PERMISSION_DENIED: KnownProblem = {
  message: "Permission denied",
  // Notices render as plain text; "\n" becomes a line break (white-space: pre-line).
  explanation:
    "We cannot access your webcam.\n" +
    "Please allow camera access in your browser settings. " +
    "Also check that no other app is using your webcam.",
  classList: WEBCAM_PROBLEM,
};

const WEBCAM_UNAVAILABLE: KnownProblem = {
  message: "Webcam is unavailable",
  explanation: "Another window may be using it. Close it and try again.",
  classList: WEBCAM_PROBLEM,
};

const WEBCAM_UNREADABLE: KnownProblem = {
  message: "Cannot access your webcam",
  explanation: "Another browser may be using it. Close it and try again.",
  classList: WEBCAM_PROBLEM,
};

/*
 * Friendly words for error names, built once when this module loads.
 *
 * That's only safe without import cycles, hence the import-x/no-cycle rule.
 * And it's a Map, so a name like "constructor" can't match Object.prototype.
 */
export const KNOWN_PROBLEMS = new Map(
  Object.entries<KnownProblem>({
    [VideomailError.SECURITY_ERROR]: {
      message: "Your browser blocked this action",
      explanation: "Check this page's camera permissions and security settings.",
      classList: BROWSER_PROBLEM,
    },
    MediaDeviceFailedDueToShutdown: {
      message: "Webcam is shutting down",
      explanation: "Wait for your webcam to finish switching off, then try again.",
    },
    SourceUnavailableError: {
      message: "Cannot access your webcam",
      explanation: "Another app may be using it, or there may be a hardware problem.",
    },
    PermissionDismissedError: {
      message: "Camera permission is needed",
      explanation:
        "The camera permission prompt was closed.\n" +
        "Please allow access when it appears again.",
      classList: WEBCAM_PROBLEM,
    },
    [VideomailError.NOT_ALLOWED_ERROR]: PERMISSION_DENIED,
    [VideomailError.PERMISSION_DENIED]: PERMISSION_DENIED,
    PermissionDeniedError: PERMISSION_DENIED,
    HARDWARE_UNAVAILABLE: WEBCAM_UNAVAILABLE,
    // That's for Firefox
    AbortError: WEBCAM_UNAVAILABLE,
    NO_VIDEO_FEED: {
      message: "No video feed found",
      explanation: "Another browser may be using your webcam.",
      classList: WEBCAM_PROBLEM,
    },
    [VideomailError.STARTING_FAILED]: {
      message: "Could not start recording",
      explanation: "Another browser may be using your webcam.",
      classList: WEBCAM_PROBLEM,
    },
    DevicesNotFoundError: {
      message: "No available webcam found",
      explanation:
        "Check that your webcam is connected and not being used by another app.",
      classList: WEBCAM_PROBLEM,
    },
    [VideomailError.NOT_READABLE_ERROR]: WEBCAM_UNREADABLE,
    [VideomailError.TRACK_START_ERROR]: WEBCAM_UNREADABLE,
    [VideomailError.INVALID_STATE_ERROR]: {
      message: "Your camera stream has ended",
      explanation: "The webcam stream is no longer active.",
      classList: WEBCAM_PROBLEM,
    },
  }),
);
