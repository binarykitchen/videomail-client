import Constants from "./constants";
import Resource from "./resource";
import { PartialVideomailClientOptions } from "./types/options";
import { Videomail } from "./types/Videomail";
import Despot from "./util/Despot";
import createError from "./util/error/createError";
import mergeWithDefaultOptions from "./util/options/mergeWithDefaultOptions";
import Container from "./wrappers/container";

export interface StartOverParams {
  keepHidden?: boolean | undefined;
}

export interface ShowParams {
  goBack?: boolean | undefined;
  playerOnly?: boolean | undefined;
}

class VideomailClient extends Despot {
  private readonly container: Container;

  public static readonly ENC_TYPE_APP_JSON = Constants.public.ENC_TYPE_APP_JSON;
  public static readonly ENC_TYPE_FORM = Constants.public.ENC_TYPE_FORM;

  public constructor(options: PartialVideomailClientOptions = {}) {
    super("VideomailClient", mergeWithDefaultOptions(options));

    this.validateOptions();

    Despot.removeAllListeners();

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
     * It can happen that it gets called twice, i.E. when an error is thrown
     * in the middle of the build() fn
     */
    if (!this.container.isBuilt()) {
      this.options.logger.debug("Client: build()");
      return this.container.build();
    }

    return undefined;
  }

  public show(params?: ShowParams) {
    this.build();

    return this.container.show(params);
  }

  public startOver(params?: StartOverParams) {
    this.unload(true);

    this.container.startOver(params);
  }

  // Useful for altering limit when user has changed options in real-time like
  // enabling/disabling audio etc
  public setLimitSeconds(limitSeconds: number) {
    if (this.options.video.limitSeconds === limitSeconds) {
      this.options.logger.debug(
        `Client: setLimitSeconds called but limitSeconds is already ${limitSeconds}, doing nothing.`,
      );

      return;
    }

    this.options.video.limitSeconds = limitSeconds;

    this.options.logger.debug(`Client: setLimitSeconds (limitSeconds = ${limitSeconds})`);

    this.container.setLimitSeconds(limitSeconds);
  }

  public unload(startingOver = false) {
    this.container.unload({ startingOver });
  }

  /*
   * Automatically adds a <video> element inside the given parentElement and
   * loads it with the videomail
   */
  public replay(videomail: Videomail, replayParentElementId?: string) {
    if (this.container.isBuilt()) {
      // Auto unload
      this.container.unload();
    }

    this.container.build({
      playerOnly: true,
      replayParentElementId,
    });

    this.container.buildForm();

    // Wait until ready to avoid HTTP 416 errors (request range unavailable)
    this.once("REPLAY_SHOWN", () => {
      this.container.showReplayOnly();
      this.container.loadForm(videomail);
    });

    const replay = this.container.getReplay();
    replay.setVideomail(videomail, true);

    const playerElement = replay.getElement();

    if (!playerElement) {
      throw new Error(`Failed to build a player element`);
    }

    return playerElement;
  }

  public hide() {
    this.container.hide();
  }

  public async getByAlias(alias: string) {
    const resource = new Resource(this.options);
    return await resource.getByAlias(alias);
  }

  public async getByKey(key: string) {
    const resource = new Resource(this.options);
    return await resource.getByKey(key);
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
    void this.container.submit();
  }

  public record() {
    this.container.record();
  }

  public getLogLines() {
    if (this.options.logger.getLines) {
      return this.options.logger.getLines();
    }

    return undefined;
  }
}

export { VideomailClient };
