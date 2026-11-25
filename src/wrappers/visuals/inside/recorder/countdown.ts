import type { VideomailClientOptions } from "../../../../types/options";
import getOrCreateChild from "../../../../util/html/getOrCreateChild";
import hideElement from "../../../../util/html/hideElement";
import showElement from "../../../../util/html/showElement";
import Timeout from "../../../../util/Timeout";
import type Visuals from "../../../visuals";

class Countdown {
  private readonly visuals: Visuals;
  private readonly options: VideomailClientOptions;
  private readonly fireTimeout = new Timeout();

  private countdownElement?: HTMLElement | null | undefined;
  private intervalId?: number | undefined;
  private countdown?: number | undefined;
  private paused = false;

  constructor(visuals: Visuals, options: VideomailClientOptions) {
    this.visuals = visuals;
    this.options = options;
  }

  private fire(cb) {
    this.unload();
    this.hide();

    // keep all callbacks async
    this.fireTimeout.start(cb, 0);
  }

  private countBackward(cb) {
    if (!this.paused) {
      this.options.logger.debug(`Countdown ${this.countdown}`);

      if (this.countdown !== undefined) {
        this.countdown--;

        if (this.countdown < 1) {
          this.fire(cb);
        } else if (this.countdownElement) {
          this.countdownElement.textContent = this.countdown.toString();
        }
      }
    }
  }

  public start(cb) {
    if (!this.countdownElement) {
      throw new Error("Unable to start countdown without an element");
    }

    if (typeof this.options.video.countdown !== "number") {
      throw new TypeError(
        `The defined countdown is not a valid number: ${this.options.video.countdown}`,
      );
    }

    this.unload();
    this.countdown = this.options.video.countdown;
    this.countdownElement.textContent = this.countdown.toString();

    this.show();

    this.intervalId = window.setInterval(this.countBackward.bind(this, cb), 950);
  }

  public pause() {
    this.paused = true;
  }

  public resume() {
    this.paused = false;
  }

  public build() {
    this.countdownElement = getOrCreateChild(this.visuals.getElement(), "p", "countdown");
    this.hide();

    // Lets screen readers follow "3, 2, 1" without moving focus.
    this.countdownElement.setAttribute("aria-live", "polite");
  }

  public show() {
    showElement(this.countdownElement);
  }

  public isCountingDown() {
    return this.intervalId !== undefined;
  }

  public unload() {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
    }

    this.fireTimeout.clear();

    this.paused = false;
    this.intervalId = undefined;
  }

  public hide() {
    hideElement(this.countdownElement);
    this.unload();
  }
}

export default Countdown;
