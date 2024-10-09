import Constants from "./constants";
import Events from "./events";

import Resource from "./resource";

import Container from "./wrappers/container";
import { PartialVideomailClientOptions } from "./types/options";
import Videomail from "./types/Videomail";
import mergeWithDefaultOptions from "./util/options/mergeWithDefaultOptions";
import createError from "./util/error/createError";
import Despot from "./util/Despot";

class VideomailClient extends Despot {
  private container: Container;

  public static Events = Events;

  public static ENC_TYPE_APP_JSON = Constants.public.ENC_TYPE_APP_JSON;
  public static ENC_TYPE_FORM = Constants.public.ENC_TYPE_FORM;

  public constructor(options: PartialVideomailClientOptions) {
    super("VideomailClient", mergeWithDefaultOptions(options));

    this.validateOptions();

    this.container = new Container(this.options);
  }

  private validateOptions() {
    const width = this.options.video.width;

    if (width !== undefined && width % 2 !== 0) {
      throw createError({
        message: "Width must be divisible by two.",
        options: this.options,
      });
    }

    const height = this.options.video.height;

    if (height !== undefined && height % 2 !== 0) {
      throw createError({
        message: "Height must be divisible by two.",
        options: this.options,
      });
    }
  }

  public build() {
    /*
     * it can happen that it gets called twice, i.E. when an error is thrown
     * in the middle of the build() fn
     */
    if (!this.container.isBuilt()) {
      this.options.logger.debug("Client: build()");
      this.container.build();
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
  public replay(videomail: Videomail, replayParentElementId?: string) {
    if (this.container.isBuilt()) {
      // Auto unload
      this.unload();
    }

    this.container.build({
      playerOnly: true,
      replayParentElementId,
    });

    this.container.buildForm();
    this.container.loadForm(videomail);

    // Wait until ready to avoid HTTP 416 errors (request range unavailable)
    this.once(Events.REPLAY_SHOWN, () => {
      this.container.showReplayOnly();
    });

    const replay = this.container.getReplay();
    replay.setVideomail(videomail, true);

    const playerElement = replay.getElement();

    if (!playerElement) {
      throw new Error(`Failed to build a player element`);
    }

    return playerElement;
  }

  public startOver(keepHidden = false) {
    const replay = this.container.getReplay();

    replay.hide();
    replay.reset();

    this.container.startOver(keepHidden);
  }

  public hide() {
    this.container.hide();
  }

  public getByAlias(alias: string, cb) {
    const resource = new Resource(this.options);

    resource.getByAlias(alias, (err, videomail: Videomail) => {
      if (err) {
        cb(err);
      } else {
        cb(null, videomail);
      }
    });
  }

  public getByKey(key: string, cb) {
    const resource = new Resource(this.options);

    resource.getByKey(key, (err, videomail: Videomail) => {
      if (err) {
        cb(err);
      } else {
        cb(null, videomail);
      }
    });
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
