import hidden from "hidden";

import { VideomailClientOptions } from "../../../../types/options";
import pad from "../../../../util/pad";
import Visuals from "../../../visuals";
import RecordNote from "./recordNote";

class RecordTimer {
  private readonly visuals: Visuals;
  private readonly recordNote: RecordNote;
  private readonly options: VideomailClientOptions;

  private recordTimerElement?: HTMLElement | undefined | null;

  private nearComputed = false;
  private endNighComputed = false;

  private started = false;
  private countdown?: number | undefined;

  constructor(visuals: Visuals, recordNote: RecordNote, options: VideomailClientOptions) {
    this.visuals = visuals;
    this.recordNote = recordNote;
    this.options = options;
  }

  private thresholdReached(secs: number, threshold: number) {
    return secs >= this.options.video.limitSeconds * threshold;
  }

  private isNear(secs: number) {
    if (!this.nearComputed && this.thresholdReached(secs, 0.6)) {
      this.nearComputed = true;
      return true;
    }

    return false;
  }

  private endIsNigh(secs: number) {
    if (!this.endNighComputed && this.thresholdReached(secs, 0.8)) {
      this.endNighComputed = true;
      return true;
    }

    return false;
  }

  private setNear() {
    this.recordTimerElement?.classList.add("near");
  }

  private setNigh() {
    this.recordTimerElement?.classList.add("nigh");
  }

  public check(elapsedTime: number) {
    const newCountdown = this.getStartSeconds() - Math.floor(elapsedTime / 1e3);

    // performance optimization (another reason we need react here!)
    if (newCountdown !== this.countdown) {
      this.countdown = newCountdown;

      this.update();

      if (this.countdown < 1) {
        this.visuals.stop(true);
      }
    }
  }

  private update() {
    if (this.countdown === undefined) {
      throw new Error("Countdown is set to undefined, unable to update timer");
    }

    const mins = Math.floor(this.countdown / 60);
    const secs = this.countdown - mins * 60;

    if (!this.nearComputed || !this.endNighComputed) {
      const remainingSeconds = this.options.video.limitSeconds - this.countdown;

      if (this.isNear(remainingSeconds)) {
        this.recordNote.setNear();
        this.setNear();

        this.options.logger.debug(`End is near, ${this.countdown} seconds to go`);
      } else if (this.endIsNigh(remainingSeconds)) {
        this.recordNote.setNigh();
        this.setNigh();

        this.options.logger.debug(`End is nigh, ${this.countdown} seconds to go`);
      }
    }

    if (this.recordTimerElement) {
      this.recordTimerElement.innerHTML = `${mins}:${pad(secs)}`;
    }
  }

  private hide() {
    hidden(this.recordTimerElement, true);
  }

  private show() {
    this.recordTimerElement?.classList.remove("near");
    this.recordTimerElement?.classList.remove("nigh");

    hidden(this.recordTimerElement, false);
  }

  private getSecondsRecorded() {
    if (this.countdown === undefined) {
      return this.getSecondsRecorded();
    }

    return this.getStartSeconds() - this.countdown;
  }

  private getStartSeconds() {
    return this.options.video.limitSeconds;
  }

  public start() {
    this.countdown = this.getStartSeconds();
    this.nearComputed = this.endNighComputed = false;
    this.started = true;

    this.update();

    this.show();
  }

  public pause() {
    this.recordNote.hide();
  }

  public resume() {
    this.recordNote.show();
  }

  public isStopped() {
    return this.countdown === undefined;
  }

  public stop() {
    if (!this.isStopped() && this.started) {
      this.options.logger.debug(
        `Stopping record timer. Was recording for about ~${this.getSecondsRecorded()} seconds.`,
      );

      this.hide();
      this.recordNote.stop();

      this.countdown = undefined;
      this.started = false;
    }
  }

  public build() {
    this.recordTimerElement = this.visuals.getElement()?.querySelector(".recordTimer");

    if (!this.recordTimerElement) {
      this.recordTimerElement = document.createElement("p");
      this.recordTimerElement.classList.add("recordTimer");

      this.hide();

      this.visuals.appendChild(this.recordTimerElement);
    } else {
      this.hide();
    }
  }
}

export default RecordTimer;
