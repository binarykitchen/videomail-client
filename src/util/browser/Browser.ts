import Bowser from "bowser";

import canPlayType from "../../media/video/canPlayType";
import isSupportedVideoType from "../../media/video/isSupportedVideoType";
import type { BrowserStats } from "../../types/BrowserStats";
import type { VideomailClientOptions } from "../../types/options";
import type { VideoTypeType } from "../../types/VideoType";
import { VideoType } from "../../types/VideoType";

const FALLBACK_VIDEO_TYPE = VideoType.MP4;

// Since iOS 26, WebKit puts this iOS version into every user agent. Only Safari adds its
// real one (Version/27.x), so iOS apps, Chrome & in-app browsers on iOS 27 still say 18.7 🙈
// See frozenVersion in https://github.com/WebKit/WebKit/blob/main/Source/WebCore/page/Quirks.cpp
const FROZEN_IOS_VERSION = "18.7";

// Mac user agents never reveal the iPadOS version, but WebKit 27 added CSS `stretch` sizing.
function hasWebKit27Features() {
  return CSS.supports("width", "stretch");
}

class Browser {
  private readonly ua: string;
  private readonly result: Bowser.Parser.ParsedResult;
  private videoType: VideoTypeType | undefined;

  public constructor(options: VideomailClientOptions) {
    this.ua = options.fakeUaString ?? window.navigator.userAgent;

    // bowser reports the same OS & engine names as ua-parser-js did, such as "iOS",
    // "macOS" or "WebKit". Browser names lose the "Mobile" prefix: Chrome on Android
    // is plain "Chrome" now, so it gets Chrome's camera hints, too.
    this.result = Bowser.parse(this.ua);
  }

  public isIOS() {
    return this.result.os.name === "iOS";
  }

  // A frozen version may hide an affected iOS 27 WebView, such as our Capacitor app.
  private mayRunIOS27() {
    const { version } = this.result.os;

    return Number.parseInt(version ?? "", 10) === 27 || version === FROZEN_IOS_VERSION;
  }

  // iPads request desktop sites by default, so their WebKit claims to be a Mac. Macs lack touch.
  private isIPadWithMacUserAgent() {
    return this.result.os.name === "macOS" && window.navigator.maxTouchPoints > 1;
  }

  // TODO Narrow Safari to unfixed releases once Apple ships the fix. WebViews never reveal
  // their iOS version, so drop the frozen & feature checks once most users run a fixed iOS.
  public shouldUseCanvasCameraPreview() {
    if (this.result.engine.name !== "WebKit") {
      return false;
    }

    if (this.isIOS()) {
      return this.mayRunIOS27();
    }

    return this.isIPadWithMacUserAgent() && hasWebKit27Features();
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

  // Plain data for videos & error reports, see BrowserStats
  public getUsefulData() {
    const { browser, engine, os, platform } = this.result;

    const data: BrowserStats = {
      ua: this.ua,
      browser: { name: browser.name, version: browser.version },
      // bowser calls it platform, but it's the same idea as ua-parser-js' device
      device: { type: platform.type, vendor: platform.vendor, model: platform.model },
      engine: { name: engine.name, version: engine.version },
      os: { name: os.name, version: os.version },
    };

    return data;
  }
}

export default Browser;
