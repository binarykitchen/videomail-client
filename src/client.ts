import Constants from "./constants";
import Resource from "./resource";
import type { VideomailEvents } from "./types/events";
import { PartialVideomailClientOptions } from "./types/options";
import { Videomail } from "./types/Videomail";
import Despot from "./util/Despot";
import createError from "./util/error/createError";
import ErrorReporter from "./util/error/ErrorReporter";
import mergeWithDefaultOptions from "./util/options/mergeWithDefaultOptions";
import pretty from "./util/string/pretty";
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
  private readonly errorReporter: ErrorReporter;

  public static readonly ENC_TYPE_APP_JSON = Constants.public.ENC_TYPE_APP_JSON;
  public static readonly ENC_TYPE_FORM = Constants.public.ENC_TYPE_FORM;

  public constructor(options: PartialVideomailClientOptions = {}) {
    super("VideomailClient", mergeWithDefaultOptions(options));

    this.errorReporter = new ErrorReporter(this.options);

    this.validateOptions();

    this.container = new Container(this.options, this.emitter, this.errorReporter);
  }

  private validateOptions() {
    const width = this.options.video.width;

    if (width !== undefined && width % 2 !== 0) {
      throw this.createReportedError("Width must be divisible by two.");
    }

    const height = this.options.video.height;

    if (height !== undefined && height % 2 !== 0) {
      throw this.createReportedError("Height must be divisible by two.");
    }
  }

  private createReportedError(message: string) {
    const err = createError({ message, options: this.options });
    this.errorReporter.report(err);

    return err;
  }

  // The host handles these rejections itself.
  // We still report them, then pass them on.
  private async reportFailure<T>(request: Promise<T>) {
    try {
      return await request;
    } catch (exc) {
      this.errorReporter.report(createError({ exc, options: this.options }));
      throw exc;
    }
  }

  /*
   * Listeners registered on the client belong to the host app.
   * A bug in one of them must not reset the user's take, so log it instead of raising an ERROR.
   */
  protected override handleListenerFailure(
    eventName: keyof VideomailEvents,
    exc: unknown,
  ) {
    const details = exc instanceof Error ? (exc.stack ?? exc.message) : pretty(exc);

    this.options.logger.error(`A listener for ${eventName} failed: ${details}`);
  }

  public build() {
    // An error during setup can trigger another build.
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

  // Adjust the limit when options change, such as toggling audio.
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

  // Add a player for this videomail inside the chosen parent.
  public replay(videomail: Videomail, replayParentElementId?: string) {
    if (this.container.isBuilt()) {
      this.container.unload();
    }

    this.container.build({
      playerOnly: true,
      replayParentElementId,
    });

    this.container.buildForm();

    // Wait until ready to avoid HTTP 416 errors (request range unavailable)
    this.once("REPLAY_SHOWN", () => {
      // Our own callback, registered on the host-facing client: raise failures as
      // ERROR ourselves, so they get displayed and reported like any recorder error.
      try {
        this.container.showReplayOnly();
        this.container.loadForm(videomail);
      } catch (exc) {
        this.emit("ERROR", { exc });
      }
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
    return await this.reportFailure(resource.getByAlias(alias));
  }

  public async getByKey(key: string) {
    const resource = new Resource(this.options);
    return await this.reportFailure(resource.getByKey(key));
  }

  public async getThreadByAlias(alias: string) {
    const resource = new Resource(this.options);
    return await this.reportFailure(resource.getThreadByAlias(alias));
  }

  public async getThreadByKey(key: string) {
    const resource = new Resource(this.options);
    return await this.reportFailure(resource.getThreadByKey(key));
  }

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

  public pause() {
    this.container.suspend();
  }

  public recoverConnection() {
    this.container.recoverConnection();
  }

  public recoverCamera() {
    return this.container.recoverCamera();
  }

  public getLogLines() {
    if (this.options.logger.getLines) {
      return this.options.logger.getLines();
    }

    return undefined;
  }
}

export { VideomailClient };
