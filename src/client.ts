import Constants from "./constants";
import Events from "./events";

import Resource from "./resource";

import EventEmitter from "./util/EventEmitter";
import Container from "./wrappers/container";
import getBrowser from "./util/getBrowser";
import { VideomailClientOptions } from "./types/options";

Object.keys(Constants.public).forEach(function (name) {
  VideomailClient[name] = Constants.public[name];
});

class VideomailClient extends EventEmitter {
  private container;

  public static Events = Events;

  public static ENC_TYPE_APP_JSON = Constants.public.ENC_TYPE_APP_JSON;
  public static ENC_TYPE_FORM = Constants.public.ENC_TYPE_FORM;

  public constructor(options: VideomailClientOptions) {
    super(options);
    this.container = new Container(this.options);
  }

  public build() {
    let building = false;

    /*
     * it can happen that it gets called twice, i.E. when an error is thrown
     * in the middle of the build() fn
     */
    if (!building && !this.container.isBuilt()) {
      this.options.logger.debug("Client: build()");

      building = true;
      this.container.build();
      building = false;
    }
  }

  public show() {
    if (!this.container.isBuilt()) {
      this.build();
    }

    return this.container.show();
  }

  public unload(e?) {
    this.removeAllListeners();

    this.container.unload(e);
  }

  /*
   * Automatically adds a <video> element inside the given parentElement and
   * loads it with the videomail
   */
  public replay(videomail, replayParentElementId: string) {
    if (this.container.isBuilt()) {
      // Auto unload
      this.unload();
    }

    this.container.build({
      playerOnly: true,
      replayParentElementId: replayParentElementId,
    });

    if (videomail) {
      videomail = this.container.addPlayerDimensions(videomail);
    }

    this.container.buildForm();
    this.container.loadForm(videomail);

    // Wait until ready to avoid HTTP 416 errors (request range unavailable)
    this.once(Events.REPLAY_SHOWN, () => {
      this.container.showReplayOnly();
    });

    const replay = this.container.getReplay();
    replay.setVideomail(videomail, true);

    return replay.getElement();
  }

  public startOver(params) {
    const replay = this.container.getReplay();

    if (replay) {
      replay.hide();
      replay.reset();
    }

    this.container.startOver(params);
  }

  public hide() {
    this.container.hide();
  }

  public getByAlias(alias: string, cb) {
    const resource = new Resource(this.options);

    resource.getByAlias(alias, (err, videomail) => {
      if (err) {
        cb(err);
      } else {
        cb(null, this.container.addPlayerDimensions(videomail));
      }
    });
  }

  public getByKey(key: string, cb) {
    const resource = new Resource(this.options);

    resource.getByKey(key, (err, videomail) => {
      if (err) {
        cb(err);
      } else {
        cb(null, this.container.addPlayerDimensions(videomail));
      }
    });
  }

  public canRecord() {
    return getBrowser(this.options).canRecord();
  }

  // Returns true when a video has been recorded but is not submitted yet
  public isDirty() {
    return this.container.isDirty();
  }

  public isBuilt() {
    return this.container.isBuilt();
  }

  public isRecording() {
    return this.container.isRecording();
  }

  public submit() {
    this.container.submit();
  }

  public getLogLines() {
    if (this.options.logger?.getLines) {
      return this.options.logger.getLines();
    }
  }
}

export default VideomailClient;
