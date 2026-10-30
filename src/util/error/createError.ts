import Resource from "../../resource";
import { VideomailClientOptions } from "../../types/options";
import { isAudioEnabled } from "../options/audio";
import pretty from "../string/pretty";
import { version as videomailClientVersion } from "./../../../package.json";
import HTTPVideomailError from "./HTTPVideomailError";
import VideomailError, { ErrData } from "./VideomailError";

interface ErrorParams {
  cause?: unknown;
  err?: HTTPVideomailError;
  exc?: unknown;
  message?: string;
  explanation?: string;
  options: VideomailClientOptions;
  classList?: string[];
  usedConstraints?: MediaStreamConstraints;
}

function createError(errorParams: ErrorParams) {
  const { exc, options } = errorParams;

  let err = errorParams.err;

  if (!err && exc instanceof Error) {
    err = exc;
  }

  if (err instanceof VideomailError) {
    return err;
  }

  let message = errorParams.message;
  let explanation = errorParams.explanation;

  const classList = errorParams.classList ?? [];

  const audioEnabled = isAudioEnabled(options);

  const errName = err?.name ?? err?.constructor.name;

  switch (errName) {
    case VideomailError.SECURITY_ERROR:
      message = "Your browser blocked this action";
      explanation = "Check this page's camera permissions and security settings.";
      classList.push(VideomailError.BROWSER_PROBLEM);
      break;
    case VideomailError.OVERCONSTRAINED:
      message = "Your webcam cannot use these settings";

      if (err && "constraint" in err) {
        const overconstrainedError = err as unknown as OverconstrainedError;
        const constraint = overconstrainedError.constraint;

        if (constraint === "width") {
          explanation = "Your webcam does not meet the width requirement.";
        } else if (constraint) {
          explanation = `Unmet constraint: ${constraint}`;
        } else if (err.message) {
          explanation = err.message;
        }
      } else if (err?.message) {
        explanation = err.message;
      }
      break;
    case "MediaDeviceFailedDueToShutdown":
      message = "Webcam is shutting down";
      explanation = "Wait for your webcam to finish switching off, then try again.";
      break;
    case "SourceUnavailableError":
      message = "Cannot access your webcam";
      explanation = "Another app may be using it, or there may be a hardware problem.";
      break;
    case "NO_DEVICES_FOUND":
      if (audioEnabled) {
        message = "No webcam or microphone found";
        explanation = "Check that your webcam and microphone are connected.";
      } else {
        message = "No webcam found";
        explanation = "Check that your webcam is connected.";
      }

      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;

    case "PermissionDismissedError":
      message = "Camera permission is needed";
      explanation =
        "The camera permission prompt was closed.<br/>" +
        "Please allow access when it appears again.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;

    case VideomailError.NOT_ALLOWED_ERROR:
    case VideomailError.PERMISSION_DENIED:
    case "PermissionDeniedError":
      message = "Permission denied";

      explanation =
        "We cannot access your webcam. Check these possibilities:" +
        "<ul><li>Camera access is blocked in your browser settings.</li>" +
        "<li>Another app is using your webcam.</li></ul>";

      classList.push(VideomailError.WEBCAM_PROBLEM);

      break;

    case "HARDWARE_UNAVAILABLE":
    case "AbortError": // That's for Firefox
      message = "Webcam is unavailable";
      explanation = "Another window may be using it. Close it and try again.";

      classList.push(VideomailError.WEBCAM_PROBLEM);

      break;

    case "NO_VIDEO_FEED":
      message = "No video feed found";
      explanation = "Another browser may be using your webcam.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;

    case VideomailError.STARTING_FAILED:
      message = "Could not start recording";
      explanation = "Another browser may be using your webcam.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;

    case "DevicesNotFoundError":
      message = "No available webcam found";
      explanation =
        "Check that your webcam is connected and not being used by another app.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;

    case VideomailError.NOT_READABLE_ERROR:
    case VideomailError.TRACK_START_ERROR:
      message = "Cannot access your webcam";
      explanation = "Another browser may be using it. Close it and try again.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;

    case VideomailError.INVALID_STATE_ERROR:
      message = "Your camera stream has ended";
      explanation = "The webcam stream is no longer active.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;

    case VideomailError.DOM_EXCEPTION:
      message = "DOM Exception";

      if (err) {
        explanation = pretty(err);
      }

      break;

    // Chrome can report this if camera access starts too early.
    // The recorder normally retries; reaching here needs investigation.
    case VideomailError.MEDIA_DEVICE_NOT_SUPPORTED:
      message = "Media device not supported";

      if (err) {
        explanation = pretty(err);
      }

      break;

    default: {
      const originalExplanation = explanation;

      if (explanation && typeof explanation === "object") {
        explanation = pretty(explanation);
      }

      // pretty() may return undefined for an error object.
      if (!explanation && originalExplanation) {
        explanation = `Inspected: ${originalExplanation}`;
      }

      // Fall back to the server's explanation.
      if (!explanation && err?.explanation) {
        explanation = err.explanation;
      }

      if (!message && err?.message) {
        message = err.message;
      }

      // Keep the error name if no message is available.
      if (!message && errName) {
        message = `${errName} (weird)`;
      }

      break;
    }
  }

  let logLines: string[] | undefined;

  if (options.logger.getLines) {
    logLines = options.logger.getLines();
  }

  const args = [message, explanation].filter(Boolean).join(", ");

  options.logger.debug(`VideomailError: create(${args})`);

  const errData: ErrData = {
    cause: errorParams.cause,
    explanation,
    logLines,
    err,
  };

  // This starts a new stack trace; errData keeps the original error.
  const videomailError = new VideomailError(
    message ?? "(undefined message)",
    options,
    classList,
    errData,
  );

  if (err) {
    videomailError.status = err.status;
    videomailError.code = err.code;
    videomailError.constraint = err.constraint;
    videomailError.usedConstraints = err.usedConstraints;
  }

  videomailError.versions = {
    videomailClient: videomailClientVersion,
    videomailNinjaFormPlugin: options.versions?.videomailNinjaFormPlugin,
  };

  if (options.reportErrors) {
    const resource = new Resource(options);

    // Report here as well as returning the error.
    // WordPress integrations may not have their own reporting.
    resource.reportError(videomailError).catch((reason: unknown) => {
      console.error(reason);
    });
  }

  return videomailError;
}

export default createError;
