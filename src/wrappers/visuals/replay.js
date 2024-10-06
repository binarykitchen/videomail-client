import addEventListenerWithOptions from "add-eventlistener-with-options";
import hidden from "hidden";
import h from "hyperscript";
import inherits from "inherits";

import Events from "../../events";
import Browser from "../../util/browser";
import EventEmitter from "../../util/eventEmitter";

const Replay = function (parentElement, options) {
  EventEmitter.call(this, options, "Replay");

  const self = this;
  const browser = new Browser(options);
  const { debug } = options;

  let built;
  let replayElement;
  let videomail;

  function buildElement(replayParentElement = parentElement) {
    replayElement = h(`video.${options.selectors.replayClass}`);

    if (typeof replayParentElement === "string") {
      replayParentElement = document.getElementById(replayParentElement);

      if (!replayParentElement) {
        throw new Error(
          `No replay parent element container with ID ${replayParentElement} found.`,
        );
      }
    }

    const videoSelector = `video.${options.selectors.replayClass}`;

    replayElement = replayParentElement.querySelector(videoSelector);

    // If none exists, create one then
    if (!replayElement) {
      replayElement = h(videoSelector);
      replayParentElement.appendChild(replayElement);
    }
  }

  // Questionable, does not make sense
  function isStandalone() {
    return parentElement.constructor.name === "HTMLDivElement";
  }

  function copyAttributes(newVideomail) {
    let attributeContainer;

    Object.keys(newVideomail).forEach(function (attribute) {
      attributeContainer = replayElement.parentNode.querySelector(`.${attribute}`);

      if (attributeContainer) {
        const empty =
          !attributeContainer.innerHTML || attributeContainer.innerHTML.length < 1;

        // Do not overwrite when already set before, e
        // e.g. with a React component adding links to the body
        if (empty) {
          attributeContainer.innerHTML = newVideomail[attribute];
        }
      }
    });
  }

  function correctDimensions(options) {
    let height, width;

    if (videomail && videomail.playerWidth) {
      width = videomail.playerWidth;
    } else if (parentElement.calculateWidth) {
      width = parentElement.calculateWidth(options);
    }

    if (videomail && videomail.playerHeight) {
      height = videomail.playerHeight;
    } else if (parentElement.calculateHeight) {
      height = parentElement.calculateHeight(options);
    }

    if (width > 0) {
      replayElement.style.width = `${width}px`;
    } else {
      replayElement.style.width = "auto";
    }

    if (height > 0) {
      replayElement.style.height = `${height}px`;
    } else {
      replayElement.style.height = "auto";
    }
  }

  this.setVideomail = function (newVideomail, playerOnly = false) {
    videomail = newVideomail;

    if (videomail) {
      if (videomail.mp4) {
        this.setMp4Source(videomail.mp4);
      }

      if (videomail.webm) {
        this.setWebMSource(videomail.webm);
      }

      if (videomail.vtt) {
        setTrackSource(videomail.vtt);
      }

      if (videomail.poster) {
        replayElement.setAttribute("poster", videomail.poster);
      }

      copyAttributes(videomail);
    }

    const width = videomail && videomail.width;
    const height = videomail && videomail.height;

    const hasAudio =
      videomail && videomail.recordingStats && videomail.recordingStats.sampleRate > 0;

    this.show(width, height, hasAudio, playerOnly);
  };

  this.show = function (recorderWidth, recorderHeight, hasAudio, playerOnly = false) {
    if (!replayElement) {
      return;
    }

    if (self.isShown()) {
      // Skip, already shown
      return;
    }

    debug(`Replay: show(playerOnly=${playerOnly})`);

    if (videomail) {
      correctDimensions({
        responsive: true,
        // beware that recorderWidth and recorderHeight can be null sometimes
        videoWidth: recorderWidth || replayElement.videoWidth,
        videoHeight: recorderHeight || replayElement.videoHeight,
      });
    }

    hidden(replayElement, false);

    if (playerOnly) {
      hidden(replayElement.parentNode, false);
    } else if (parentElement) {
      // parent element can be any object, be careful!
      if (parentElement.style) {
        hidden(parentElement, false);
      } else if (parentElement.show) {
        parentElement.show();
      }
    }

    if (hasAudio) {
      /*
       * https://github.com/binarykitchen/videomail-client/issues/115
       * do not set mute to false as this will mess up. just do not mention this attribute at all
       */
      replayElement.setAttribute("volume", 1);
    } else if (!options.isAudioEnabled()) {
      replayElement.setAttribute("muted", true);
    }

    // this forces to actually fetch the videos from the server
    replayElement.load();

    if (!videomail) {
      replayElement.addEventListener(
        "canplaythrough",
        function () {
          self.emit(Events.PREVIEW_SHOWN);
        },
        { once: true },
      );
    } else {
      replayElement.addEventListener(
        "canplaythrough",
        function () {
          self.emit(Events.REPLAY_SHOWN);
        },
        { once: true },
      );
    }
  };

  this.build = function (replayParentElement) {
    debug(
      `Replay: build (${replayParentElement ? `replayParentElement="${replayParentElement.id}"` : ""})`,
    );

    replayElement = parentElement.querySelector(`video.${options.selectors.replayClass}`);

    if (!replayElement) {
      buildElement(replayParentElement);
    }

    this.hide();

    replayElement.setAttribute("autoplay", true);
    replayElement.setAttribute("autostart", true);
    replayElement.setAttribute("autobuffer", true);
    replayElement.setAttribute("playsinline", true);
    replayElement.setAttribute("webkit-playsinline", "webkit-playsinline");
    replayElement.setAttribute("controls", "controls");
    replayElement.setAttribute("preload", "auto");

    if (!built) {
      if (!isStandalone()) {
        this.on(Events.PREVIEW, function (_key, recorderWidth, recorderHeight) {
          self.show(recorderWidth, recorderHeight);
        });
      }

      /*
       * makes use of passive option automatically for better performance
       * https://www.npmjs.com/package/add-eventlistener-with-options
       */
      addEventListenerWithOptions(replayElement, "touchstart", function (e) {
        try {
          e && e.preventDefault();
        } catch (exc) {
          /*
           * ignore errors like
           * Unable to preventDefault inside passive event listener invocation.
           */
        }

        if (this.paused) {
          play();
        } else {
          pause();
        }
      });

      replayElement.onclick = function (e) {
        e && e.preventDefault();

        if (this.paused) {
          play();
        } else {
          pause();
        }
      };
    }

    built = true;

    debug("Replay: built.");
  };

  this.unload = function () {
    debug("Replay: unload()");

    self.removeAllListeners();

    replayElement.remove();

    replayElement = undefined;
    videomail = undefined;

    built = false;
  };

  this.getVideoSource = function (type) {
    if (!replayElement) {
      return;
    }

    const sources = replayElement.getElementsByTagName("source");
    const l = sources && sources.length;
    const videoType = `video/${type}`;

    let source;

    if (l) {
      let i;

      for (i = 0; i < l && !source; i++) {
        if (sources[i].getAttribute("type") === videoType) {
          source = sources[i];
        }
      }
    }

    return source;
  };

  function setTrackSource(src) {
    if (!replayElement) {
      return;
    }

    const tracks = replayElement.getElementsByTagName("track");
    const firstTrack = tracks && tracks[0];

    if (firstTrack) {
      if (src) {
        firstTrack.setAttribute("src", src);
      } else {
        // Remove when no captions available
        replayElement.removeChild(firstTrack);
      }
    } else {
      // Insert one then
      const track = h("track", {
        src,
        // It's captions, not subtitles. Because for subtitles you must define the language, see
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
        kind: "captions",
        default: true,
      });

      replayElement.appendChild(track);

      // Because the local videomail server for development uses a different port, see
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
      replayElement.setAttribute("crossorigin", "anonymous");
    }
  }

  function setVideoSource(type, src, bustCache) {
    let source = self.getVideoSource(type);

    if (src && bustCache) {
      src += `?${Date.now()}`;
    }

    if (!source) {
      if (src) {
        const { fps } = options.video;

        // Ensure it's greater than the frame duration itself
        const t = 2 * (1 / fps);

        source = h("source", {
          /*
           * Ensures HTML video thumbnail turns up on iOS, see
           * https://muffinman.io/blog/hack-for-ios-safari-to-display-html-video-thumbnail/
           */
          src: `${src}#t=${t}`,
          type: `video/${type}`,
        });

        replayElement.appendChild(source);
      }
    } else if (src) {
      source.setAttribute("src", src);
    } else {
      replayElement.removeChild(source);
    }
  }

  this.setMp4Source = function (src, bustCache) {
    setVideoSource("mp4", src, bustCache);
  };

  this.setWebMSource = function (src, bustCache) {
    setVideoSource("webm", src, bustCache);
  };

  this.getVideoType = function () {
    return browser.getVideoType(replayElement);
  };

  function pause(cb) {
    /*
     * avoids race condition, inspired by
     * http://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error
     */
    setTimeout(() => {
      try {
        if (replayElement) {
          replayElement.pause();
        }
      } catch (exc) {
        // just ignore, see https://github.com/binarykitchen/videomail.io/issues/386
        options.logger.warn(exc);
      }

      cb && cb();
    }, 15);
  }

  function play() {
    if (replayElement && replayElement.play) {
      let p;

      try {
        p = replayElement.play();
      } catch (exc) {
        /*
         * this in the hope to catch InvalidStateError, see
         * https://github.com/binarykitchen/videomail-client/issues/149
         */
        options.logger.warn("Caught replay exception:", exc);
      }

      if (p && typeof Promise !== "undefined" && p instanceof Promise) {
        p.catch((reason) => {
          options.logger.warn("Caught pending replay promise exception: %s", reason);
        });
      }
    }
  }

  this.reset = function (cb) {
    // pause video to make sure it won't consume any memory
    pause(() => {
      if (replayElement) {
        self.setMp4Source(null);
        self.setWebMSource(null);
      }

      videomail = undefined;

      cb && cb();
    });
  };

  this.hide = function () {
    if (isStandalone()) {
      hidden(parentElement, true);
    } else if (replayElement) {
      hidden(replayElement, true);
      hidden(replayElement.parentNode, true);
    }
  };

  this.isShown = function () {
    if (!replayElement) {
      return false;
    }

    if (!parentElement) {
      return false;
    }

    return !hidden(replayElement) && !parentElement.isHidden();
  };

  this.getParentElement = function () {
    return parentElement;
  };

  this.getElement = function () {
    return replayElement;
  };
};

inherits(Replay, EventEmitter);

export default Replay;
