import hidden from "hidden";
import h from "hyperscript";
import inherits from "inherits";

import Events from "../events";
import EventEmitter from "../util/eventEmitter";
import RecorderInsides from "./visuals/inside/recorderInsides";
import Notifier from "./visuals/notifier";
import Recorder from "./visuals/recorder";
import Replay from "./visuals/replay";

const Visuals = function (container, options) {
  EventEmitter.call(this, options, "Visuals");

  const self = this;

  // can be overwritten with setter fn
  const replay = new Replay(this, options);

  const recorder = new Recorder(this, replay, options);
  const recorderInsides = new RecorderInsides(this, options);

  const notifier = new Notifier(this, options);

  const { debug } = options;

  let visualsElement;
  let built;

  function buildNoScriptTag() {
    let noScriptElement = container.querySelector("noscript");

    if (!noScriptElement) {
      noScriptElement = h("noscript");
      noScriptElement.innerHTML = "Please enable Javascript";

      visualsElement.appendChild(noScriptElement);
    }
  }

  function buildChildren(playerOnly = false) {
    debug(`Visuals: buildChildren(playerOnly = ${playerOnly})`);

    buildNoScriptTag();

    if (!playerOnly) {
      notifier.build();
      recorderInsides.build();
    }

    replay.build();

    debug("Visuals: built.");
  }

  function initEvents(playerOnly = false) {
    if (!playerOnly) {
      debug(`Visuals: initEvents(playerOnly = ${playerOnly})`);

      self
        .on(Events.USER_MEDIA_READY, function () {
          built = true;
          self.endWaiting();
          container.enableForm(false);
        })
        .on(Events.PREVIEW, () => {
          self.endWaiting();
        })
        .on(Events.BLOCKING, function (blockingOptions) {
          if (!blockingOptions.hideForm && !options.adjustFormOnBrowserError) {
            /*
             * do nothing, user still can enter form inputs
             * can be useful when you are on i.E. Seeflow's contact page and
             * still want to tick off the webcam option
             */
          } else {
            container.disableForm(true);
          }
        })
        .on(Events.PREVIEW_SHOWN, function () {
          container.validate(true);
        })
        .on(Events.LOADED_META_DATA, function () {
          correctDimensions();
        })
        .on(Events.ERROR, function (err) {
          if (err.removeDimensions && err.removeDimensions()) {
            removeDimensions();
          }
        });
    }
  }

  function correctDimensions() {
    if (options.video.stretch) {
      removeDimensions();
    } else {
      visualsElement.style.width = `${self.getRecorderWidth(true)}px`;
      visualsElement.style.height = `${self.getRecorderHeight(true)}px`;
    }
  }

  function removeDimensions() {
    visualsElement.style.width = "auto";
    visualsElement.style.height = "auto";
  }

  this.getRatio = function () {
    if (visualsElement.clientWidth) {
      // special case for safari, see getRatio() in recorder
      return visualsElement.clientHeight / visualsElement.clientWidth;
    }

    return 0;
  };

  function isRecordable() {
    return !self.isNotifying() && !replay.isShown() && !self.isCountingDown();
  }

  this.isCountingDown = function () {
    return recorderInsides.isCountingDown();
  };

  this.build = function (playerOnly = false) {
    visualsElement = container.querySelector(`.${options.selectors.visualsClass}`);

    if (!visualsElement) {
      visualsElement = h(`div.${options.selectors.visualsClass}`);

      const buttonsElement = container.querySelector(
        `.${options.selectors.buttonsClass}`,
      );

      /*
       * make sure it's placed before the buttons, but only if it's a child
       * element of the container = inside the container
       */
      if (buttonsElement && !container.isOutsideElementOf(buttonsElement)) {
        container.insertBefore(visualsElement, buttonsElement);
      } else {
        container.appendChild(visualsElement);
      }
    }

    /*
     * do not hide visuals element so that apps can give it a predefined
     * width or height through css but hide all children
     */

    visualsElement.classList.add("visuals");

    correctDimensions();

    !built && initEvents(playerOnly);
    buildChildren(playerOnly);

    // needed for replay handling and container.isOutsideElementOf()
    self.parentNode = visualsElement.parentNode;

    built = true;
  };

  this.querySelector = function (selector) {
    return visualsElement && visualsElement.querySelector(selector);
  };

  this.appendChild = function (child) {
    visualsElement && visualsElement.appendChild(child);
  };

  this.removeChild = function (child) {
    visualsElement.removeChild(child);
  };

  this.reset = function () {
    this.endWaiting();
    recorder.reset();
  };

  this.beginWaiting = function () {
    container.beginWaiting();
  };

  this.endWaiting = function () {
    container.endWaiting();
  };

  this.stop = function (params) {
    recorder.stop(params);
    recorderInsides.hidePause();
  };

  this.back = function (params, cb) {
    if (!cb && params) {
      cb = params;
      params = {};
    }

    replay.hide();
    notifier.hide();

    if (params && params.keepHidden) {
      recorder.hide();
      cb && cb();
    } else {
      recorder.back(cb);
    }
  };

  this.recordAgain = function () {
    this.back(function () {
      if (options.loadUserMediaOnRecord) {
        self.once(Events.SERVER_READY, function () {
          self.record();
        });
      } else {
        self.once(Events.USER_MEDIA_READY, function () {
          self.record();
        });
      }
    });
  };

  this.unload = function (e) {
    debug("Visuals: unload()", e);

    try {
      recorder.unload(e);
      recorderInsides.unload(e);
      replay.unload(e);

      built = false;
    } catch (exc) {
      this.emit(Events.ERROR, exc);
    }
  };

  this.isNotifying = function () {
    return notifier.isVisible();
  };

  this.isReplayShown = function () {
    return replay.isShown();
  };

  this.pause = function (params) {
    recorder.pause(params);
    recorderInsides.showPause();
  };

  this.resume = function () {
    if (recorderInsides.isCountingDown()) {
      recorderInsides.resumeCountdown();
    } else {
      recorder.resume();
    }

    recorderInsides.hidePause();
  };

  this.pauseOrResume = function () {
    if (isRecordable.call(this)) {
      if (this.isRecording()) {
        this.pause();
      } else if (recorder.isPaused()) {
        this.resume();
      } else if (recorder.isReady()) {
        this.record();
      }
    }
  };

  this.recordOrStop = function () {
    if (isRecordable()) {
      if (this.isRecording()) {
        this.stop();
      } else if (recorder.isReady()) {
        this.record();
      }
    }
  };

  this.record = function () {
    if (options.video.countdown) {
      this.emit(Events.COUNTDOWN);
      recorderInsides.startCountdown(recorder.record.bind(recorder));
    } else {
      recorder.record();
    }
  };

  this.getRecorder = function () {
    return recorder;
  };

  this.getReplay = function () {
    return replay;
  };

  this.validate = function () {
    return recorder.validate() && this.isReplayShown();
  };

  this.getRecordingStats = function () {
    return recorder.getRecordingStats();
  };

  this.getAudioSampleRate = function () {
    return recorder.getAudioSampleRate();
  };

  this.isPaused = function () {
    return recorder.isPaused();
  };

  this.error = function (err) {
    notifier.error(err);
  };

  this.hide = function () {
    if (visualsElement) {
      hidden(visualsElement, true);
      this.emit(Events.HIDE);
    }
  };

  this.isHidden = function () {
    if (!built) {
      return true;
    } else if (visualsElement) {
      return hidden(visualsElement);
    }
  };

  this.showVisuals = function () {
    visualsElement && hidden(visualsElement, false);
  };

  this.show = function () {
    !this.isReplayShown() && visualsElement && recorder.build();
    this.showVisuals();
  };

  this.showReplayOnly = function () {
    !this.isReplayShown() && replay.show();

    this.show();
    recorder.hide();
    notifier.hide();
  };

  this.isRecorderUnloaded = function () {
    return recorder.isUnloaded();
  };

  this.isConnecting = function () {
    return recorder.isConnecting();
  };

  this.getRecorderWidth = function (responsive) {
    return recorder.getRecorderWidth(responsive);
  };

  this.getRecorderHeight = function (responsive, useBoundingClientRect) {
    return recorder.getRecorderHeight(responsive, useBoundingClientRect);
  };

  this.limitWidth = function (width) {
    return container.limitWidth(width, options);
  };

  this.limitHeight = function (height) {
    return container.limitHeight(height);
  };

  this.calculateWidth = function (options) {
    return container.calculateWidth(options);
  };

  this.calculateHeight = function (options) {
    return container.calculateHeight(options);
  };

  this.getReplay = function () {
    return replay;
  };

  this.getBoundingClientRect = function () {
    // fixes https://github.com/binarykitchen/videomail-client/issues/126
    return visualsElement && visualsElement.getBoundingClientRect();
  };

  this.checkTimer = function (intervalSum) {
    recorderInsides.checkTimer(intervalSum);
  };

  this.isNotifierBuilt = function () {
    return notifier && notifier.isBuilt();
  };

  this.isReplayShown = replay.isShown.bind(replay);
  this.hideReplay = replay.hide.bind(replay);
  this.hideRecorder = recorder.hide.bind(recorder);
  this.isRecording = recorder.isRecording.bind(recorder);
  this.isUserMediaLoaded = recorder.isUserMediaLoaded.bind(recorder);
  this.isConnected = recorder.isConnected.bind(recorder);
};

inherits(Visuals, EventEmitter);

export default Visuals;
