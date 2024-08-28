import Visibility from "document-visibility";
import hidden from "hidden";
import insertCss from "insert-css";
import stringify from "safe-json-stringify";

import inherits from "inherits";

import css from "../../styles/css/main.min.css.js";
import Events from "../events";
import Resource from "../resource";
import EventEmitter from "../util/eventEmitter";
import VideomailError from "../util/videomailError";
import Buttons from "./buttons";
import Dimension from "./dimension";
import Form from "./form";
import OptionsWrapper from "./optionsWrapper";
import Visuals from "./visuals";

const Container = function (options) {
  EventEmitter.call(this, options, "Container");

  const self = this;

  const visibility = Visibility();
  const visuals = new Visuals(this, options);
  const buttons = new Buttons(this, options);
  const resource = new Resource(options);
  const htmlElement = document.querySelector("html");

  const { debug } = options;

  let hasError = false;
  let submitted = false;
  let lastValidation = false;

  let containerElement;
  let built;
  let form;

  validateOptions();

  // since https://github.com/binarykitchen/videomail-client/issues/87
  function findParentFormElement() {
    if (!containerElement) {
      // Must be in player only mode
      return;
    }

    return containerElement.closest("form");
  }

  function getFormElement() {
    let formElement;

    if (containerElement && containerElement.tagName === "FORM") {
      formElement = containerElement;
    } else if (options.selectors.formId) {
      formElement = document.getElementById(options.selectors.formId);
    } else {
      formElement = findParentFormElement();
    }

    return formElement;
  }

  this.buildForm = function () {
    if (form) {
      return; // already built
    }

    const formElement = getFormElement();

    if (formElement) {
      form = new Form(self, formElement, options);

      const submitButton = form.findSubmitButton();

      if (submitButton) {
        buttons.setSubmitButton(submitButton);
      }

      form.build();
    }
  };

  function buildChildren(playerOnly = false, replayParentElement) {
    debug(
      `Container: buildChildren (playerOnly = ${playerOnly}${replayParentElement ? `, replayParentElement="${replayParentElement}"` : ""})`,
    );

    if (containerElement) {
      containerElement.classList.add(options.selectors.containerClass);
    }

    if (!playerOnly) {
      buttons.build();
    }

    visuals.build(playerOnly, replayParentElement);
  }

  function processError(err) {
    hasError = true;

    if (err.stack) {
      options.logger.error(err.stack);
    } else {
      options.logger.error(err);
    }

    if (options.displayErrors) {
      visuals.error(err);
    } else {
      visuals.reset();
    }
  }

  function initEvents(playerOnly = false) {
    debug(`Container: initEvents (playerOnly = ${playerOnly})`);

    if (options.enableAutoUnload) {
      window.addEventListener(
        "beforeunload",
        (e) => {
          self.unload(e);
        },
        { once: true },
      );
    }

    if (!playerOnly) {
      visibility.onChange(function (visible) {
        // built? see https://github.com/binarykitchen/videomail.io/issues/326
        if (built) {
          if (visible) {
            if (options.isAutoPauseEnabled() && self.isCountingDown()) {
              self.resume();
            }

            self.emit(Events.VISIBLE);
          } else {
            if (
              options.isAutoPauseEnabled() &&
              (self.isCountingDown() || self.isRecording())
            ) {
              self.pause("document invisible");
            }

            self.emit(Events.INVISIBLE);
          }
        }
      });
    }

    if (options.enableSpace) {
      if (!playerOnly) {
        window.addEventListener("keypress", function (e) {
          const { tagName } = e.target;
          const isEditable =
            e.target.isContentEditable ||
            e.target.contentEditable === "true" ||
            e.target.contentEditable === true;

          // beware of rich text editors, hence the isEditable check (wordpress plugin issue)
          if (!isEditable && tagName !== "INPUT" && tagName !== "TEXTAREA") {
            const code = e.code;

            if (code === 32) {
              e.preventDefault();

              if (options.enablePause) {
                visuals.pauseOrResume();
              } else {
                visuals.recordOrStop();
              }
            }
          }
        });
      }
    }

    /*
     * better to keep the one and only error listeners
     * at one spot, here, because unload() will do a removeAllListeners()
     */
    self.on(Events.ERROR, function (err) {
      processError(err);
      unloadChildren(err);

      if (err.removeDimensions && err.removeDimensions()) {
        removeDimensions();
      }
    });

    if (!playerOnly) {
      self.on(Events.LOADED_META_DATA, function () {
        correctDimensions();
      });
    }
  }

  function validateOptions() {
    if (options.hasDefinedWidth() && options.video.width % 2 !== 0) {
      throw VideomailError.create("Width must be divisible by two.", options);
    }

    if (options.hasDefinedHeight() && options.video.height % 2 !== 0) {
      throw VideomailError.create("Height must be divisible by two.", options);
    }
  }

  /*
   * This will just set the width but not the height because
   * it can be a form with more inputs elements
   */
  function correctDimensions() {
    if (options.video.stretch) {
      removeDimensions();
    } else if (containerElement) {
      const width = visuals.getRecorderWidth(true);

      if (width < 1) {
        throw VideomailError.create("Recorder width cannot be less than 1!", options);
      } else {
        containerElement.style.width = `${width}px`;
      }
    }
  }

  function removeDimensions() {
    if (!containerElement) {
      return;
    }

    containerElement.style.width = "auto";
  }

  function unloadChildren(e) {
    visuals.unload(e);
    buttons.unload();

    if (form) {
      form.unload();
      form = undefined;
    }

    self.endWaiting();
  }

  function hideMySelf() {
    hidden(containerElement, true);
  }

  function submitVideomail(formData, method, cb) {
    const videomailFormData = form.transformFormData(formData);

    // when method is undefined, treat it as a post
    if (isPost(method) || !method) {
      videomailFormData.recordingStats = visuals.getRecordingStats();
      videomailFormData.width = visuals.getRecorderWidth(true);
      videomailFormData.height = visuals.getRecorderHeight(true);

      if (navigator.connection) {
        videomailFormData.connection = {
          downlink: `${navigator.connection.downlink} Mbit/s`,
          effectiveType: navigator.connection.effectiveType,
          rtt: navigator.connection.rtt,
          type: navigator.connection.type,
        };
      }

      resource.post(videomailFormData, cb);
    } else if (isPut(method)) {
      resource.put(videomailFormData, cb);
    }
  }

  function submitForm(formData, videomailResponse, url, cb) {
    /*
     * for now, accept POSTs only which have an URL unlike null and
     * treat all other submissions as direct submissions
     */

    if (!url || url === "") {
      url = options.baseUrl;
    }

    // can be missing when no videomail was recorded and is not required
    if (videomailResponse) {
      /*
       * this in case if user wants all videomail metadata to be posted
       * altogether with the remaining form
       */
      if (options.submitWithVideomail) {
        formData.videomail = videomailResponse.videomail;
      }
    }

    resource.form(formData, url, cb);
  }

  function finalizeSubmissions(err, method, videomail, response, formResponse) {
    self.endWaiting();

    if (err) {
      self.emit(Events.ERROR, err);
    } else {
      submitted = true;

      // merge two json response bodies to fake as if it were only one request
      if (response && formResponse && formResponse.body) {
        Object.keys(formResponse.body).forEach(function (key) {
          response[key] = formResponse.body[key];
        });
      }

      self.emit(Events.SUBMITTED, videomail, response || formResponse);

      if (formResponse && formResponse.type === "text/html" && formResponse.text) {
        // server replied with HTML contents - display these
        document.body.innerHTML = formResponse.text;

        /*
         * todo: figure out how to fire dom's onload event again
         * todo: or how to run all the scripts over again
         */
      }
    }
  }

  this.addPlayerDimensions = function (videomail) {
    try {
      if (!videomail) {
        throw new Error("Videomail data is missing for attaching player dimensions");
      }

      const replay = self.getReplay();
      const replayParentElement = replay.getParentElement();

      videomail.playerHeight = self.calculateHeight(
        {
          responsive: true,
          videoWidth: videomail.width,
          ratio: videomail.height / videomail.width,
        },
        replayParentElement,
      );

      videomail.playerWidth = self.calculateWidth({
        responsive: true,
        videoHeight: videomail.playerHeight,
        ratio: videomail.height / videomail.width,
      });

      return videomail;
    } catch (exc) {
      self.emit(Events.ERROR, exc);
    }
  };

  this.limitWidth = function (width) {
    return Dimension.limitWidth(containerElement, width, options);
  };

  this.limitHeight = function (height) {
    return Dimension.limitHeight(height, options);
  };

  this.calculateWidth = function (fnOptions) {
    return Dimension.calculateWidth(OptionsWrapper.merge(options, fnOptions));
  };

  this.calculateHeight = function (fnOptions, element) {
    if (!element) {
      if (containerElement) {
        element = containerElement;
      } else {
        // better than nothing
        element = document.body;
      }
    }

    return Dimension.calculateHeight(element, OptionsWrapper.merge(options, fnOptions));
  };

  function areVisualsHidden() {
    return visuals.isHidden();
  }

  this.hasElement = function () {
    return Boolean(containerElement);
  };

  function prependDefaultCss() {
    insertCss(css, { prepend: true });
  }

  this.build = function (playerOnly = false, replayParentElement) {
    debug(
      `Container: build (playerOnly = ${playerOnly}${replayParentElement ? `, replayParentElement="${replayParentElement}"` : ""})`,
    );

    try {
      options.insertCss && prependDefaultCss();

      // Note, it can be undefined when e.g. just replaying a videomail
      containerElement = document.getElementById(options.selectors.containerId);

      // Check if the replayParentElement could act as the container element perhaps?
      if (!containerElement && replayParentElement) {
        if (typeof replayParentElement === "string") {
          replayParentElement = document.getElementById(replayParentElement);
        }

        if (replayParentElement?.classList.contains(options.selectors.containerClass)) {
          containerElement = replayParentElement;
        }
      }

      !built && initEvents(playerOnly);

      correctDimensions();

      // Building form also applies for when `playerOnly` because of
      // correcting mode on Videomail. This function will skip if there is no form. Easy.
      self.buildForm();

      // If a container element has been found, no need to pass on replayParentElement further
      buildChildren(playerOnly, containerElement ? undefined : replayParentElement);

      if (!hasError) {
        debug("Container: built.");
        built = true;
        self.emit(Events.BUILT);
      } else {
        debug("Container: building failed due to an error.");
      }
    } catch (exc) {
      self.emit(Events.ERROR, exc);
    }
  };

  this.getSubmitButton = function () {
    return buttons.getSubmitButton();
  };

  this.querySelector = function (selector) {
    if (!containerElement) {
      // Must be in player only mode
      return;
    }

    return containerElement.querySelector(selector);
  };

  this.beginWaiting = function () {
    htmlElement.classList && htmlElement.classList.add("wait");
  };

  this.endWaiting = function () {
    htmlElement.classList && htmlElement.classList.remove("wait");
  };

  this.appendChild = function (child) {
    if (!containerElement) {
      // Must be in player only mode
      return;
    }

    containerElement.appendChild(child);
  };

  this.insertBefore = function (child, reference) {
    if (!containerElement) {
      // Must be in player only mode
      return;
    }

    containerElement.insertBefore(child, reference);
  };

  this.unload = function (e) {
    try {
      if (!built) {
        return;
      }

      debug(`Container: unload(${e ? stringify(e) : ""})`);
      self.emit(Events.UNLOADING);

      unloadChildren(e);
      self.removeAllListeners();

      built = submitted = false;
    } catch (exc) {
      self.emit(Events.ERROR, exc);
    }
  };

  this.show = function () {
    if (containerElement) {
      hidden(containerElement, false);

      visuals.show();

      if (!hasError) {
        const paused = self.isPaused();

        if (paused) {
          buttons.adjustButtonsForPause();
        }

        /*
         * since https://github.com/binarykitchen/videomail-client/issues/60
         * we hide areas to make it easier for the user
         */
        buttons.show();

        if (self.isReplayShown()) {
          self.emit(Events.PREVIEW);
        } else {
          self.emit(Events.FORM_READY, { paused });
        }
      }
    }
  };

  this.hide = function () {
    debug("Container: hide()");

    hasError = false;

    self.isRecording() && self.pause();

    visuals.hide();

    if (submitted) {
      buttons.hide();
      hideMySelf();
    }
  };

  this.startOver = function (params) {
    try {
      self.emit(Events.STARTING_OVER);

      submitted = false;
      form.show();
      visuals.back(params, function () {
        if (params && params.keepHidden) {
          /*
           * just enable form, do nothing else.
           * see example contact_form.html when you submit without videomail
           * and go back
           */
          self.enableForm();
        } else {
          self.show(params);
        }
      });
    } catch (exc) {
      self.emit(Events.ERROR, exc);
    }
  };

  this.showReplayOnly = function () {
    hasError = false;

    self.isRecording() && self.pause();

    visuals.showReplayOnly();

    submitted && buttons.hide();
  };

  this.isNotifying = function () {
    return visuals.isNotifying();
  };

  this.isPaused = function () {
    return visuals.isPaused();
  };

  this.pause = function (params) {
    visuals.pause(params);
  };

  // this code needs a good rewrite :(
  this.validate = function (event, force) {
    let runValidation = true;
    let valid = true;

    if (!options.enableAutoValidation) {
      runValidation = false;
      lastValidation = true; // needed so that it can be submitted anyway, see submit()
    } else if (force) {
      runValidation = force;
    } else if (self.isNotifying()) {
      runValidation = false;
    } else if (visuals.isConnected()) {
      runValidation = visuals.isUserMediaLoaded() || visuals.isReplayShown();
    } else if (visuals.isConnecting()) {
      runValidation = false;
    }

    if (runValidation) {
      self.emit(Events.VALIDATING, event);

      const visualsValid = visuals.validate() && buttons.isRecordAgainButtonEnabled();

      let whyInvalid;
      let invalidData;

      if (form) {
        const invalidInput = form.getInvalidElement();

        if (invalidInput) {
          valid = false;

          whyInvalid = `Input "${invalidInput.name}" seems wrong 🤔`;
          invalidData = { [invalidInput.name]: invalidInput.value };
        } else if (!areVisualsHidden() && !visualsValid) {
          // TODO Improve this check to have this based on `key`
          if (
            buttonsAreReady() ||
            self.isRecording() ||
            self.isPaused() ||
            self.isCountingDown()
          ) {
            valid = false;
            whyInvalid = "Don't forget to record a video 😉";
          }
        }

        if (valid) {
          /*
           * If CC and/or BCC exist, validate one more time to ensure at least
           * one recipient is given
           */
          const recipients = form.getRecipients();

          const toIsConfigured = "to" in recipients;
          const ccIsConfigured = "cc" in recipients;
          const bccIsConfigured = "bcc" in recipients;

          const hasTo = recipients.to?.length > 0;
          const hasCc = recipients.cc?.length > 0;
          const hasBcc = recipients.bcc?.length > 0;

          if (toIsConfigured) {
            if (!hasTo) {
              if (ccIsConfigured && bccIsConfigured) {
                if (!hasCc && !hasBcc) {
                  valid = false;
                }
              } else if (ccIsConfigured) {
                if (!hasCc) {
                  valid = false;
                }
              } else if (bccIsConfigured) {
                if (!hasBcc) {
                  valid = false;
                }
              } else {
                valid = false;
              }
            }
          } else if (ccIsConfigured) {
            if (!hasCc) {
              if (bccIsConfigured && !hasBcc) {
                valid = false;
              }
            }
          } else if (bccIsConfigured) {
            // Skip as it's hidden
          } else {
            // Form has no input fields for recipients, so don't validate
            // recipients at all
          }

          if (!valid) {
            whyInvalid = "At least one recipient is required";
          }
        }
      } else {
        valid = visualsValid;
      }

      if (valid) {
        self.emit(Events.VALID);
      } else if (invalidData) {
        self.emit(Events.INVALID, whyInvalid, invalidData);
      } else {
        self.emit(Events.INVALID, whyInvalid);
      }

      lastValidation = valid;
    }

    return valid;
  };

  this.disableForm = function (buttonsToo) {
    form && form.disable(buttonsToo);
  };

  this.enableForm = function (buttonsToo) {
    form && form.enable(buttonsToo);
  };

  this.hasForm = function () {
    return Boolean(form);
  };

  function buttonsAreReady() {
    return buttons.isReady();
  }

  function isPost(method) {
    return method && method.toUpperCase() === "POST";
  }

  function isPut(method) {
    return method && method.toUpperCase() === "PUT";
  }

  this.submitAll = function (formData, method, url) {
    debug(`Container: submitAll(${method}: "${url}")`);

    const post = isPost(method);
    const hasVideomailKey = Boolean(formData[options.selectors.keyInputName]);

    function startSubmission() {
      self.beginWaiting();
      self.disableForm(true);
      self.emit(Events.SUBMITTING);
    }

    // a closure so that we can access method
    const submitVideomailCallback = function (err1, videomail, videomailResponse) {
      if (err1) {
        finalizeSubmissions(err1, method, videomail, videomailResponse);
      } else if (post) {
        submitForm(formData, videomailResponse, url, function (err2, formResponse) {
          finalizeSubmissions(err2, method, videomail, videomailResponse, formResponse);
        });
      } else {
        // it's a direct submission
        finalizeSubmissions(null, method, videomail, videomailResponse);
      }
    };

    /*
     * !hasVideomailKey makes it possible to submit form when videomail itself
     * is not optional.
     */
    if (!hasVideomailKey) {
      if (options.enableAutoSubmission) {
        startSubmission();
        submitForm(formData, null, url, function (err2, formResponse) {
          finalizeSubmissions(err2, method, null, null, formResponse);
        });
      }
      /*
       * ... and when the enableAutoSubmission option is false,
       * then that can mean, leave it to the framework to process with the form
       * validation/handling/submission itself. for example the ninja form
       * will want to highlight which one input are wrong.
       */
    } else {
      startSubmission();
      submitVideomail(formData, method, submitVideomailCallback);
    }
  };

  this.isBuilt = function () {
    return built;
  };

  this.isReplayShown = function () {
    return visuals.isReplayShown();
  };

  this.isDirty = function () {
    let isDirty = false;

    if (form) {
      if (visuals.isRecorderUnloaded()) {
        isDirty = false;
      } else if (submitted) {
        isDirty = false;
      } else if (self.isReplayShown() || self.isPaused()) {
        isDirty = true;
      }
    }

    return isDirty;
  };

  this.getReplay = function () {
    return visuals.getReplay();
  };

  this.isOutsideElementOf = function (element) {
    return element.parentNode !== containerElement && element !== containerElement;
  };

  this.hideForm = function (params) {
    // form check needed, see https://github.com/binarykitchen/videomail-client/issues/127
    form && form.hide();
    buttons && buttons.hide(params);
  };

  this.loadForm = function (videomail) {
    if (form) {
      form.loadVideomail(videomail);
      self.validate();
    }
  };

  this.enableAudio = function () {
    options.setAudioEnabled(true);
    self.emit(Events.ENABLING_AUDIO);
  };

  this.disableAudio = function () {
    options.setAudioEnabled(false);
    self.emit(Events.DISABLING_AUDIO);
  };

  this.submit = function () {
    debug("Container: submit()");
    lastValidation && form && form.doTheSubmit();
  };

  this.isCountingDown = visuals.isCountingDown.bind(visuals);
  this.isRecording = visuals.isRecording.bind(visuals);
  this.record = visuals.record.bind(visuals);
  this.resume = visuals.resume.bind(visuals);
  this.stop = visuals.stop.bind(visuals);
  this.recordAgain = visuals.recordAgain.bind(visuals);
};

inherits(Container, EventEmitter);

export default Container;
