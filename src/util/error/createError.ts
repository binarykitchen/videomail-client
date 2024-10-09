import Resource from "../../resource";

import pretty from "../pretty";
import { isAudioEnabled } from "../options/audio";
import VideomailError, { ErrData } from "./VideomailError";
import getBrowser from "../getBrowser";
import { VideomailClientOptions } from "../../types/options";

interface ErrorParams {
  err?: Error;
  exc?: unknown;
  message?: string;
  explanation?: string;
  options: VideomailClientOptions;
  classList?: string[];
}

function createError(errorParams: ErrorParams) {
  const { exc, options } = errorParams;

  let message = errorParams.message;
  let explanation = errorParams.explanation;

  let err = errorParams.err;
  const classList = errorParams.classList ?? [];

  if (exc instanceof Error) {
    if (!err) {
      err = exc;
    }
  }

  if (err instanceof VideomailError) {
    return err;
  }

  const audioEnabled = isAudioEnabled(options);
  const browser = getBrowser(options);

  let errorCode;
  let errType;

  // whole code is ugly because all browsers behave so differently :(

  if (typeof err === "object") {
    if ("code" in err) {
      errorCode = err.code;
    }

    if (err.name === VideomailError.TRACK_START_ERROR) {
      errType = VideomailError.TRACK_START_ERROR;
    } else if (err.name === VideomailError.SECURITY_ERROR) {
      errType = VideomailError.SECURITY_ERROR;
    } else if (errorCode === 8 && err.name === VideomailError.NOT_FOUND_ERROR) {
      errType = VideomailError.NOT_FOUND_ERROR;
    } else if (errorCode === 35 || err.name === VideomailError.NOT_ALLOWED_ERROR) {
      // https://github.com/binarykitchen/videomail.io/issues/411
      errType = VideomailError.NOT_ALLOWED_ERROR;
    } else if (err.constructor.name === VideomailError.DOM_EXCEPTION) {
      if (err.name === VideomailError.NOT_READABLE_ERROR) {
        errType = VideomailError.NOT_READABLE_ERROR;
      } else {
        errType = VideomailError.DOM_EXCEPTION;
      }
    } else if (err.constructor.name === VideomailError.OVERCONSTRAINED) {
      errType = VideomailError.OVERCONSTRAINED;
    } else if (err.name) {
      errType = err.name;
    }
  } else {
    errType = err;
  }

  switch (errType) {
    case VideomailError.SECURITY_ERROR:
      message = "The operation was insecure";
      explanation = "Probably you have disallowed Cookies for this page?";
      classList.push(VideomailError.BROWSER_PROBLEM);
      break;
    case VideomailError.OVERCONSTRAINED:
      message = "Invalid webcam constraints";

      if (err && "constraint" in err) {
        if (err.constraint === "width") {
          explanation = "Your webcam does not meet the width requirement.";
        } else {
          explanation = `Unmet constraint: ${err.constraint}`;
        }
      } else {
        explanation = err?.toString();
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
    case VideomailError.NOT_FOUND_ERROR:
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
      switch (errorCode) {
        case 8:
          message = "Requested webcam not found";
          explanation = "A webcam is needed but could not be found";
          classList.push(VideomailError.WEBCAM_PROBLEM);
          break;
        case 9: {
          const newUrl = `https:${window.location.href.substring(window.location.protocol.length)}`;
          message = "Security upgrade needed";
          explanation =
            `Click <a href="${newUrl}">here</a> to switch to HTTPs which is more safe ` +
            ` and enables encrypted videomail transfers.`;
          classList.push(VideomailError.BROWSER_PROBLEM);
          break;
        }
        case 11:
          message = "Invalid State";
          explanation = "The object is in an invalid, unusable state";
          classList.push(VideomailError.BROWSER_PROBLEM);
          break;
        default:
          message = "DOM Exception";
          explanation = pretty(err);
          classList.push(VideomailError.BROWSER_PROBLEM);
          break;
      }
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
       * it can be that explanation itself is an error object
       * error objects can be prettified to undefined sometimes
       */
      if (!explanation && originalExplanation) {
        // tried toString before but nah
        explanation = `Inspected: ${originalExplanation}`;
      }

      if (!message && err?.message) {
        message = err.message;
      }

      // for weird, undefined cases
      if (!message) {
        if (errType) {
          message = `${errType} (weird)`;
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

  const videomailError = new VideomailError(
    message ?? "(undefined message)",
    options,
    classList,
    errData,
  );

  if (options.reportErrors) {
    const resource = new Resource(options);

    resource.reportError(videomailError).catch((reason: unknown) => {
      console.error(reason);
    });
  }

  return videomailError;
}

export default createError;
