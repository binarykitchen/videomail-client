import hidden from "hidden";
import h from "hyperscript";
import inherits from "inherits";

import Events from "../../events";
import EventEmitter from "../../util/eventEmitter";

const NOTIFIER_MESSAGE_ID = "notifierMessage";

const Notifier = function (visuals, options) {
  EventEmitter.call(this, options, "Notifier");

  const self = this;
  const debug = options && options.debug;

  let notifyElement;
  let explanationElement;
  let entertainTimeoutId;
  let entertaining;
  let built;

  function onStopping(limitReached) {
    let lead = "";

    visuals.beginWaiting();

    if (limitReached) {
      debug("Limit reached");
      lead += `${options.text.limitReached}.<br/>`;
    }

    lead += `${options.text.sending} …`;

    self.notify(lead, null, {
      stillWait: true,
      entertain: options.notifier.entertain,
    });
  }

  function onConnecting() {
    self.notify("Connecting …");
  }

  function onLoadingUserMedia() {
    self.notify("Loading webcam …");
  }

  function onProgress(frameProgress, sampleProgress) {
    let overallProgress;

    if (options.isAudioEnabled()) {
      overallProgress = `Video: ${frameProgress}`;

      if (sampleProgress) {
        overallProgress += `, Audio: ${sampleProgress}`;
      }
    } else {
      overallProgress = frameProgress;
    }

    self.setExplanation(overallProgress);
  }

  function onBeginVideoEncoding() {
    visuals.beginWaiting();

    const lead = `${options.text.encoding} …`;

    self.notify(lead, null, {
      stillWait: true,
      entertain: options.notifier.entertain,
    });

    hideExplanation();
  }

  function initEvents() {
    debug("Notifier: initEvents()");

    self
      .on(Events.CONNECTING, function () {
        onConnecting();
      })
      .on(Events.LOADING_USER_MEDIA, function () {
        onLoadingUserMedia();
      })
      .on(Events.USER_MEDIA_READY, function () {
        // Ensure notifier has correct dimensions, especially when stretched
        correctNotifierDimensions();

        self.hide();
      })
      .on(Events.LOADED_META_DATA, function () {})
      .on(Events.PREVIEW, function () {
        self.hide();
      })
      .on(Events.STOPPING, function (limitReached) {
        onStopping(limitReached);
      })
      .on(Events.PROGRESS, function (frameProgress, sampleProgress) {
        onProgress(frameProgress, sampleProgress);
      })
      .on(Events.BEGIN_VIDEO_ENCODING, function () {
        onBeginVideoEncoding();
      })
      .on(Events.UNLOADING, function () {
        self.notify("Unloading …");
      })
      .on(Events.DISCONNECTED, function () {
        self.notify("Disconnected");
      })
      .on(Events.CONNECTED, function () {
        self.notify("Connected");

        if (options.loadUserMediaOnRecord) {
          self.hide();
        }
      });
  }

  function correctNotifierDimensions() {
    if (options.video.stretch) {
      notifyElement.style.width = "auto";
      notifyElement.style.height = `${visuals.getRecorderHeight(true, true)}px`;
    } else {
      notifyElement.style.width = `${visuals.getRecorderWidth(true)}px`;
      notifyElement.style.height = `${visuals.getRecorderHeight(true)}px`;
    }
  }

  function show() {
    notifyElement && hidden(notifyElement, false);
  }

  function runEntertainment() {
    if (options.notifier.entertain) {
      if (!entertaining) {
        const randomBackgroundClass = Math.floor(
          Math.random() * options.notifier.entertainLimit + 1,
        );

        notifyElement.className = `notifier entertain ${options.notifier.entertainClass}${randomBackgroundClass}`;

        entertainTimeoutId = setTimeout(
          runEntertainment,
          options.notifier.entertainInterval,
        );
        entertaining = true;
      }
    } else {
      cancelEntertainment();
    }
  }

  function cancelEntertainment() {
    if (notifyElement) {
      notifyElement.classList.remove("entertain");
    }

    clearTimeout(entertainTimeoutId);
    entertainTimeoutId = null;
    entertaining = false;
  }

  function setMessage(message, messageOptions) {
    options.debug(`Notifier: setMessage(${message})`);

    const notifierMessage = getNotifierMessage();

    if (notifierMessage) {
      if (message.length > 0) {
        const problem = messageOptions.problem ? messageOptions.problem : false;
        notifierMessage.innerHTML = (problem ? "&#x2639; " : "") + message;
      } else {
        options.logger.warn(
          "Not going to update notifierMessage element because message is empty",
          message,
        );
      }

      hidden(notifierMessage, false);
    } else {
      options.logger.warn(
        "Unable to update notifierMessage element because no element is defined",
        message,
      );
    }
  }

  this.error = function (err) {
    const message = err.message ? err.message.toString() : err.toString();
    const explanation = err.explanation ? err.explanation.toString() : null;

    if (!message) {
      options.debug("Weird empty error message generated for error", err);
    }

    self.notify(message, explanation, {
      blocking: true,
      problem: true,
      hideForm: err.hideForm && err.hideForm(),
      classList: err.getClassList && err.getClassList(),
      removeDimensions: err.removeDimensions && err.removeDimensions(),
    });
  };

  this.setExplanation = function (explanation) {
    if (!explanationElement) {
      explanationElement = h("p", { className: "explanation" });

      if (notifyElement) {
        notifyElement.appendChild(explanationElement);
      } else {
        options.logger.warn(
          "Unable to show explanation because notifyElement is empty:",
          explanation,
        );
      }
    }

    explanationElement.innerHTML = explanation;

    hidden(explanationElement, false);
  };

  this.build = function () {
    options.debug("Notifier: build()");

    notifyElement = visuals.querySelector(".notifier");

    if (!notifyElement) {
      notifyElement = h(".notifier"); // defaults to div

      this.hide();

      visuals.appendChild(notifyElement);
    } else {
      this.hide();
    }

    !built && initEvents();

    built = true;
  };

  function hideMessage() {
    const notifierMessage = getNotifierMessage();

    if (notifierMessage) {
      hidden(notifierMessage, true);
    }
  }

  function hideExplanation() {
    if (explanationElement) {
      hidden(explanationElement, true);
    }
  }

  this.hide = function () {
    cancelEntertainment();

    if (notifyElement) {
      hidden(notifyElement, true);
      notifyElement.classList.remove("blocking");
    }

    hideMessage();
    hideExplanation();
  };

  this.isVisible = function () {
    if (!built) {
      return false;
    }

    return notifyElement && !hidden(notifyElement);
  };

  this.isBuilt = function () {
    return built;
  };

  function getNotifierMessage() {
    return document.getElementById(NOTIFIER_MESSAGE_ID);
  }

  this.notify = function (message, explanation, notifyOptions = {}) {
    const params = [message, explanation].filter(Boolean);
    options.debug(`Notifier: notify(${params.join(", ")})`);

    const stillWait = notifyOptions.stillWait ? notifyOptions.stillWait : false;
    const entertain = notifyOptions.entertain ? notifyOptions.entertain : false;
    const blocking = notifyOptions.blocking ? notifyOptions.blocking : false;
    const hideForm = notifyOptions.hideForm ? notifyOptions.hideForm : false;
    const classList = notifyOptions.classList ? notifyOptions.classList : false;
    const removeDimensions = notifyOptions.removeDimensions
      ? notifyOptions.removeDimensions
      : false;

    let notifierMessage = getNotifierMessage();

    if (!notifierMessage && notifyElement) {
      const messageElement = h("h2", {
        id: NOTIFIER_MESSAGE_ID,
      });

      notifyElement.appendChild(messageElement);
    }

    notifierMessage = getNotifierMessage();

    if (notifyElement && notifierMessage && explanationElement) {
      notifyElement.insertBefore(notifierMessage, explanationElement);
    }

    if (notifyElement) {
      // reset
      if (!entertain) {
        notifyElement.className = "notifier";
      }

      if (classList) {
        classList.forEach(function (className) {
          notifyElement.classList.add(className);
        });
      }

      if (removeDimensions) {
        notifyElement.style.width = "auto";
        notifyElement.style.height = "auto";
      }
    }

    if (blocking) {
      notifyElement && notifyElement.classList.add("blocking");
      this.emit(Events.BLOCKING, { hideForm });
    } else {
      this.emit(Events.NOTIFYING);
    }

    visuals.hideReplay();
    visuals.hideRecorder();

    setMessage(message, notifyOptions);

    if (explanation && explanation.length > 0) {
      this.setExplanation(explanation);
    }

    if (entertain) {
      runEntertainment();
    } else {
      cancelEntertainment();
    }

    /*
     * just as a safety in case if an error is thrown in the middle of the build process
     * and visuals aren't built/shown yet.
     */
    visuals.showVisuals();

    show();

    !stillWait && visuals.endWaiting();
  };
};

inherits(Notifier, EventEmitter);

export default Notifier;
