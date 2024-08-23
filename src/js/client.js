import deepmerge from "deepmerge";
import inherits from "inherits";

import Constants from "./constants";
import Events from "./events";
import defaultOptions from "./options";
import Resource from "./resource";
import Browser from "./util/browser";
import CollectLogger from "./util/collectLogger";
import EventEmitter from "./util/eventEmitter";
import Container from "./wrappers/container";
import OptionsWrapper from "./wrappers/optionsWrapper";
import Replay from "./wrappers/visuals/replay";

let collectLogger;
let browser;

function adjustOptions(options = {}) {
  const localOptions = deepmerge(defaultOptions, options, {
    arrayMerge(destination, source) {
      return source;
    },
  });

  collectLogger ||= new CollectLogger(localOptions);

  localOptions.logger = collectLogger;
  localOptions.debug = localOptions.logger.debug;

  OptionsWrapper.addFunctions(localOptions);

  return localOptions;
}

function getBrowser(localOptions) {
  if (!browser) {
    browser = new Browser(localOptions);
  }

  return browser;
}

const VideomailClient = function (options) {
  const localOptions = adjustOptions(options);
  const container = new Container(localOptions);
  const { debug } = localOptions;

  let replay;

  this.events = Events;

  EventEmitter.call(this, localOptions, "VideomailClient");

  this.build = function () {
    let building = false;

    /*
     * it can happen that it gets called twice, i.E. when an error is thrown
     * in the middle of the build() fn
     */
    if (!building && !container.isBuilt()) {
      debug("Client: build()");

      building = true;
      container.build();
      building = false;
    }
  };

  this.show = function () {
    if (!container.isBuilt()) {
      this.build();
    }

    container.show();
  };

  /*
   * automatically adds a <video> element inside the given parentElement and loads
   * it with the videomail
   */
  this.replay = function (videomail, parentElement) {
    function buildReplay() {
      if (typeof parentElement === "string") {
        parentElement = document.getElementById(parentElement);
      }

      if (!parentElement) {
        if (!container.isBuilt()) {
          // this will try build all over again
          container.build(true);
        }

        if (!container.hasElement()) {
          throw new Error(
            "Unable to replay video without a container nor parent element.",
          );
        }
      } else if (container.isOutsideElementOf(parentElement)) {
        replay = new Replay(parentElement, localOptions);
        replay.build();
      }

      if (!replay) {
        replay = container.getReplay();
      }

      if (!parentElement) {
        parentElement = replay.getParentElement();
      }

      if (videomail) {
        videomail = container.addPlayerDimensions(videomail, parentElement);
      }

      container.buildForm(videomail);
      container.loadForm(videomail);

      // slight delay needed to avoid HTTP 416 errors (request range unavailable)
      setTimeout(function () {
        replay.setVideomail(videomail);
        container.showReplayOnly();
      }, 10e1); // not sure, but probably can be reduced a bit
    }

    buildReplay();
  };

  this.startOver = function (params) {
    if (replay) {
      replay.hide();
      replay.reset();
    }

    container.startOver(params);
  };

  this.unload = function (e) {
    container.unload(e);
  };

  this.hide = function () {
    container.hide();
  };

  this.getByAlias = function (alias, cb) {
    const resource = new Resource(localOptions);

    resource.getByAlias(alias, function (err, videomail) {
      if (err) {
        cb(err);
      } else {
        cb(null, container.addPlayerDimensions(videomail));
      }
    });
  };

  // Shim, backward compat
  this.get = this.getByAlias;

  this.getByKey = function (key, cb) {
    const resource = new Resource(localOptions);

    resource.getByKey(key, function (err, videomail) {
      if (err) {
        cb(err);
      } else {
        cb(null, container.addPlayerDimensions(videomail));
      }
    });
  };

  this.canRecord = function () {
    return getBrowser(localOptions).canRecord();
  };

  // Returns true when a video has been recorded but is not submitted yet
  this.isDirty = function () {
    return container.isDirty();
  };

  this.isBuilt = function () {
    return container.isBuilt();
  };

  this.isRecording = function () {
    return container.isRecording();
  };

  this.submit = function () {
    container.submit();
  };

  this.getLogLines = function () {
    if (localOptions.logger && localOptions.logger.getLines) {
      return localOptions.logger.getLines();
    }
  };
};

inherits(VideomailClient, EventEmitter);

Object.keys(Constants.public).forEach(function (name) {
  VideomailClient[name] = Constants.public[name];
});

// just another convenient thing
VideomailClient.Events = Events;

export default VideomailClient;
