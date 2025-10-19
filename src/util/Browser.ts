import defined from "defined";
import { IResult, UAParser } from "ua-parser-js";

import { VideomailClientOptions } from "../types/options";
import { VideoType, VideoTypeType } from "../types/VideoType";
import createError from "./error/createError";
import canPlayType from "./html/media/canPlayType";

const FALLBACK_VIDEO_TYPE = VideoType.MP4;

class Browser {
  private readonly options: VideomailClientOptions;
  private readonly result: IResult;
  private videoType: VideoTypeType | undefined;

  public constructor(options: VideomailClientOptions) {
    this.options = options;

    const ua = defined(options.fakeUaString, window.navigator.userAgent, "");

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

    return this.isSafari() && Number.parseFloat(version) >= 11;
  }

  public getVideoType(video: HTMLVideoElement) {
    if (!this.videoType) {
      if (canPlayType(video, VideoType.MP4)) {
        this.videoType = VideoType.MP4;
      } else if (canPlayType(video, VideoType.WebM)) {
        this.videoType = VideoType.WebM;
      }
    }

    if (this.videoType !== VideoType.WebM && this.videoType !== VideoType.MP4) {
      // We only support these two. Anything else defaults to the fallback
      this.videoType = FALLBACK_VIDEO_TYPE;
    }

    if (this.videoType.trim() === "") {
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
      ua: this.result.ua,
      browser: this.result.browser,
      cpu: this.result.cpu,
      device: this.result.device,
      engine: this.result.engine,
      os: this.result.os,
    };
  }
}

export default Browser;
