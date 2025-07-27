import hidden from "hidden";

import { ShowParams } from "../client";
import { VideomailClientOptions } from "../types/options";
import Despot from "../util/Despot";
import VideomailError from "../util/error/VideomailError";
import getBrowser from "../util/getBrowser";
import pretty from "../util/pretty";
import Container, { UnloadParams } from "./container";
import RecorderInsides from "./visuals/inside/recorderInsides";
import Notifier from "./visuals/notifier";
import Recorder from "./visuals/recorder";
import Replay from "./visuals/replay";

class Visuals extends Despot {
  private readonly container: Container;

  private replay: Replay;
  private recorder: Recorder;
  private recorderInsides: RecorderInsides;
  private notifier: Notifier;

  private visualsElement?: HTMLElement | null | undefined;
  private built = false;

  constructor(container, options: VideomailClientOptions) {
    super("Visuals", options);

    this.container = container;

    // can be overwritten with setter fn
    this.replay = new Replay(this, options);

    this.recorder = new Recorder(this, this.replay, options);
    this.recorderInsides = new RecorderInsides(this, options);
    this.notifier = new Notifier(this, options);
  }

  private buildNoScriptTag() {
    let noScriptElement = this.container.querySelector("noscript");

    if (noScriptElement) {
      noScriptElement = document.createElement("noscript");
      noScriptElement.innerHTML = "Please enable Javascript";

      this.visualsElement?.appendChild(noScriptElement);
    }
  }

  private buildChildren(playerOnly = false, visualsElement?: HTMLElement | null) {
    if (!visualsElement) {
      throw new Error("Unable to build children without a visuals element");
    }

    this.options.logger.debug(
      `Visuals: buildChildren (playerOnly = ${playerOnly}, visualsElement="${pretty(visualsElement)}"})`,
    );

    this.buildNoScriptTag();

    if (!playerOnly) {
      this.notifier.build();
      this.recorderInsides.build();
    }

    this.replay.build(visualsElement);
  }

  private initEvents(playerOnly = false) {
    if (!playerOnly) {
      this.options.logger.debug(`Visuals: initEvents (playerOnly = ${playerOnly})`);

      this.on("USER_MEDIA_READY", () => {
        this.built = true;
        this.endWaiting();
        this.container.enableForm(false);
      });

      this.on("PREVIEW", () => {
        this.endWaiting();
      });

      this.on("BLOCKING", () => {
        if (!this.options.adjustFormOnBrowserError) {
          /*
           * do nothing, user still can enter form inputs
           * can be useful when you are on i.E. Seeflow's contact page and
           * still want to tick off the webcam option
           */
        } else {
          this.container.disableForm(true);
        }
      });

      this.on("PREVIEW_SHOWN", () => {
        this.container.validate(undefined, true);
      });

      this.on("LOADED_META_DATA", () => {
        this.correctDimensions();
      });

      this.on("ERROR", () => {
        if (getBrowser(this.options).isMobile()) {
          this.removeDimensions();
        }
      });
    }
  }

  private correctDimensions() {
    if (this.options.video.stretch) {
      this.removeDimensions();
    } else if (this.visualsElement) {
      this.visualsElement.style.width = `${this.getRecorderWidth(true)}px`;
      this.visualsElement.style.height = `${this.getRecorderHeight(true)}px`;
    }
  }

  private removeDimensions() {
    if (!this.visualsElement) {
      return;
    }

    this.visualsElement.style.width = "auto";
    this.visualsElement.style.height = "auto";
  }

  public getRatio() {
    if (this.visualsElement?.clientWidth) {
      // special case for safari, see getRatio() in recorder
      return this.visualsElement.clientHeight / this.visualsElement.clientWidth;
    }

    return 0;
  }

  private isRecordable() {
    return !this.isNotifying() && !this.replay.isShown() && !this.isCountingDown();
  }

  public isCountingDown() {
    return this.recorderInsides.isCountingDown();
  }

  public build(playerOnly = false, parentElement?: HTMLElement | null) {
    this.options.logger.debug(
      `Visuals: build (playerOnly = ${playerOnly}${parentElement ? `, parentElement="${pretty(parentElement)}"` : ""})`,
    );

    if (parentElement) {
      this.visualsElement = parentElement.querySelector<HTMLElement>(
        `.${this.options.selectors.visualsClass}`,
      );
    } else {
      this.visualsElement = this.container.querySelector(
        `.${this.options.selectors.visualsClass}`,
      );
    }

    if (!this.visualsElement) {
      if (playerOnly && parentElement) {
        this.visualsElement = parentElement;
      } else {
        this.visualsElement = document.createElement("div");
        this.visualsElement.classList.add(this.options.selectors.visualsClass);

        const buttonsElement = this.container.querySelector(
          `.${this.options.selectors.buttonsClass}`,
        );

        /*
         * Make sure it's placed before the buttons, but only if it's a child
         * element of the container = inside the container
         */
        if (buttonsElement && !this.container.isOutsideElementOf(buttonsElement)) {
          this.container.insertBefore(this.visualsElement, buttonsElement);
        } else {
          this.container.appendChild(this.visualsElement);
        }
      }
    }

    this.visualsElement.classList.add("visuals");

    this.correctDimensions();

    if (!this.built) {
      this.initEvents(playerOnly);
    }

    this.buildChildren(playerOnly, this.visualsElement);

    this.built = true;
  }

  public appendChild(child: HTMLElement) {
    this.visualsElement?.appendChild(child);
  }

  public removeChild(child: HTMLElement) {
    this.visualsElement?.removeChild(child);
  }

  public reset() {
    this.endWaiting();
    this.recorder.reset();
  }

  public beginWaiting() {
    this.container.beginWaiting();
  }

  public endWaiting() {
    this.container.endWaiting();
  }

  public stop(params?) {
    this.recorder.stop(params);
    this.recorderInsides.hidePause();
  }

  public back(keepHidden = false, cb?) {
    this.options.logger.debug(`Visuals: back(keepHidden = ${keepHidden})`);

    this.replay.hide();
    this.notifier.hide();

    if (keepHidden) {
      this.recorder.hide();
      cb?.();
    } else {
      this.recorder.back(cb);
    }
  }

  public recordAgain() {
    this.back(false, () => {
      if (this.options.loadUserMediaOnRecord) {
        this.once("SERVER_READY", () => {
          this.recorder.record();
        });
      } else {
        this.once("USER_MEDIA_READY", () => {
          this.recorder.record();
        });
      }
    });
  }

  public unload(params?: UnloadParams) {
    if (!this.built) {
      return;
    }

    const e = params?.e;

    this.options.logger.debug(`Visuals: unload(${e ? pretty(e) : ""})`);

    this.recorder.unload(params);
    this.recorderInsides.unload();
    this.replay.unload(params);

    if (e instanceof Error) {
      // Don't hide when e is an error so that the error can be still
      // displayed under visuals > notifier
    } else {
      this.hide();
    }

    this.built = false;
  }

  public isNotifying() {
    return this.notifier.isVisible();
  }

  public pause(params?: { event: MouseEvent }) {
    this.recorder.pause(params);
    this.recorderInsides.showPause();
  }

  public resume() {
    if (this.recorderInsides.isCountingDown()) {
      this.recorderInsides.resumeCountdown();
    } else {
      this.recorder.resume();
    }

    this.recorderInsides.hidePause();
  }

  public pauseOrResume() {
    if (this.isRecordable()) {
      if (this.isRecording()) {
        this.pause();
      } else if (this.recorder.isPaused()) {
        this.resume();
      } else if (this.recorder.isReady()) {
        this.recorder.record();
      }
    }
  }

  public recordOrStop() {
    if (this.isRecordable()) {
      if (this.isRecording()) {
        this.stop();
      } else if (this.recorder.isReady()) {
        this.recorder.record();
      }
    }
  }

  public getRecorder() {
    return this.recorder;
  }

  public validate() {
    return this.recorder.validate() && this.isReplayShown();
  }

  public getRecordingStats() {
    return this.recorder.getRecordingStats();
  }

  public getAudioSampleRate() {
    return this.recorder.getAudioSampleRate();
  }

  public isPaused() {
    return this.recorder.isPaused();
  }

  public error(err: VideomailError) {
    this.notifier.error(err);
  }

  public hide() {
    if (this.visualsElement) {
      hidden(this.visualsElement, true);
      this.emit("HIDE");
    }
  }

  public isHidden() {
    if (!this.built) {
      return true;
    } else if (this.visualsElement) {
      return hidden(this.visualsElement);
    }
  }

  public showVisuals() {
    hidden(this.visualsElement, false);
  }

  public show(params?: ShowParams) {
    if (!params?.playerOnly) {
      if (!this.isReplayShown()) {
        this.recorder.build();
      } else if (params?.goBack) {
        this.recorder.show();
      }
    }

    this.showVisuals();
  }

  public showReplayOnly() {
    this.show({ playerOnly: true });

    this.recorder.hide();
    this.notifier.hide();
  }

  public isRecorderUnloaded() {
    return this.recorder.isUnloaded();
  }

  public isConnecting() {
    return this.recorder.isConnecting();
  }

  public getRecorderWidth(responsive: boolean) {
    return this.recorder.getRecorderWidth(responsive);
  }

  public getRecorderHeight(responsive: boolean, useBoundingClientRect = false) {
    return this.recorder.getRecorderHeight(responsive, useBoundingClientRect);
  }

  public limitWidth(width?: number) {
    return this.container.limitWidth(width);
  }

  public limitHeight(height: number) {
    return this.container.limitHeight(height);
  }

  public getReplay() {
    return this.replay;
  }

  public getBoundingClientRect() {
    // fixes https://github.com/binarykitchen/videomail-client/issues/126
    return this.visualsElement?.getBoundingClientRect();
  }

  public checkTimer(elapsedTime: number) {
    this.recorderInsides.checkTimer(elapsedTime);
  }

  public isNotifierBuilt() {
    return this.notifier.isBuilt();
  }

  public isReplayShown() {
    return this.replay.isShown();
  }

  public hideReplay() {
    this.replay.hide();
  }

  public hideRecorder() {
    this.recorder.hide();
  }

  public isRecording() {
    return this.recorder.isRecording();
  }

  public isUserMediaLoaded() {
    return this.recorder.isUserMediaLoaded();
  }

  public isConnected() {
    return this.recorder.isConnected();
  }

  public record() {
    if (this.options.video.countdown) {
      this.emit("COUNTDOWN");
      this.recorderInsides.startCountdown(this.recorder.record.bind(this.recorder));
    } else {
      this.recorder.record();
    }
  }

  public getElement() {
    return this.visualsElement;
  }
}

export default Visuals;
