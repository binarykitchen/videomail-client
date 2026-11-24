import type { IResult } from "ua-parser-js";
import { UAParser } from "ua-parser-js";

import canPlayType from "../../media/video/canPlayType";
import isSupportedVideoType from "../../media/video/isSupportedVideoType";
import type { BrowserStats } from "../../types/BrowserStats";
import type { VideomailClientOptions } from "../../types/options";
import type { VideoTypeType } from "../../types/VideoType";
import { VideoType } from "../../types/VideoType";
import createError from "../error/createError";

const FALLBACK_VIDEO_TYPE = VideoType.MP4;

class Browser {
  private readonly options: VideomailClientOptions;
  private readonly result: IResult;
  private videoType: VideoTypeType | undefined;

  public constructor(options: VideomailClientOptions) {
    this.options = options;

    const ua = options.fakeUaString ?? window.navigator.userAgent;

    const userAgentParser = new UAParser(ua);

    this.result = userAgentParser.getResult();
  }

  public isIOS() {
    return this.result.os.name === "iOS";
  }

  // Narrow this to unfixed releases once the iOS version with the fix is known.
  public shouldUseCanvasCameraPreview() {
    return (
      this.isIOS() &&
      this.result.engine.name === "WebKit" &&
      Number.parseInt(this.result.os.version ?? "", 10) === 27
    );
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

  public getVideoType(video: HTMLVideoElement) {
    if (!this.videoType) {
      if (canPlayType(video, VideoType.MP4)) {
        this.videoType = VideoType.MP4;
      } else if (canPlayType(video, VideoType.WebM)) {
        this.videoType = VideoType.WebM;
      }
    }

    if (!isSupportedVideoType(this.videoType)) {
      // Anything else defaults to the fallback
      this.videoType = FALLBACK_VIDEO_TYPE;
    }

    return this.videoType;
  }

  public getNoAccessIssue() {
    const message = "Unable to access webcam";

    let explanation: string;

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
    const data: BrowserStats = {
      ua: this.result.ua,
      browser: this.result.browser,
      cpu: this.result.cpu,
      device: this.result.device,
      engine: this.result.engine,
      os: this.result.os,
    };

    return data;
  }
}

export default Browser;
