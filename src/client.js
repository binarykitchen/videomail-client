import inherits from "inherits";

import Constants from "./constants";
import Events from "./events";
import Resource from "./resource";
import Browser from "./util/browser";
import adjustOptions from "./util/adjustOptions";
import EventEmitter from "./util/eventEmitter";
import Container from "./wrappers/container";

let browser;

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

    return container.show();
  };

  /*
   * Automatically adds a <video> element inside the given parentElement and
   * loads it with the videomail
   */
  this.replay = function (videomail, replayParentElementId) {
    if (container.isBuilt()) {
      // Auto unload
      this.unload();
    }

    container.build({
      playerOnly: true,
      replayParentElementId: replayParentElementId,
    });

    if (videomail) {
      videomail = container.addPlayerDimensions(videomail);
    }

    container.buildForm();
    container.loadForm(videomail);

    // Wait until ready to avoid HTTP 416 errors (request range unavailable)
    this.once(Events.REPLAY_SHOWN, function () {
      container.showReplayOnly();
    });

    const replay = container.getReplay();
    replay.setVideomail(videomail, true);

    return replay.getElement();
  };

  this.startOver = function (params) {
    const replay = container.getReplay();

    if (replay) {
      replay.hide();
      replay.reset();
    }

    container.startOver(params);
  };

  this.unload = function (e) {
    this.removeAllListeners();

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
