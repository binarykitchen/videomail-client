import Constants from "./constants";
import Resource from "./resource";
import type { VideomailEvents } from "./types/events";
import type {
  PartialVideomailClientOptions,
  VideomailClientOptions,
} from "./types/options";
import type { Videomail } from "./types/Videomail";
import Despot from "./util/Despot";
import createError from "./util/error/createError";
import ErrorReporter from "./util/error/ErrorReporter";
import isOddDimension from "./util/html/dimensions/isOddDimension";
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

/*
 * These two helpers live outside the class on purpose. 🔒
 *
 * TypeScript's `private` vanishes at runtime, so as methods anybody could call them with
 * junk and mail us fake error reports. An npm package scanner fuzzing every method did
 * exactly that, sending "[object Object]", 55296 and friends.
 */
function createReportedError(
  message: string,
  options: VideomailClientOptions,
  errorReporter: ErrorReporter,
) {
  const err = createError({ message, options });
  errorReporter.report(err);

  return err;
}

// The host handles these rejections itself. We still report them, then pass them on.
async function reportFailure<T>(
  request: Promise<T>,
  options: VideomailClientOptions,
  errorReporter: ErrorReporter,
) {
  try {
    return await request;
  } catch (exc) {
    errorReporter.report(createError({ exc, options }));
    throw exc;
  }
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
    if (isOddDimension(this.options.video.width)) {
      throw createReportedError(
        "Width must be divisible by two.",
        this.options,
        this.errorReporter,
      );
    }

    if (isOddDimension(this.options.video.height)) {
      throw createReportedError(
        "Height must be divisible by two.",
        this.options,
        this.errorReporter,
      );
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

    // Every component shares these options, so the record timer counts from here on.
    this.options.video.limitSeconds = limitSeconds;

    this.options.logger.debug(`Client: setLimitSeconds (limitSeconds = ${limitSeconds})`);
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
    return await reportFailure(
      resource.getByAlias(alias),
      this.options,
      this.errorReporter,
    );
  }

  public async getByKey(key: string) {
    const resource = new Resource(this.options);
    return await reportFailure(resource.getByKey(key), this.options, this.errorReporter);
  }

  public async getThreadByAlias(alias: string) {
    const resource = new Resource(this.options);
    return await reportFailure(
      resource.getThreadByAlias(alias),
      this.options,
      this.errorReporter,
    );
  }

  public async getThreadByKey(key: string) {
    const resource = new Resource(this.options);
    return await reportFailure(
      resource.getThreadByKey(key),
      this.options,
      this.errorReporter,
    );
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
    return this.options.logger.getLines?.();
  }
}

export { VideomailClient };
