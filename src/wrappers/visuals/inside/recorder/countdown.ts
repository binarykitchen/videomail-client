import { VideomailClientOptions } from "../../../../types/options";
import hideElement from "../../../../util/html/hideElement";
import showElement from "../../../../util/html/showElement";
import Visuals from "../../../visuals";

class Countdown {
  private readonly visuals: Visuals;
  private readonly options: VideomailClientOptions;

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
    setTimeout(function () {
      cb();
    }, 0);
  }

  private countBackward(cb) {
    if (!this.paused) {
      this.options.logger.debug(`Countdown ${this.countdown}`);

      if (this.countdown !== undefined) {
        this.countdown--;

        if (this.countdown < 1) {
          this.fire(cb);
        } else if (this.countdownElement) {
          this.countdownElement.innerHTML = this.countdown.toString();
        }
      }
    }
  }

  public start(cb) {
    if (!this.countdownElement) {
      throw new Error("Unable to start countdown without an element");
    }

    if (typeof this.options.video.countdown !== "number") {
      throw new Error(
        `The defined countdown is not a valid number: ${this.options.video.countdown}`,
      );
    }

    this.countdown = this.options.video.countdown;
    this.countdownElement.innerHTML = this.countdown.toString();

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
    this.countdownElement = this.visuals
      .getElement()
      ?.querySelector<HTMLElement>(".countdown");

    if (!this.countdownElement) {
      this.countdownElement = document.createElement("p");
      this.countdownElement.className = "countdown";

      this.hide();

      this.visuals.appendChild(this.countdownElement);
    } else {
      this.hide();
    }
  }

  public show() {
    showElement(this.countdownElement);
  }

  public isCountingDown() {
    return Boolean(this.intervalId);
  }

  public unload() {
    clearInterval(this.intervalId);

    this.paused = false;
    this.intervalId = undefined;
  }

  public hide() {
    hideElement(this.countdownElement);
    this.unload();
  }
}

export default Countdown;
