import defined from "defined";
import UAParser, { IResult } from "ua-parser-js";

import { VideomailClientOptions } from "../types/options";
import createError from "./error/createError";

const FALLBACK_VIDEO_TYPE = "mp4";

const firefoxDownload = "http://www.mozilla.org/firefox/update/";
const edgeDownload = "https://www.microsoft.com/en-us/download/details.aspx?id=48126";
const chromeDownload = "http://www.google.com/chrome/";

class Browser {
  private options: VideomailClientOptions;
  private result: IResult;
  private videoType: string | undefined;

  public constructor(options: VideomailClientOptions) {
    this.options = options;

    const ua = defined(
      options.fakeUaString,
      typeof window !== "undefined" && window.navigator && window.navigator.userAgent,
      "",
    );

    const userAgentParser = new UAParser(ua);

    this.result = userAgentParser.getResult();
  }

  public isIOS() {
    return this.result.os.name === "iOS";
  }

  private getBrowserVersion() {
    return this.result.browser.version;
  }

  private isChrome() {
    return this.result.browser.name === "Chrome";
  }

  private isBrave() {
    return this.result.browser.name === "Brave";
  }

  private isChromium() {
    return this.result.browser.name === "Chromium";
  }

  public isFirefox() {
    return this.result.browser.name === "Firefox";
  }

  private isEdge() {
    return this.result.browser.name === "Edge";
  }

  private isSafari() {
    if (!this.result.browser.name) {
      return false;
    }

    return /Safari/.test(this.result.browser.name);
  }

  private isOpera() {
    if (!this.result.browser.name) {
      return false;
    }

    return /Opera/.test(this.result.browser.name);
  }

  public isAndroid() {
    if (!this.result.os.name) {
      return false;
    }

    return /Android/.test(this.result.os.name);
  }

  public isChromeBased() {
    return this.isChrome() || this.isChromium();
  }

  private isFacebook() {
    if (!this.result.browser.name) {
      return false;
    }

    // Facebook App for iOS & Android
    return this.result.browser.name === "Facebook";
  }

  // TODO What if there are any other mobile OS out there?
  public isMobile() {
    return this.isIOS() || this.isAndroid();
  }

  public isOkSafari() {
    const version = this.getBrowserVersion();

    if (!version) {
      return false;
    }

    return this.isSafari() && parseFloat(version) >= 11;
  }

  // TODO Remove this check. In 2024 should be fine, all is supported.
  private isBrowserOk() {
    return (
      this.isChromeBased() ||
      this.isFirefox() ||
      this.isAndroid() ||
      this.isOpera() ||
      this.isEdge() ||
      this.isOkSafari() ||
      this.isIOS() ||
      this.isBrave()
    );
  }

  private getUserMediaWarning() {
    let warning;

    if (this.isChromeBased() || this.isFirefox() || this.isSafari()) {
      warning = "For the webcam feature, your browser needs an upgrade.";
    } else {
      warning = `For the webcam feature, we recommend one of these browsers <a href="${chromeDownload}" target="_blank">Chrome</a>, <a href="${firefoxDownload}" target="_blank">Firefox</a>, <a href="${edgeDownload}" target="_blank">Edge</a> or Android.`;
    }

    return warning;
  }

  public canRecord() {
    let canRecord = false;

    if (navigator.mediaDevices) {
      canRecord = true;
    }

    return canRecord;
  }

  public checkRecordingCapabilities() {
    let err;

    if (!this.isBrowserOk() || !this.canRecord()) {
      let message;

      // Good to be able to distinguish between two reasons why and what sort of camera it is
      if (!this.isBrowserOk()) {
        if (this.isMobile()) {
          message = "Sorry, your browser is unable to use your mobile camera";
        } else {
          message = "Sorry, your browser is unable to use webcams";
        }
      } else if (this.isMobile()) {
        if (this.isFacebook()) {
          message = "Sorry, the Facebook app cannot record from your mobile camera";
        } else {
          message = "Sorry, your browser cannot record from your mobile camera";
        }
      } else {
        message = "Sorry, your browser cannot record from webcams";
      }

      err = createError({
        message,
        explanation: this.getUserMediaWarning(),
        options: this.options,
      });
    }

    return err;
  }

  public checkBufferTypes() {
    let err;

    if (!window || !window.atob) {
      err = createError({ message: "atob is not supported", options: this.options });
    } else if (!window.ArrayBuffer) {
      err = createError({
        message: "ArrayBuffers are not supported",
        options: this.options,
      });
    } else if (!window.Uint8Array) {
      err = createError({
        message: "Uint8Arrays are not supported",
        options: this.options,
      });
    }

    return err;
  }

  private canPlayType(video, type: string) {
    let canPlayType;

    if (video && video.canPlayType) {
      canPlayType = video.canPlayType(`video/${type}`);
    }

    // definitely cannot be played here
    if (canPlayType === "") {
      return false;
    }

    return canPlayType;
  }

  // TODO Introduce enums for video types
  public getVideoType(video) {
    if (!this.videoType && video) {
      if (this.canPlayType(video, "mp4")) {
        this.videoType = "mp4";
      } else if (this.canPlayType(video, "webm")) {
        this.videoType = "webm";
      }
    }

    if (this.videoType !== "webm" && this.videoType !== "mp4") {
      // We only support these two. Anything else defaults to the fallback
      this.videoType = FALLBACK_VIDEO_TYPE;
    }

    if (!this.videoType || this.videoType.trim() === "") {
      // Just as a fallback
      this.videoType = FALLBACK_VIDEO_TYPE;
    }

    return this.videoType;
  }

  public getNoAccessIssue() {
    const message = "Unable to access webcam";

    let explanation;

    if (this.isChromeBased()) {
      explanation = "Click on the allow button to grant access to your webcam";
    } else if (this.isFirefox()) {
      explanation = "Please grant Firefox access to your webcam";
    } else {
      explanation = "Your system does not let your browser access your webcam";
    }

    return createError({ message, explanation, options: this.options });
  }

  public getUsefulData() {
    return {
      browser: this.result.browser,
      cpu: this.result.cpu.architecture ? this.result.cpu : undefined,
      device: this.result.device.type ? this.result.device : undefined,
      engine: this.result.engine,
      os: this.result.os.name && this.result.os.version ? this.result.os : undefined,
    };
  }
}

export default Browser;
