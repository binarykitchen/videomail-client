import hidden from "hidden";

import { ProgressParams, StoppingParams } from "../../types/events";
import { VideomailClientOptions } from "../../types/options";
import Despot from "../../util/Despot";
import VideomailError from "../../util/error/VideomailError";
import getBrowser from "../../util/getBrowser";
import { isAudioEnabled } from "../../util/options/audio";
import pretty from "../../util/pretty";
import Visuals from "../visuals";

const NOTIFIER_MESSAGE_ID = "notifierMessage";

interface MessageOptions {
  problem?: boolean;
}

interface NotifyOptions extends MessageOptions {
  stillWait?: boolean;
  entertain?: boolean;
  blocking?: boolean;
  classList?: string[] | undefined;
  removeDimensions?: boolean;
}

class Notifier extends Despot {
  private visuals: Visuals;

  private notifyElement?: HTMLElement | null | undefined;
  private messageElement?: HTMLHeadingElement | null | undefined;

  private explanationElement?: HTMLElement | null | undefined;
  private entertainTimeoutId?: number | undefined;

  private entertaining = false;
  private built = false;

  constructor(visuals: Visuals, options: VideomailClientOptions) {
    super("Notifier", options);

    this.visuals = visuals;
  }

  private onStopping(limitReached = false) {
    let lead = "";

    this.visuals.beginWaiting();

    if (limitReached) {
      this.options.logger.debug("Limit reached");
      lead += `${this.options.text.limitReached}.<br/>`;
    }

    lead += `${this.options.text.sending} …`;

    this.notify(lead, undefined, {
      stillWait: true,
      entertain: this.options.notifier.entertain,
    });
  }

  private onConnecting() {
    this.notify("Connecting …");
  }

  private onLoadingUserMedia() {
    this.notify("Loading webcam …");
  }

  private onProgress(frameProgress: string, sampleProgress?: string) {
    let overallProgress: string;

    if (isAudioEnabled(this.options)) {
      overallProgress = `Video: ${frameProgress}`;

      if (sampleProgress) {
        overallProgress += `, Audio: ${sampleProgress}`;
      }
    } else {
      overallProgress = frameProgress;
    }

    this.setExplanation(overallProgress);
  }

  private onBeginVideoEncoding() {
    this.visuals.beginWaiting();

    const lead = `${this.options.text.encoding} …`;

    this.notify(lead, undefined, {
      stillWait: true,
      entertain: this.options.notifier.entertain,
    });

    this.hideExplanation();
  }

  private initEvents() {
    this.options.logger.debug("Notifier: initEvents()");

    this.on("CONNECTING", () => {
      this.onConnecting();
    });

    this.on("LOADING_USER_MEDIA", () => {
      this.onLoadingUserMedia();
    });

    this.on("USER_MEDIA_READY", () => {
      // Ensure notifier has correct dimensions, especially when stretched
      this.correctNotifierDimensions();

      this.hide();
    });

    this.on("PREVIEW", () => {
      this.hide();
    });

    this.on("STOPPING", (params: StoppingParams) => {
      this.onStopping(params.limitReached);
    });

    this.on("PROGRESS", (params: ProgressParams) => {
      this.onProgress(params.frameProgress, params.sampleProgress);
    });

    this.on("BEGIN_VIDEO_ENCODING", () => {
      this.onBeginVideoEncoding();
    });

    this.on("UNLOADING", () => {
      this.notify("Unloading …");
    });

    this.on("DISCONNECTED", () => {
      this.notify("Disconnected");
    });

    this.on("CONNECTED", () => {
      this.notify("Connected");

      if (this.options.loadUserMediaOnRecord) {
        this.hide();
      }
    });
  }

  private correctNotifierDimensions() {
    if (!this.notifyElement) {
      return;
    }

    if (this.options.video.stretch) {
      this.notifyElement.style.width = "auto";
      this.notifyElement.style.height = `${this.visuals.getRecorderHeight(true, true)}px`;
    } else {
      this.notifyElement.style.width = `${this.visuals.getRecorderWidth(true)}px`;
      this.notifyElement.style.height = `${this.visuals.getRecorderHeight(true)}px`;
    }
  }

  private show() {
    if (this.notifyElement) {
      hidden(this.notifyElement, false);
    }
  }

  private runEntertainment() {
    if (this.options.notifier.entertain) {
      if (!this.entertaining) {
        const randomBackgroundClass = Math.floor(
          Math.random() * this.options.notifier.entertainLimit + 1,
        );

        if (this.notifyElement) {
          this.notifyElement.className = `notifier entertain ${this.options.notifier.entertainClass}${randomBackgroundClass}`;
        }

        this.entertainTimeoutId = window.setTimeout(
          this.runEntertainment.bind(this),
          this.options.notifier.entertainInterval,
        );

        this.entertaining = true;
      }
    } else {
      this.cancelEntertainment();
    }
  }

  private cancelEntertainment() {
    if (this.notifyElement) {
      this.notifyElement.classList.remove("entertain");
    }

    clearTimeout(this.entertainTimeoutId);

    this.entertainTimeoutId = undefined;
    this.entertaining = false;
  }

  public error(err: VideomailError) {
    const message = err.message;
    const explanation = err.explanation;

    if (!message) {
      this.options.logger.debug(
        `Weird empty error message generated for error ${pretty(err)}`,
      );
    }

    this.notify(message, explanation, {
      blocking: true,
      problem: true,
      classList: err.getClassList(),
      removeDimensions: getBrowser(this.options).isMobile(),
    });
  }

  // Special treatment to deal with race conditions
  private getMessageElement() {
    if (this.messageElement) {
      return this.messageElement;
    }

    this.messageElement = document.querySelector<HTMLHeadingElement>(
      `#${NOTIFIER_MESSAGE_ID}`,
    );

    return this.messageElement;
  }

  private setMessage(message: string, messageOptions?: MessageOptions) {
    this.options.logger.debug(`Notifier: setMessage(${message})`);

    if (!this.getMessageElement()) {
      this.messageElement = document.createElement("h2");
      this.messageElement.id = NOTIFIER_MESSAGE_ID;

      if (this.notifyElement) {
        if (this.explanationElement) {
          // For rare cases, shouldn't happen to set an explanation without a message
          this.notifyElement.insertBefore(this.messageElement, this.explanationElement);
        } else {
          this.notifyElement.appendChild(this.messageElement);
        }
      } else {
        this.options.logger.warn(
          `Unable to show message ${message} because notifyElement is empty`,
        );
      }
    }

    if (message.length > 0) {
      if (this.messageElement) {
        const problem = messageOptions?.problem;
        this.messageElement.innerHTML = (problem ? "&#x2639; " : "") + message;
      } else {
        this.options.logger.warn("There is no message element for displaying a message");
      }
    } else {
      this.options.logger.warn(
        "Not going to update notifierMessage element because message is empty",
      );
    }

    hidden(this.messageElement, false);
  }

  private setExplanation(explanation: string) {
    this.options.logger.debug(`Notifier: setExplanation(${explanation})`);

    if (!this.explanationElement) {
      this.explanationElement = document.createElement("p");
      this.explanationElement.classList.add("explanation");

      if (this.notifyElement) {
        this.notifyElement.appendChild(this.explanationElement);
      } else {
        this.options.logger.warn(
          `Unable to show explanation because notifyElement is empty: ${explanation}`,
        );
      }
    }

    this.explanationElement.innerHTML = explanation;

    hidden(this.explanationElement, false);
  }

  public build() {
    this.options.logger.debug("Notifier: build()");

    this.notifyElement = this.visuals.getElement()?.querySelector(".notifier");

    if (!this.notifyElement) {
      this.notifyElement = document.createElement("div");

      this.hide();

      this.visuals.appendChild(this.notifyElement);
    } else {
      this.hide();
    }

    if (!this.built) {
      this.initEvents();
    }

    this.built = true;
  }

  private hideMessage() {
    if (this.getMessageElement()) {
      hidden(this.messageElement, true);
    }
  }

  private hideExplanation() {
    if (this.explanationElement) {
      hidden(this.explanationElement, true);
    }
  }

  public hide() {
    this.cancelEntertainment();

    if (this.notifyElement) {
      hidden(this.notifyElement, true);
      this.notifyElement.classList.remove("blocking");
    }

    this.hideMessage();
    this.hideExplanation();
  }

  public isVisible() {
    if (!this.built) {
      return false;
    }

    return this.notifyElement && !hidden(this.notifyElement);
  }

  public isBuilt() {
    return this.built;
  }

  public notify(
    message: string,
    explanation?: string,
    notifyOptions: NotifyOptions = {},
  ) {
    const params = [message, explanation].filter(Boolean);
    this.options.logger.debug(`Notifier: notify(${params.join(", ")})`);

    const stillWait = notifyOptions.stillWait ?? false;
    const entertain = notifyOptions.entertain ?? false;
    const blocking = notifyOptions.blocking ?? false;
    const classList = notifyOptions.classList ?? false;
    const removeDimensions = notifyOptions.removeDimensions ?? false;

    if (this.notifyElement) {
      // reset
      if (!entertain) {
        this.notifyElement.className = "notifier";
      }

      if (classList) {
        classList.forEach((className) => {
          this.notifyElement?.classList.add(className);
        });
      }

      if (removeDimensions) {
        this.notifyElement.style.width = "auto";
        this.notifyElement.style.height = "auto";
      }
    }

    if (blocking) {
      this.notifyElement?.classList.add("blocking");
      this.emit("BLOCKING");
    } else {
      this.emit("NOTIFYING");
    }

    this.visuals.hideReplay();
    this.visuals.hideRecorder();

    this.setMessage(message, notifyOptions);

    if (explanation && explanation.length > 0) {
      this.setExplanation(explanation);
    }

    if (entertain) {
      this.runEntertainment();
    } else {
      this.cancelEntertainment();
    }

    /*
     * just as a safety in case if an error is thrown in the middle of the build process
     * and visuals aren't built/shown yet.
     */
    this.visuals.showVisuals();

    this.show();

    if (!stillWait) {
      this.visuals.endWaiting();
    }
  }
}

export default Notifier;
