import type { Dimension } from "../../types/dimension";
import type {
  VideomailProgressParams,
  VideomailStoppingParams,
  VideomailUserMediaReadyParams,
} from "../../types/events/params";
import type { VideomailClientOptions } from "../../types/options";
import getBrowser from "../../util/browser/getBrowser";
import type { DespotEmitter } from "../../util/Despot";
import Despot from "../../util/Despot";
import setDimensionStyle from "../../util/html/dimensions/setDimensionStyle";
import useFullWidth from "../../util/html/dimensions/useFullWidth";
import getOrCreateChild from "../../util/html/getOrCreateChild";
import hideElement from "../../util/html/hideElement";
import isHidden from "../../util/html/isHidden";
import showElement from "../../util/html/showElement";
import { isAudioEnabled } from "../../util/options/audio";
import hasFixedVideoFrame from "../../util/options/hasFixedVideoFrame";
import pretty from "../../util/string/pretty";
import Timeout from "../../util/Timeout";
import type Visuals from "../visuals";

const NOTIFIER_MESSAGE_CLASS = "notifierMessage";

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

interface NotifierError {
  explanation?: string | undefined;
  getClassList: () => string[] | undefined;
  message: string;
}

class Notifier extends Despot {
  private readonly visuals: Visuals;

  private notifyElement?: HTMLElement | null | undefined;
  private messageElement?: HTMLHeadingElement | null | undefined;

  private explanationElement?: HTMLElement | null | undefined;
  private readonly entertainTimeout = new Timeout();

  private entertaining = false;
  private built = false;

  constructor(
    visuals: Visuals,
    options: VideomailClientOptions,
    emitter?: DespotEmitter,
  ) {
    super("Notifier", options, emitter);

    this.visuals = visuals;
  }

  private onStopping(limitReached = false) {
    let lead = "";

    this.visuals.beginWaiting();

    if (limitReached) {
      this.options.logger.debug("Limit reached");
      // Plain text only: the message renders via textContent, so use a line break.
      lead += `${this.options.text.limitReached}.\n`;
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

    this.on("USER_MEDIA_READY", (_params: VideomailUserMediaReadyParams) => {
      // Ensure notifier has correct dimensions, especially when stretched
      this.correctNotifierDimensions();

      this.hide();
    });

    this.on("PREVIEW", () => {
      this.hide();
    });

    this.on("STOPPING", (params: VideomailStoppingParams) => {
      this.onStopping(params.limitReached);
    });

    this.on("PROGRESS", (params: VideomailProgressParams) => {
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

    this.on("WINDOW_RESIZE", () => {
      this.correctNotifierDimensions();
    });
  }

  private correctNotifierDimensions() {
    if (!this.notifyElement) {
      return;
    }

    if (hasFixedVideoFrame(this.options)) {
      this.notifyElement.style.width = "100%";
      this.notifyElement.style.height = "100%";
      return;
    }

    if (this.options.video.stretch) {
      const heightDimension = this.visuals.getRecorderHeight(true, true);

      this.notifyElement.style.width = "auto";

      if (heightDimension) {
        this.notifyElement.style.height = `${heightDimension.value}${heightDimension.unit}`;
      }
    } else {
      let heightDimension: Dimension | undefined;
      let widthDimension = useFullWidth(this.options.video.mobileBreakPoint);

      if (!widthDimension) {
        widthDimension = this.visuals.getRecorderWidth(true);
        heightDimension = this.visuals.getRecorderHeight(true);
      }

      setDimensionStyle(this.notifyElement, "width", widthDimension);
      setDimensionStyle(this.notifyElement, "height", heightDimension);
    }
  }

  private show() {
    showElement(this.notifyElement);
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

        this.entertainTimeout.start(
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

    this.entertainTimeout.clear();
    this.entertaining = false;
  }

  public error(err: NotifierError, blocking = true) {
    const message = err.message;
    const explanation = err.explanation;

    if (!message) {
      this.options.logger.debug(
        `Weird empty error message generated for error ${pretty(err)}`,
      );
    }

    this.notify(message, explanation, {
      blocking,
      problem: true,
      classList: err.getClassList(),
      removeDimensions: getBrowser(this.options).isMobile(),
    });
  }

  // Keep each heading in its widget; multiple clients share the same document.
  private getMessageElement() {
    if (this.messageElement) {
      return this.messageElement;
    }

    this.messageElement = this.notifyElement?.querySelector<HTMLHeadingElement>(
      `.${NOTIFIER_MESSAGE_CLASS}`,
    );

    return this.messageElement;
  }

  private setMessage(message: string, messageOptions?: MessageOptions) {
    this.options.logger.debug(`Notifier: setMessage(${message})`);

    if (!this.getMessageElement()) {
      this.messageElement = document.createElement("h2");
      this.messageElement.classList.add(NOTIFIER_MESSAGE_CLASS);

      if (this.notifyElement) {
        if (this.explanationElement) {
          // Keep the heading before an explanation that arrived first.
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
        this.messageElement.textContent = (problem ? "\u2639 " : "") + message;
      } else {
        this.options.logger.warn("There is no message element for displaying a message");
      }
    } else {
      this.options.logger.warn(
        "Not going to update notifierMessage element because message is empty",
      );
    }

    showElement(this.messageElement);
  }

  private setExplanation(explanation: string) {
    // No log line: progress updates land here for every confirmed frame, and
    // notify() already logs explanations together with their message.
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

    this.explanationElement.textContent = explanation;

    showElement(this.explanationElement);
  }

  public build() {
    this.options.logger.debug("Notifier: build()");

    this.notifyElement = getOrCreateChild(this.visuals.getElement(), "div", "notifier");
    this.hide();

    // Live regions must exist before their content changes, or nothing gets read.
    this.setLiveRegion(false);

    if (!this.built) {
      this.initEvents();
    }

    this.built = true;
  }

  public unload() {
    this.cancelEntertainment();
    this.removeAllListeners();
    this.built = false;
  }

  /*
   * Screen readers announce notices without moving focus (WCAG 4.1.3): status
   * updates politely, blocking problems right away. Helps DeafBlind people on
   * braille displays, too.
   */
  private setLiveRegion(blocking: boolean) {
    if (!this.notifyElement) {
      return;
    }

    this.notifyElement.setAttribute("role", blocking ? "alert" : "status");
    this.notifyElement.setAttribute("aria-live", blocking ? "assertive" : "polite");
    // Read the heading and explanation together, not only the part that changed.
    this.notifyElement.setAttribute("aria-atomic", "true");
  }

  private hideMessage() {
    hideElement(this.getMessageElement());
  }

  private hideExplanation() {
    hideElement(this.explanationElement);
  }

  public hide() {
    this.cancelEntertainment();

    if (this.notifyElement) {
      hideElement(this.notifyElement);
      this.notifyElement.classList.remove("blocking");
    }

    this.hideMessage();
    this.hideExplanation();
  }

  public isVisible() {
    if (!this.built) {
      return false;
    }

    return Boolean(this.notifyElement && !isHidden(this.notifyElement));
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

    // Set before the text changes, so screen readers use the right urgency.
    this.setLiveRegion(blocking);

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

    // An error may arrive mid-build, before the visuals are shown.
    this.visuals.showVisuals();

    this.show();

    if (!stillWait) {
      this.visuals.endWaiting();
    }
  }
}

export default Notifier;
