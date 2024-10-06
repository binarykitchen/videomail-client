import Resource from "./../resource";
// https://github.com/tgriesser/create-error
import createError from "create-error";
import stringify from "safe-json-stringify";
import originalPretty from "./pretty";

const VIDEOMAIL_ERR_NAME = "Videomail Error";

const VideomailError = createError(Error, VIDEOMAIL_ERR_NAME, {
  title: undefined,
  message: undefined,
  explanation: undefined,
  logLines: undefined,
  siteName: undefined,
  cookie: undefined,
  location: undefined,
  err: undefined,
  promise: undefined,
  cause: undefined,
  reason: undefined,
  browser: undefined,
  cpu: undefined,
  device: undefined,
  engine: undefined,
  os: undefined,
  screen: undefined,
  orientation: undefined,
});

// shim pretty to exclude stack always
const pretty = function (anything) {
  return originalPretty(anything, { excludes: ["stack"] });
};

// static and public attribute of this class
VideomailError.PERMISSION_DENIED = "PERMISSION_DENIED";
VideomailError.NOT_ALLOWED_ERROR = "NotAllowedError";
VideomailError.NOT_CONNECTED = "Not connected";
VideomailError.DOM_EXCEPTION = "DOMException";
VideomailError.STARTING_FAILED = "Starting video failed";
VideomailError.MEDIA_DEVICE_NOT_SUPPORTED = "MediaDeviceNotSupported";
VideomailError.BROWSER_PROBLEM = "browser-problem";
VideomailError.WEBCAM_PROBLEM = "webcam-problem";
VideomailError.IOS_PROBLEM = "ios-problem";
VideomailError.OVERCONSTRAINED = "OverconstrainedError";
VideomailError.NOT_FOUND_ERROR = "NotFoundError";
VideomailError.NOT_READABLE_ERROR = "NotReadableError";
VideomailError.SECURITY_ERROR = "SecurityError";
VideomailError.TRACK_START_ERROR = "TrackStartError";
VideomailError.INVALID_STATE_ERROR = "InvalidStateError";

// static function to convert an error into a videomail error
VideomailError.create = function (err, explanation, options, parameters) {
  if (err && err.name === VIDEOMAIL_ERR_NAME) {
    return err;
  }

  if (!options && explanation) {
    options = explanation;
    explanation = undefined;
  }

  options ||= {};
  parameters ||= {};

  const audioEnabled = options && options.isAudioEnabled && options.isAudioEnabled();

  const classList = parameters.classList || [];

  /*
   * Require Browser here, not at the top of the file to avoid
   * recursion. Because the Browser class is requiring this file as well.
   */
  const Browser = require("./browser").default;
  const browser = new Browser(options);

  let errType;
  let message;

  // whole code is ugly because all browsers behave so differently :(

  if (typeof err === "object") {
    if (err.name === VideomailError.TRACK_START_ERROR) {
      errType = VideomailError.TRACK_START_ERROR;
    } else if (err.name === VideomailError.SECURITY_ERROR) {
      errType = VideomailError.SECURITY_ERROR;
    } else if (err.code === 8 && err.name === VideomailError.NotFoundError) {
      errType = VideomailError.NotFoundError;
    } else if (err.code === 35 || err.name === VideomailError.NOT_ALLOWED_ERROR) {
      // https://github.com/binarykitchen/videomail.io/issues/411
      errType = VideomailError.NOT_ALLOWED_ERROR;
    } else if (err.code === 1 && err.PERMISSION_DENIED === 1) {
      errType = VideomailError.PERMISSION_DENIED;
    } else if (err.constructor && err.constructor.name === VideomailError.DOM_EXCEPTION) {
      if (err.name === VideomailError.NOT_READABLE_ERROR) {
        errType = VideomailError.NOT_READABLE_ERROR;
      } else {
        errType = VideomailError.DOM_EXCEPTION;
      }
    } else if (
      err.constructor &&
      err.constructor.name === VideomailError.OVERCONSTRAINED
    ) {
      errType = VideomailError.OVERCONSTRAINED;
    } else if (err.explanation === VideomailError.STARTING_FAILED) {
      errType = err.explanation;
    } else if (err.name) {
      errType = err.name;
    } else if (err.type === "error" && err.target.bufferedAmount === 0) {
      errType = VideomailError.NOT_CONNECTED;
    }
  } else if (err === VideomailError.NOT_CONNECTED) {
    errType = VideomailError.NOT_CONNECTED;
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

      if (err.constraint) {
        if (err.constraint === "width") {
          explanation = "Your webcam does not meet the width requirement.";
        } else {
          explanation = `Unmet constraint: ${err.constraint}`;
        }
      } else {
        explanation = err.toString();
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

      if (err.explanation) {
        err.explanation += ` Details: ${err.explanation}`;
      }

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

    case VideomailError.NOT_CONNECTED:
      message = "Unable to connect";
      explanation =
        "Either the videomail server or your connection is down. " +
        "Trying to reconnect every few seconds …";
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
      switch (err.code) {
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
        if (originalExplanation.explanation) {
          explanation = originalExplanation.explanation;
        } else {
          // tried toString before but nah
          explanation = `Inspected: ${stringify(originalExplanation)}`;
        }
      }

      if (err) {
        if (typeof err === "string") {
          message = err;
        } else {
          if (err.message) {
            message = pretty(err.message) + " (pretty)";
          }

          if (err.explanation) {
            if (!explanation) {
              explanation = pretty(err.explanation);
            } else {
              explanation += `;<br/>${pretty(err.explanation)}`;
            }
          }

          if (err.details) {
            const details = pretty(err.details);

            if (!explanation) {
              explanation = details;
            } else if (details) {
              explanation += `;<br/>${details}`;
            }
          }
        }
      }

      // for weird, undefined cases
      if (!message) {
        if (errType) {
          message = errType + " (weird)";
        }

        if (!explanation && err) {
          explanation = pretty(err, { excludes: ["stack"] });
        }

        // avoid dupes
        if (pretty(message) === explanation) {
          explanation = undefined;
        }
      }

      break;
    }
  }

  let logLines = null;

  if (options.logger && options.logger.getLines) {
    logLines = options.logger.getLines();
  }

  // be super robust
  const debug = (options && options.debug) || console.log;
  debug("VideomailError: create()", message, explanation || "(no explanation set)");

  const usefulClientData = browser.getUsefulData();
  const cookies = global.document.cookie.split("; ");

  const errData = {
    title: "videomail-client error",
    message,
    explanation,
    logLines,
    siteName: options.siteName,
    browser: usefulClientData.browser,
    cpu: usefulClientData.cpu,
    device: usefulClientData.device,
    engine: usefulClientData.engine,
    os: usefulClientData.os,
    location: window.location.href,
    cookie: cookies.length > 0 ? cookies.join(",\n") : undefined,
    screen: [screen.width, screen.height, screen.colorDepth].join("×"),
    orientation:
      typeof screen.orientation === "string"
        ? screen.orientation
        : screen.orientation.type.toString(),

    // Consider removing later once sorted
    errNo: err?.errno,
    errCode: err?.code,
    errName: err?.name,
    errType: err?.type,
    errConstraint: err?.constraint,
    errConstructorName: err?.constructor?.name,
  };

  const videomailError = new VideomailError(
    err instanceof Error ? err : message,
    errData,
  );

  let resource;
  let reportErrors = false;

  if (options.reportErrors) {
    if (typeof options.reportErrors === "function") {
      reportErrors = options.reportErrors(videomailError);
    } else {
      reportErrors = options.reportErrors;
    }
  }

  if (reportErrors) {
    resource = new Resource(options);
  }

  if (resource) {
    resource.reportError(videomailError, function (err2) {
      if (err2) {
        console.error("Unable to report error", err2);
      }
    });
  }

  function hasClass(name) {
    return classList.indexOf(name) >= 0;
  }

  function isBrowserProblem() {
    return hasClass(VideomailError.BROWSER_PROBLEM) || parameters.browserProblem;
  }

  // add some public functions

  // this one is useful so that the notifier can have different css classes
  videomailError.getClassList = function () {
    return classList;
  };

  videomailError.removeDimensions = function () {
    return hasClass(VideomailError.IOS_PROBLEM) || browser.isMobile();
  };

  videomailError.hideButtons = function () {
    return isBrowserProblem() || hasClass(VideomailError.IOS_PROBLEM);
  };

  videomailError.hideForm = function () {
    return hasClass(VideomailError.IOS_PROBLEM);
  };

  return videomailError;
};

export default VideomailError;
