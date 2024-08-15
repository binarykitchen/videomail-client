import animitter from "animitter";
import Frame from "canvas-to-buffer";
import deepmerge from "deepmerge";
import hidden from "hidden";
import h from "hyperscript";
import inherits from "inherits";
import stringify from "safe-json-stringify";

import websocket from "websocket-stream";

import Constants from "../../constants";
import Events from "../../events";
import Browser from "../../util/browser";
import EventEmitter from "../../util/eventEmitter";
import Humanize from "../../util/humanize";
import pretty from "../../util/pretty";
import VideomailError from "../../util/videomailError";
import UserMedia from "./userMedia";

// credits http://1lineart.kulaone.com/#/
const PIPE_SYMBOL = "°º¤ø,¸¸,ø¤º°`°º¤ø,¸,ø¤°º¤ø,¸¸,ø¤º°`°º¤ø,¸ ";

const Recorder = function (visuals, replay, defaultOptions = {}) {
  EventEmitter.call(this, defaultOptions, "Recorder");

  const browser = new Browser(defaultOptions);

  const options = deepmerge(defaultOptions, {
    image: {
      // automatically lower quality when on mobile
      quality: browser.isMobile()
        ? defaultOptions.image.quality - 0.05
        : defaultOptions.image.quality,
    },
  });

  // validate some options this class needs
  if (!options.video || !options.video.fps) {
    throw VideomailError.create("FPS must be defined", options);
  }

  const self = this;
  const { debug } = options;

  let loop = null;

  let originalAnimationFrameObject;

  let samplesCount = 0;
  let framesCount = 0;
  let { facingMode } = options.video; // default is 'user'

  let recordingStats = {};

  let confirmedFrameNumber = 0;
  let confirmedSampleNumber = 0;

  let recorderElement;
  let userMedia;

  let userMediaTimeout;
  let retryTimeout;

  let bytesSum;

  let frameProgress;
  let sampleProgress;

  let canvas;
  let ctx;

  let userMediaLoaded;
  let userMediaLoading;
  let submitting;
  let unloaded;
  let stopTime;
  let stream;
  let connecting;
  let connected;
  let blocking;
  let built;
  let key;
  let waitingTime;

  let pingInterval;

  let frame;

  let recordingBufferLength;
  let recordingBuffer;

  function writeStream(buffer, opts) {
    if (stream) {
      if (stream.destroyed) {
        // prevents https://github.com/binarykitchen/videomail.io/issues/393
        stopPings();

        self.emit(
          Events.ERROR,
          VideomailError.create(
            "Already disconnected",
            "Sorry, connection to the server has been destroyed. Please reload.",
            options,
          ),
        );
      } else {
        const onFlushedCallback = opts && opts.onFlushedCallback;

        try {
          stream.write(buffer, function () {
            onFlushedCallback && onFlushedCallback(opts);
          });
        } catch (exc) {
          self.emit(
            Events.ERROR,
            VideomailError.create(
              "Failed writing to server",
              `stream.write() failed because of ${pretty(exc)}`,
              options,
            ),
          );
        }
      }
    }
  }

  function sendPings() {
    pingInterval = window.setInterval(function () {
      debug("Recorder: pinging...");
      writeStream(Buffer.from(""));
    }, options.timeouts.pingInterval);
  }

  function stopPings() {
    clearInterval(pingInterval);
  }

  function onAudioSample(audioSample) {
    samplesCount++;

    const audioBuffer = audioSample.toBuffer();

    /*
     * if (options.verbose) {
     *     debug(
     *         'Sample #' + samplesCount + ' (' + audioBuffer.length + ' bytes):'
     *     )
     * }
     */

    writeStream(audioBuffer);
  }

  function show() {
    recorderElement && hidden(recorderElement, false);
  }

  function onUserMediaReady(params = {}) {
    try {
      debug("Recorder: onUserMediaReady()", stringify(params));

      const { switchingFacingMode } = params;

      userMediaLoading = blocking = unloaded = submitting = false;
      userMediaLoaded = true;

      if (!switchingFacingMode) {
        loop = createLoop();
      }

      show();

      if (params.recordWhenReady) {
        self.record();
      }

      self.emit(Events.USER_MEDIA_READY, {
        switchingFacingMode: params.switchingFacingMode,
        paused: self.isPaused(),
        recordWhenReady: params.recordWhenReady,
      });
    } catch (exc) {
      self.emit(Events.ERROR, exc);
    }
  }

  function clearRetryTimeout() {
    debug("Recorder: clearRetryTimeout()");

    retryTimeout && clearTimeout(retryTimeout);
    retryTimeout = null;
  }

  function calculateFrameProgress() {
    return `${((confirmedFrameNumber / (framesCount || 1)) * 100).toFixed(2)}%`;
  }

  function calculateSampleProgress() {
    return `${((confirmedSampleNumber / (samplesCount || 1)) * 100).toFixed(2)}%`;
  }

  function updateOverallProgress() {
    /*
     * when progresses aren't initialized,
     * then do a first calculation to avoid `infinite` or `null` displays
     */

    if (!frameProgress) {
      frameProgress = calculateFrameProgress();
    }

    if (!sampleProgress) {
      sampleProgress = calculateSampleProgress();
    }

    self.emit(Events.PROGRESS, frameProgress, sampleProgress);
  }

  function updateFrameProgress(args) {
    confirmedFrameNumber = args.frame ? args.frame : confirmedFrameNumber;

    frameProgress = calculateFrameProgress();

    updateOverallProgress();
  }

  function updateSampleProgress(args) {
    confirmedSampleNumber = args.sample ? args.sample : confirmedSampleNumber;

    sampleProgress = calculateSampleProgress();

    updateOverallProgress();
  }

  function preview(args) {
    confirmedFrameNumber = confirmedSampleNumber = samplesCount = framesCount = 0;

    sampleProgress = frameProgress = null;

    key = args.key;

    /*
     * We are not serving MP4 videos anymore due to licensing but are keeping code
     * for compatibility and documentation
     */
    if (args.mp4) {
      replay.setMp4Source(
        `${args.mp4 + Constants.SITE_NAME_LABEL}/${options.siteName}/videomail.mp4`,
        true,
      );
    }

    if (args.webm) {
      replay.setWebMSource(
        `${args.webm + Constants.SITE_NAME_LABEL}/${options.siteName}/videomail.webm`,
        true,
      );
    }

    self.hide();

    const width = self.getRecorderWidth(true);
    const height = self.getRecorderHeight(true);

    self.emit(Events.PREVIEW, key, width, height);

    // keep it for recording stats
    waitingTime = Date.now() - stopTime;

    recordingStats.waitingTime = waitingTime;

    if (options.debug) {
      debug(
        "While recording, %s have been transferred and waiting time was %s",
        Humanize.filesize(bytesSum, 2),
        Humanize.toTime(waitingTime),
      );
    }
  }

  function initSocket(cb) {
    if (!connected) {
      connecting = true;

      debug("Recorder: initialising web socket to %s", options.socketUrl);

      self.emit(Events.CONNECTING);

      // https://github.com/maxogden/websocket-stream#binary-sockets

      /*
       * we use query parameters here because we cannot set custom headers in web sockets,
       * see https://github.com/websockets/ws/issues/467
       */

      const url2Connect = `${options.socketUrl}?${encodeURIComponent(
        Constants.SITE_NAME_LABEL,
      )}=${encodeURIComponent(options.siteName)}`;

      try {
        /*
         * websocket options cannot be set on client side, only on server, see
         * https://github.com/maxogden/websocket-stream/issues/116#issuecomment-296421077
         */
        stream = websocket(url2Connect, {
          perMessageDeflate: false,
          // see https://github.com/maxogden/websocket-stream/issues/117#issuecomment-298826011
          objectMode: true,
        });
      } catch (exc) {
        connecting = connected = false;

        let err;

        if (typeof websocket === "undefined") {
          err = VideomailError.create(
            "There is no websocket",
            `Cause: ${pretty(exc)}`,
            options,
          );
        } else {
          err = VideomailError.create(
            "Failed to connect to server",
            "Please upgrade your browser. Your current version does not seem to support websockets.",
            options,
            {
              browserProblem: true,
            },
          );
        }

        self.emit(Events.ERROR, err);
      }

      if (stream) {
        // useful for debugging streams

        /*
         * if (!stream.originalEmit) {
         *   stream.originalEmit = stream.emit
         * }
         */

        /*
         * stream.emit = function (type) {
         *   if (stream) {
         *     debug(PIPE_SYMBOL + 'Debugging stream event:', type)
         *     var args = Array.prototype.slice.call(arguments, 0)
         *     return stream.originalEmit.apply(stream, args)
         *   }
         * }
         */

        stream.on("close", function (err) {
          debug(`${PIPE_SYMBOL}Stream has closed`);

          connecting = connected = false;

          if (err) {
            self.emit(Events.ERROR, err || "Unhandled websocket error");
          } else {
            self.emit(Events.DISCONNECTED);

            // prevents from https://github.com/binarykitchen/videomail.io/issues/297 happening
            cancelAnimationFrame();
          }
        });

        stream.on("connect", function () {
          debug(`${PIPE_SYMBOL}Stream *connect* event emitted`);

          const isClosing = this.socket.readyState === WebSocket.CLOSING;

          if (!connected && !isClosing) {
            connected = true;
            connecting = unloaded = false;

            self.emit(Events.CONNECTED);

            cb && cb();
          }
        });

        stream.on("data", function (data) {
          debug(`${PIPE_SYMBOL}Stream *data* event emitted`);

          let command;

          try {
            command = JSON.parse(data.toString());
          } catch (exc) {
            debug("Failed to parse command:", exc);

            self.emit(
              Events.ERROR,
              VideomailError.create(
                "Invalid server command",
                // toString() since https://github.com/binarykitchen/videomail.io/issues/288
                `Contact us asap. Bad command was ${data.toString()}. `,
                options,
              ),
            );
          } finally {
            executeCommand.call(self, command);
          }
        });

        stream.on("error", function (err) {
          debug(`${PIPE_SYMBOL}Stream *error* event emitted`, err);

          connecting = connected = false;

          let videomailError;

          if (browser.isIOS()) {
            /*
             * setting custom text since that err object isn't really an error
             * on iphones when locked, and unlocked, this err is actually
             * an event object with stuff we can't use at all (an external bug)
             */
            videomailError = VideomailError.create(
              err,
              `iPhones cannot maintain a live connection for too long. Original error message is: ${err.toString()}`,
              options,
            );

            /*
             * Changed to the above temporarily for better investigations
             * videomailError = VideomailError.create(
             *   'Sorry, connection has timed out',
             *   'iPhones cannot maintain a live connection for too long,
             *   options
             * )
             */
          } else {
            // or else it could be a poor wifi connection...
            videomailError = VideomailError.create(
              "Data exchange interrupted",
              "Please check your network connection and reload.",
              options,
            );
          }

          self.emit(Events.ERROR, videomailError);
        });

        // just experimental

        stream.on("drain", function () {
          debug(`${PIPE_SYMBOL}Stream *drain* event emitted (should not happen!)`);
        });

        stream.on("preend", function () {
          debug(`${PIPE_SYMBOL}Stream *preend* event emitted`);
        });

        stream.on("end", function () {
          debug(`${PIPE_SYMBOL}Stream *end* event emitted`);
        });

        stream.on("drain", function () {
          debug(`${PIPE_SYMBOL}Stream *drain* event emitted`);
        });

        stream.on("pipe", function () {
          debug(`${PIPE_SYMBOL}Stream *pipe* event emitted`);
        });

        stream.on("unpipe", function () {
          debug(`${PIPE_SYMBOL}Stream *unpipe* event emitted`);
        });

        stream.on("resume", function () {
          debug(`${PIPE_SYMBOL}Stream *resume* event emitted`);
        });

        stream.on("uncork", function () {
          debug(`${PIPE_SYMBOL}Stream *uncork* event emitted`);
        });

        stream.on("readable", function () {
          debug(`${PIPE_SYMBOL}Stream *preend* event emitted`);
        });

        stream.on("prefinish", function () {
          debug(`${PIPE_SYMBOL}Stream *preend* event emitted`);
        });

        stream.on("finish", function () {
          debug(`${PIPE_SYMBOL}Stream *preend* event emitted`);
        });
      }
    }
  }

  function showUserMedia() {
    /*
     * use connected flag to prevent this from happening
     * https://github.com/binarykitchen/videomail.io/issues/323
     */
    return connected && (isNotifying() || !isHidden() || blocking);
  }

  function userMediaErrorCallback(err, extraA, extraB) {
    userMediaLoading = false;
    clearUserMediaTimeout();

    debug(
      "Recorder: userMediaErrorCallback()",
      ", name:",
      err.name,
      ", message:",
      err.message,
      ", Webcam characteristics:",
      userMedia.getCharacteristics(),
      // added recently in the hope to investigate weird webcam issues
      ", extraA arguments:",
      extraA ? extraA.toString() : undefined,
      ", extraB arguments:",
      extraB ? extraB.toString() : undefined,
    );

    const errorListeners = self.listeners(Events.ERROR);

    if (errorListeners && errorListeners.length) {
      if (err.name !== VideomailError.MEDIA_DEVICE_NOT_SUPPORTED) {
        self.emit(Events.ERROR, VideomailError.create(err, options));
      } else {
        // do not emit but retry since MEDIA_DEVICE_NOT_SUPPORTED can be a race condition
        debug("Recorder: ignore user media error", err);
      }

      // retry after a while
      retryTimeout = setTimeout(initSocket, options.timeouts.userMedia);
    } else if (unloaded) {
      /*
       * This can happen when a container is unloaded but some user media related callbacks
       * are still in process. In that case ignore error.
       */
      debug("Recorder: already unloaded. Not going to throw error", err);
    } else {
      debug("Recorder: no error listeners attached but throwing error", err);

      // weird situation, throw it instead of emitting since there are no error listeners
      throw VideomailError.create(
        err,
        "Unable to process this error since there are no error listeners anymore.",
        options,
      );
    }
  }

  function getUserMediaCallback(localStream, params) {
    debug("Recorder: getUserMediaCallback()", stringify(params));

    if (showUserMedia()) {
      try {
        clearUserMediaTimeout();

        userMedia.init(
          localStream,
          function () {
            onUserMediaReady(params);
          },
          onAudioSample.bind(self),
          function (err) {
            self.emit(Events.ERROR, err);
          },
          params,
        );
      } catch (exc) {
        self.emit(Events.ERROR, exc);
      }
    }
  }

  function loadGenuineUserMedia(params) {
    if (!navigator) {
      throw new Error("Navigator is missing!");
    }

    debug("Recorder: loadGenuineUserMedia()");

    self.emit(Events.ASKING_WEBCAM_PERMISSION);

    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // prefer the front camera (if one is available) over the rear one
      const constraints = {
        video: {
          facingMode,
          frameRate: { ideal: options.video.fps },
        },
        audio: options.isAudioEnabled(),
      };

      if (browser.isOkSafari()) {
        /*
         * do not use those width/height constraints yet,
         * current safari would throw an error
         * todo in https://github.com/binarykitchen/videomail-client/issues/142
         */
      } else {
        if (options.hasDefinedWidth()) {
          constraints.video.width = { ideal: options.video.width };
        } else {
          /*
           * otherwise try to apply the same width as the element is having
           * but there is no 100% guarantee that this will happen. not
           * all webcam drivers behave the same way
           */
          constraints.video.width = { ideal: self.limitWidth() };
        }

        if (options.hasDefinedHeight()) {
          constraints.video.height = { ideal: options.video.height };
        }
      }

      debug("Recorder: navigator.mediaDevices.getUserMedia()", stringify(constraints));

      if (navigator.mediaDevices.getSupportedConstraints) {
        debug(
          "Recorder: navigator.mediaDevices.getSupportedConstraints()",
          stringify(navigator.mediaDevices.getSupportedConstraints()),
        );
      }

      const genuineUserMediaRequest = navigator.mediaDevices.getUserMedia(constraints);

      if (genuineUserMediaRequest) {
        genuineUserMediaRequest
          .then(function (localStream) {
            getUserMediaCallback(localStream, params);
          })
          .catch(userMediaErrorCallback);
      } else {
        /*
         * this to trap errors like these
         * Cannot read property 'then' of undefined
         */

        // todo retry with navigator.getUserMedia_() maybe?
        throw VideomailError.create(
          "Sorry, your browser is unable to use cameras.",
          "Try a different browser with better user media functionalities.",
          options,
        );
      }
    } else {
      debug("Recorder: navigator.getUserMedia()");

      navigator.getUserMedia_(
        {
          video: true,
          audio: options.isAudioEnabled(),
        },
        getUserMediaCallback,
        userMediaErrorCallback,
      );
    }
  }

  function loadUserMedia(params = {}) {
    if (userMediaLoaded) {
      debug("Recorder: skipping loadUserMedia() because it is already loaded");
      onUserMediaReady(params);
      return false;
    } else if (userMediaLoading) {
      debug(
        "Recorder: skipping loadUserMedia() because it is already asking for permission",
      );
      return false;
    }

    debug("Recorder: loadUserMedia()", params);

    self.emit(Events.LOADING_USER_MEDIA);

    try {
      userMediaTimeout = setTimeout(function () {
        if (!self.isReady()) {
          self.emit(Events.ERROR, browser.getNoAccessIssue());
        }
      }, options.timeouts.userMedia);

      userMediaLoading = true;

      loadGenuineUserMedia(params);
    } catch (exc) {
      debug("Recorder: failed to load genuine user media");

      userMediaLoading = false;

      const errorListeners = self.listeners(Events.ERROR);

      if (errorListeners.length) {
        self.emit(Events.ERROR, exc);
      } else {
        debug("Recorder: no error listeners attached but throwing exception", exc);
        throw exc; // throw it further
      }
    }
  }

  function executeCommand(command) {
    try {
      debug(
        "Server commanded: %s",
        command.command,
        command.args ? `, ${stringify(command.args)}` : "",
      );

      switch (command.command) {
        case "ready":
          this.emit(Events.SERVER_READY);

          if (!userMediaTimeout) {
            if (options.loadUserMediaOnRecord) {
              // Still show it but have it blank
              show();
            } else {
              loadUserMedia();
            }
          }
          break;
        case "preview":
          preview(command.args);
          break;
        case "error":
          this.emit(
            Events.ERROR,
            VideomailError.create(
              "Oh no, server error!",
              command.args.err.toString() || "(No message given)",
              options,
            ),
          );
          break;
        case "confirmFrame":
          updateFrameProgress(command.args);
          break;
        case "confirmSample":
          updateSampleProgress(command.args);
          break;
        case "beginAudioEncoding":
          this.emit(Events.BEGIN_AUDIO_ENCODING);
          break;
        case "beginVideoEncoding":
          this.emit(Events.BEGIN_VIDEO_ENCODING);
          break;
        default:
          this.emit(Events.ERROR, `Unknown server command: ${command.command}`);
          break;
      }
    } catch (exc) {
      self.emit(Events.ERROR, exc);
    }
  }

  function isNotifying() {
    return visuals.isNotifying();
  }

  function isHidden() {
    return !recorderElement || hidden(recorderElement);
  }

  function writeCommand(command, args, cb) {
    if (!cb && args && args.constructor === Function) {
      cb = args;
      args = null;
    }

    if (!connected) {
      debug("Reconnecting for the command", command, "…");

      initSocket(function () {
        writeCommand(command, args);
        cb && cb();
      });
    } else if (stream) {
      debug("$ %s", command, args);

      const commandObj = {
        command,
        args,
      };

      /*
       * todo commented out because for some reasons server does
       * not accept such a long array of many log lines. to examine later.
       *
       * add some useful debug info to examine weird stuff like this one
       * UnprocessableError: Unable to encode a video with FPS near zero.
       * todo consider removing this later or have it for debug=1 only?
       *
       * if (options.logger && options.logger.getLines) {
       *   commandObj.logLines = options.logger.getLines()
       * }
       */

      writeStream(Buffer.from(stringify(commandObj)));

      if (cb) {
        // keep all callbacks async
        setTimeout(function () {
          cb();
        }, 0);
      }
    }
  }

  function cancelAnimationFrame() {
    loop && loop.dispose();
  }

  function getIntervalSum() {
    return loop.getElapsedTime();
  }

  function getAvgInterval() {
    return getIntervalSum() / framesCount;
  }

  function getAvgFps() {
    return (framesCount / getIntervalSum()) * 1000;
  }

  this.getRecordingStats = function () {
    return recordingStats;
  };

  this.getAudioSampleRate = function () {
    return userMedia.getAudioSampleRate();
  };

  this.stop = function (params) {
    debug("stop()", params);

    const { limitReached } = params;

    this.emit(Events.STOPPING, limitReached);

    loop.complete();

    const self = this;

    /*
     * needed to give dom enough time to prepare the replay element
     * to show up upon the STOPPING event so that we can evaluate
     * the right video type
     */
    setTimeout(function () {
      stopTime = Date.now();

      recordingStats = {
        /*
         * do not use loop.getFPS() as this will only return the fps from the last delta,
         * not the average. see https://github.com/hapticdata/animitter/issues/3
         */
        avgFps: getAvgFps(),
        wantedFps: options.video.fps,
        avgInterval: getAvgInterval(),
        wantedInterval: 1e3 / options.video.fps,

        intervalSum: getIntervalSum(),
        framesCount,
        videoType: replay.getVideoType(),
      };

      if (options.isAudioEnabled()) {
        recordingStats.samplesCount = samplesCount;
        recordingStats.sampleRate = userMedia.getAudioSampleRate();
      }

      writeCommand("stop", recordingStats, function () {
        self.emit(Events.STOPPED, { recordingStats });
      });

      // beware, resetting will set framesCount to zero, so leave this here
      self.reset();
    }, 60);
  };

  this.back = function (cb) {
    this.emit(Events.GOING_BACK);

    show();
    this.reset();

    writeCommand("back", cb);
  };

  function reInitialiseAudio() {
    debug("Recorder: reInitialiseAudio()");

    clearUserMediaTimeout();

    // important to free memory
    userMedia && userMedia.stop();

    userMediaLoaded = key = canvas = ctx = null;

    loadUserMedia();
  }

  this.unload = function (e) {
    if (!unloaded) {
      let cause;

      if (e) {
        cause = e.name || e.statusText || e.toString();
      }

      debug(`Recorder: unload()${cause ? `, cause: ${cause}` : ""}`);

      this.reset();

      clearUserMediaTimeout();

      if (userMedia) {
        // prevents https://github.com/binarykitchen/videomail-client/issues/114
        userMedia.unloadRemainingEventListeners();
      }

      if (submitting) {
        // server will disconnect socket automatically after submitting
      } else if (stream) {
        /*
         * force to disconnect socket right now to clean temp files on server
         * event listeners will do the rest
         */
        debug(`Recorder: ending stream ...`);
        stream.destroy();
        stream = undefined;
      }

      unloaded = true;
      built = connecting = connected = false;
    }
  };

  this.reset = function () {
    // no need to reset when already unloaded
    if (!unloaded) {
      debug("Recorder: reset()");

      this.emit(Events.RESETTING);

      cancelAnimationFrame();

      // important to free memory
      userMedia && userMedia.stop();

      replay.reset();

      userMediaLoaded =
        key =
        canvas =
        ctx =
        recordingBuffer =
        recordingBufferLength =
          null;
    }
  };

  function clearUserMediaTimeout() {
    if (userMediaTimeout) {
      debug("Recorder: clearUserMediaTimeout()");

      userMediaTimeout && clearTimeout(userMediaTimeout);
      userMediaTimeout = null;
    }
  }

  this.validate = function () {
    return connected && framesCount > 0 && canvas === null;
  };

  this.isReady = function () {
    return userMedia.isReady();
  };

  this.pause = function (params) {
    const e = params && params.event;

    if (e instanceof window.Event) {
      params.eventType = e.type;
    }

    debug(`pause() at frame ${framesCount}`, params);

    userMedia.pause();
    loop.stop();

    this.emit(Events.PAUSED);

    sendPings();
  };

  this.isPaused = function () {
    return userMedia && userMedia.isPaused();
  };

  this.resume = function () {
    debug(`Recorder: resume() with frame ${framesCount}`);

    stopPings();

    this.emit(Events.RESUMING);

    userMedia.resume();
    loop.start();
  };

  function onFlushed(opts) {
    const frameNumber = opts && opts.frameNumber;

    if (frameNumber === 1) {
      self.emit(Events.FIRST_FRAME_SENT);
    }
  }

  function draw(deltaTime, elapsedTime) {
    try {
      // ctx and stream might become null while unloading
      if (!self.isPaused() && stream && ctx) {
        if (framesCount === 0) {
          self.emit(Events.SENDING_FIRST_FRAME);
        }

        framesCount++;

        ctx.drawImage(userMedia.getRawVisuals(), 0, 0, canvas.width, canvas.height);

        recordingBuffer = frame.toBuffer();
        recordingBufferLength = recordingBuffer.length;

        if (recordingBufferLength < 1) {
          throw VideomailError.create("Failed to extract webcam data.", options);
        }

        bytesSum += recordingBufferLength;

        const frameControlBuffer = Buffer.from(stringify({ frameNumber: framesCount }));
        const frameBuffer = Buffer.concat([recordingBuffer, frameControlBuffer]);

        writeStream(frameBuffer, {
          frameNumber: framesCount,
          onFlushedCallback: onFlushed,
        });

        /*
         * if (options.verbose) {
         *   debug(
         *     'Frame #' + framesCount + ' (' + recordingBufferLength + ' bytes):',
         *     ' delta=' + deltaTime + 'ms, ' +
         *     ' elapsed=' + elapsedTime + 'ms'
         *   )
         * }
         */

        visuals.checkTimer({ intervalSum: elapsedTime });
      }
    } catch (exc) {
      self.emit(Events.ERROR, exc);
    }
  }

  function createLoop() {
    const newLoop = animitter({ fps: options.video.fps }, draw);

    // remember it first
    originalAnimationFrameObject = newLoop.getRequestAnimationFrameObject();

    return newLoop;
  }

  this.record = function () {
    if (unloaded) {
      return false;
    }

    // reconnect when needed
    if (!connected) {
      debug("Recorder: reconnecting before recording ...");

      initSocket(function () {
        self.once(Events.USER_MEDIA_READY, self.record);
      });

      return false;
    }

    if (!userMediaLoaded) {
      if (options.loadUserMediaOnRecord) {
        loadUserMedia({ recordWhenReady: true });
      } else {
        self.emit(
          Events.ERROR,
          VideomailError.create("Load and enable your camera first", options),
        );
      }

      return false; // do nothing further
    }

    try {
      canvas = userMedia.createCanvas();
    } catch (exc) {
      self.emit(Events.ERROR, VideomailError.create(exc, options));

      return false;
    }

    ctx = canvas.getContext("2d");

    if (!canvas.width) {
      self.emit(
        Events.ERROR,
        VideomailError.create("Canvas has an invalid width.", options),
      );

      return false;
    }

    if (!canvas.height) {
      self.emit(
        Events.ERROR,
        VideomailError.create("Canvas has an invalid height.", options),
      );

      return false;
    }

    bytesSum = 0;

    frame = new Frame(canvas, options.image.types, options.image.quality);

    debug("Recorder: record()");
    userMedia.record();

    self.emit(Events.RECORDING, framesCount);

    // see https://github.com/hapticdata/animitter/issues/3
    loop.on("update", function (deltaTime, elapsedTime) {
      // x1000 because of milliseconds
      const avgFPS = (framesCount / elapsedTime) * 1000;
      debug("Recorder: avgFps =", Math.round(avgFPS));
    });

    loop.start();
  };

  function setAnimationFrameObject(newObj) {
    /*
     * must stop and then start to make it become effective, see
     * https://github.com/hapticdata/animitter/issues/5#issuecomment-292019168
     */
    if (loop) {
      const isRecording = self.isRecording();

      loop.stop();
      loop.setRequestAnimationFrameObject(newObj);

      if (isRecording) {
        loop.start();
      }
    }
  }

  function restoreAnimationFrameObject() {
    debug("Recorder: restoreAnimationFrameObject()");

    setAnimationFrameObject(originalAnimationFrameObject);
  }

  function loopWithTimeouts() {
    debug("Recorder: loopWithTimeouts()");

    const wantedInterval = 1e3 / options.video.fps;

    let processingTime = 0;
    let start;

    function raf(fn) {
      return setTimeout(
        function () {
          start = Date.now();
          fn();
          processingTime = Date.now() - start;
        },
        /*
         * reducing wanted interval by respecting the time it takes to
         * compute internally since this is not multi-threaded like
         * requestAnimationFrame
         */
        wantedInterval - processingTime,
      );
    }

    function cancel(id) {
      clearTimeout(id);
    }

    setAnimationFrameObject({
      requestAnimationFrame: raf,
      cancelAnimationFrame: cancel,
    });
  }

  function buildElement() {
    recorderElement = h(`video.${options.selectors.userMediaClass}`);

    visuals.appendChild(recorderElement);
  }

  function correctDimensions() {
    if (options.hasDefinedWidth()) {
      recorderElement.width = self.getRecorderWidth(true);
    }

    if (options.hasDefinedHeight()) {
      recorderElement.height = self.getRecorderHeight(true);
    }
  }

  function switchFacingMode() {
    if (!browser.isMobile()) {
      return false;
    }

    if (facingMode === "user") {
      facingMode = "environment";
    } else if (facingMode === "environment") {
      facingMode = "user";
    } else {
      debug("Recorder: unsupported facing mode", facingMode);
    }

    loadGenuineUserMedia({ switchingFacingMode: true });
  }

  function initEvents() {
    debug("Recorder: initEvents()");

    self
      .on(Events.SUBMITTING, function () {
        submitting = true;
      })
      .on(Events.SUBMITTED, function () {
        submitting = false;
        self.unload();
      })
      .on(Events.BLOCKING, function () {
        blocking = true;
        clearUserMediaTimeout();
      })
      .on(Events.HIDE, function () {
        self.hide();
      })
      .on(Events.LOADED_META_DATA, function () {
        correctDimensions();
      })
      .on(Events.DISABLING_AUDIO, function () {
        reInitialiseAudio();
      })
      .on(Events.ENABLING_AUDIO, function () {
        reInitialiseAudio();
      })
      .on(Events.INVISIBLE, function () {
        loopWithTimeouts();
      })
      .on(Events.VISIBLE, function () {
        restoreAnimationFrameObject();
      })
      .on(Events.SWITCH_FACING_MODE, function () {
        switchFacingMode();
      });
  }

  this.build = function () {
    let err = browser.checkRecordingCapabilities();

    if (!err) {
      err = browser.checkBufferTypes();
    }

    if (err) {
      this.emit(Events.ERROR, err);
    } else {
      recorderElement = visuals.querySelector(
        `video.${options.selectors.userMediaClass}`,
      );

      if (!recorderElement) {
        buildElement();
      }

      correctDimensions();

      /*
       * prevent audio feedback, see
       * https://github.com/binarykitchen/videomail-client/issues/35
       */
      recorderElement.muted = true;

      // for iphones, see https://github.com/webrtc/samples/issues/929
      recorderElement.setAttribute("playsinline", true);
      recorderElement.setAttribute("webkit-playsinline", "webkit-playsinline");

      /*
       * add these here, not in CSS because users can configure custom
       * class names
       */
      recorderElement.style.transform = "rotateY(180deg)";
      recorderElement.style["-webkit-transform"] = "rotateY(180deg)";
      recorderElement.style["-moz-transform"] = "rotateY(180deg)";

      if (options.video.stretch) {
        recorderElement.style.width = "100%";
      }

      if (!userMedia) {
        userMedia = new UserMedia(this, options);
      }

      show();

      if (!built) {
        initEvents();

        if (!connected) {
          initSocket();
        } else if (!options.loadUserMediaOnRecord) {
          loadUserMedia();
        }
      } else if (options.loadUserMediaOnRecord) {
        loadUserMedia();
      }

      built = true;
    }
  };

  this.isPaused = function () {
    return userMedia && userMedia.isPaused() && !loop.isRunning();
  };

  this.isRecording = function () {
    /*
     * checking for stream.destroyed needed since
     * https://github.com/binarykitchen/videomail.io/issues/296
     */
    return (
      loop &&
      loop.isRunning() &&
      !this.isPaused() &&
      !isNotifying() &&
      stream &&
      !stream.destroyed
    );
  };

  this.hide = function () {
    if (!isHidden()) {
      recorderElement && hidden(recorderElement, true);

      clearUserMediaTimeout();
      clearRetryTimeout();
    }
  };

  this.isUnloaded = function () {
    return unloaded;
  };

  /*
   * these two return the true dimensions of the webcam area.
   * needed because on mobiles they might be different.
   */

  this.getRecorderWidth = function (responsive) {
    if (userMedia && userMedia.hasVideoWidth()) {
      return userMedia.getRawWidth(responsive);
    } else if (responsive && options.hasDefinedWidth()) {
      return this.limitWidth(options.video.width);
    }
  };

  this.getRecorderHeight = function (responsive, useBoundingClientRect) {
    if (userMedia && useBoundingClientRect) {
      return recorderElement.getBoundingClientRect().height;
    } else if (userMedia) {
      return userMedia.getRawHeight(responsive);
    } else if (responsive && options.hasDefinedHeight()) {
      return this.calculateHeight(responsive);
    }
  };

  function getRatio() {
    let ratio;

    if (userMedia) {
      const userMediaVideoWidth = userMedia.getVideoWidth();

      // avoid division by zero
      if (userMediaVideoWidth < 1) {
        // use as a last resort fallback computation (needed for safari 11)
        ratio = visuals.getRatio();
      } else {
        ratio = userMedia.getVideoHeight() / userMediaVideoWidth;
      }
    } else {
      ratio = options.getRatio();
    }

    return ratio;
  }

  this.calculateWidth = function (responsive) {
    let videoHeight;

    if (userMedia) {
      videoHeight = userMedia.getVideoHeight();
    } else if (recorderElement) {
      videoHeight = recorderElement.videoHeight || recorderElement.height;
    }

    return visuals.calculateWidth({
      responsive,
      ratio: getRatio(),
      videoHeight,
    });
  };

  this.calculateHeight = function (responsive) {
    let videoWidth;

    if (userMedia) {
      videoWidth = userMedia.getVideoWidth();
    } else if (recorderElement) {
      videoWidth = recorderElement.videoWidth || recorderElement.width;
    }

    return visuals.calculateHeight({
      responsive,
      ratio: getRatio(),
      videoWidth,
    });
  };

  this.getRawVisualUserMedia = function () {
    return recorderElement;
  };

  this.isConnected = function () {
    return connected;
  };

  this.isConnecting = function () {
    return connecting;
  };

  this.limitWidth = function (width) {
    return visuals.limitWidth(width);
  };

  this.limitHeight = function (height) {
    return visuals.limitHeight(height);
  };

  this.isUserMediaLoaded = function () {
    return userMediaLoaded;
  };
};

inherits(Recorder, EventEmitter);

export default Recorder;
