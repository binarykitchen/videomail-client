import Resource from "../../resource";
import { VideomailClientOptions } from "../../types/options";
import getBrowser from "../getBrowser";
import { isAudioEnabled } from "../options/audio";
import pretty from "../pretty";
import HTTPVideomailError from "./HTTPVideomailError";
import VideomailError, { ErrData } from "./VideomailError";

interface ErrorParams {
  err?: HTTPVideomailError;
  exc?: unknown;
  message?: string;
  explanation?: string;
  options: VideomailClientOptions;
  classList?: string[];
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
  const browser = getBrowser(options);

  const errName = err?.name ?? err?.constructor.name;

  switch (errName) {
    case VideomailError.SECURITY_ERROR:
      message = "The operation was insecure";
      explanation = "Probably you have disallowed Cookies for this page?";
      classList.push(VideomailError.BROWSER_PROBLEM);
      break;
    case VideomailError.OVERCONSTRAINED:
      message = "Invalid webcam constraints";

      if (err && "constraint" in err) {
        const overconstrainedError = err as unknown as OverconstrainedError;
        const constraint = overconstrainedError.constraint;

        if (constraint === "width") {
          explanation = "Your webcam does not meet the width requirement.";
        } else if (constraint) {
          explanation = `Unmet constraint: ${constraint}`;
        } else {
          explanation = err.message;
        }
      } else {
        explanation = err?.message;
      }
      break;
    case "MediaDeviceFailedDueToShutdown":
      message = "Webcam is shutting down";
      explanation =
        "This happens your webcam is already switching off and not giving you permission to use it.";
      break;
    case "SourceUnavailableError":
      message = "Source of your webcam cannot be accessed";
      explanation = "Probably it is locked from another process or has a hardware error.";
      break;
    case "NO_DEVICES_FOUND":
      if (audioEnabled) {
        message = "No webcam nor microphone found";
        explanation =
          "Your browser cannot find a webcam with microphone attached to your machine.";
      } else {
        message = "No webcam found";
        explanation = "Your browser cannot find a webcam attached to your machine.";
      }

      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;

    case "PermissionDismissedError":
      message = "Ooops, you didn't give me any permissions?";
      explanation =
        "Looks like you skipped the webcam permission dialogue.<br/>" +
        "Please grant access next time the dialogue appears.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;

    case VideomailError.NOT_ALLOWED_ERROR:
    case VideomailError.PERMISSION_DENIED:
    case "PermissionDeniedError":
      message = "Permission denied";

      explanation =
        "Cannot access your webcam. This can have two reasons:<br/>" +
        "a) you blocked access to webcam; or<br/>" +
        "b) your webcam is already in use.";

      classList.push(VideomailError.WEBCAM_PROBLEM);

      break;

    case "HARDWARE_UNAVAILABLE":
      message = "Webcam is unavailable";
      explanation = "Maybe it is already busy in another window?";

      if (browser.isChromeBased() || browser.isFirefox()) {
        explanation += " Or you have to allow access above?";
      }

      classList.push(VideomailError.WEBCAM_PROBLEM);

      break;

    case "NO_VIDEO_FEED":
      message = "No video feed found!";
      explanation = "Your webcam is already used in another browser.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;

    case VideomailError.STARTING_FAILED:
      message = "Starting video failed";
      explanation =
        "Most likely this happens when the webcam is already active in another browser";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;

    case "DevicesNotFoundError":
      message = "No available webcam could be found";
      explanation =
        "Looks like you do not have any webcam attached to your machine; or " +
        "the one you plugged in is already used.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;

    case VideomailError.NOT_READABLE_ERROR:
    case VideomailError.TRACK_START_ERROR:
      message = "No access to webcam";
      explanation = "A hardware error occurred which prevented access to your webcam";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;

    case VideomailError.INVALID_STATE_ERROR:
      message = "Invalid state";
      explanation = "Video recording stream from your webcam already has finished";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;

    case VideomailError.DOM_EXCEPTION:
      message = "DOM Exception";
      explanation = pretty(err);

      break;

    /*
     * Chrome has a weird problem where if you try to do a getUserMedia request too early, it
     * can return a MediaDeviceNotSupported error (even though nothing is wrong and permission
     * has been granted). Look at userMediaErrorCallback() in recorder, there we do not
     * emit those kind of errors further and just retry.
     *
     * but for whatever reasons, if it happens to reach this code, then investigate this further.
     */
    case VideomailError.MEDIA_DEVICE_NOT_SUPPORTED:
      message = "Media device not supported";
      explanation = pretty(err);
      break;

    default: {
      const originalExplanation = explanation;

      if (explanation && typeof explanation === "object") {
        explanation = pretty(explanation);
      }

      /*
       * It can be that explanation itself is an error object
       * error objects can be prettified to undefined sometimes
       */
      if (!explanation && originalExplanation) {
        explanation = `Inspected: ${originalExplanation}`;
      }

      // Last resort, explanation has been defined on Videomail server,
      // so use it instead.
      if (!explanation && err?.explanation) {
        explanation = err.explanation;
      }

      if (!message && err?.message) {
        message = err.message;
      }

      // for weird, undefined cases
      if (!message) {
        if (errName) {
          message = `${errName} (weird)`;
        }

        if (!explanation) {
          explanation = pretty(err);
        }

        // avoid dupes
        if (pretty(message) === explanation) {
          explanation = undefined;
        }
      }

      break;
    }
  }

  let logLines;

  if (options.logger.getLines) {
    logLines = options.logger.getLines();
  }

  const args = [message, explanation].filter(Boolean).join(", ");

  options.logger.debug(`VideomailError: create(${args})`);

  const errData: ErrData = {
    explanation,
    logLines,
    err,
  };

  // Remember, this will create a new error stack trace from there
  const videomailError = new VideomailError(
    message ?? "(undefined message)",
    options,
    classList,
    errData,
  );

  if (err) {
    videomailError.status = err.status;
    videomailError.code = err.code;
  }

  if (options.reportErrors) {
    const resource = new Resource(options);

    resource.reportError(videomailError).catch((reason: unknown) => {
      console.error(reason);
    });
  }

  return videomailError;
}

export default createError;
