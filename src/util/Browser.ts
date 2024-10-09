import defined from "defined";
import UAParser, { IResult } from "ua-parser-js";

import { VideomailClientOptions } from "../types/options";
import createError from "./error/createError";

const FALLBACK_VIDEO_TYPE = "mp4";

class Browser {
  private options: VideomailClientOptions;
  private result: IResult;
  private videoType: string | undefined;

  public constructor(options: VideomailClientOptions) {
    this.options = options;

    const ua = defined(
      options.fakeUaString,
      typeof window !== "undefined" && window.navigator.userAgent,
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

  private isChromium() {
    return this.result.browser.name === "Chromium";
  }

  public isFirefox() {
    return this.result.browser.name === "Firefox";
  }

  private isSafari() {
    if (!this.result.browser.name) {
      return false;
    }

    return this.result.browser.name.includes("Safari");
  }

  public isAndroid() {
    if (!this.result.os.name) {
      return false;
    }

    return this.result.os.name.includes("Android");
  }

  public isChromeBased() {
    return this.isChrome() || this.isChromium();
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

  private canPlayType(video: HTMLVideoElement, type: string) {
    const canPlayType = video.canPlayType(`video/${type}`);

    // definitely cannot be played here
    if (canPlayType === "") {
      return false;
    }

    return canPlayType;
  }

  // TODO Introduce enums for video types
  public getVideoType(video: HTMLVideoElement) {
    if (!this.videoType) {
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
