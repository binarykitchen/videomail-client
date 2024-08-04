import defined from "defined";
import UAParser from "ua-parser-js";

import VideomailError from "./videomailError";

const FALLBACK_VIDEO_TYPE = "mp4";

const Browser = function (options) {
  options ||= {};

  const firefoxDownload = "http://www.mozilla.org/firefox/update/";
  const edgeDownload = "https://www.microsoft.com/en-us/download/details.aspx?id=48126";
  const chromeDownload = "http://www.google.com/chrome/";
  const chromiumDownload = "http://www.chromium.org/getting-involved/download-chromium";
  const ua = defined(
    options.fakeUaString,
    typeof window !== "undefined" && window.navigator && window.navigator.userAgent,
    "",
  );

  const uaParser = new UAParser(ua).getResult();

  const isIOS = uaParser.os.name === "iOS";
  const browserVersion = parseFloat(uaParser.browser.version);
  const isChrome = uaParser.browser.name === "Chrome";
  const isBrave = uaParser.browser.name === "Brave";
  const isChromium = uaParser.browser.name === "Chromium";
  const firefox = uaParser.browser.name === "Firefox";
  const osVersion = parseFloat(uaParser.os.version);
  const isWindows = uaParser.os.name === "Windows";
  const isEdge = uaParser.browser.name === "Edge" || (isWindows && osVersion >= 10);
  const isIE = /IE/.test(uaParser.browser.name);
  const isSafari = /Safari/.test(uaParser.browser.name);
  const isOpera = /Opera/.test(uaParser.browser.name);
  const isAndroid = /Android/.test(uaParser.os.name);
  const chromeBased = isChrome || isChromium;
  const isFacebook = uaParser.browser.name === "Facebook"; // Facebook App for iOS & Android

  const isMobile = isIOS || isAndroid;
  const isOkSafari = isSafari && browserVersion >= 11;
  const isOkIOS = isIOS && osVersion >= 11;
  const isBadIOS = isIOS && osVersion < 11;
  // unfortunately need to be able to fake https because tape-run can't run on https
  const isHTTPS = options.fakeHttps || window.location.protocol === "https:";

  const okBrowser =
    chromeBased ||
    firefox ||
    isAndroid ||
    isOpera ||
    isEdge ||
    isOkSafari ||
    isOkIOS ||
    isBrave;

  const self = this;

  let videoType;

  function getRecommendation() {
    let warning;

    if (firefox) {
      if (isIOS) {
        warning =
          "Firefox on iOS is not ready for cameras yet. Hopefully in near future ...";
      } else {
        warning =
          `Probably you need to <a href="${firefoxDownload}" target="_blank">` +
          `upgrade Firefox</a> to fix this.`;
      }
    } else if (isChrome) {
      if (isIOS) {
        warning =
          "Use Safari instead. Apple doesn't give Chrome access to iPhone cameras (booo).";
      } else {
        warning =
          `Probably you need to <a href="${chromeDownload}" target="_blank">` +
          `upgrade Chrome</a> to fix this.`;
      }
    } else if (isChromium) {
      warning =
        `Probably you need to <a href="${chromiumDownload}" target="_blank">` +
        `upgrade Chromium</a> to fix this.`;
    } else if (isIE) {
      warning =
        `Instead of Internet Explorer you need to upgrade to` +
        ` <a href="${edgeDownload}" target="_blank">Edge</a>.`;
    } else if (isOkSafari) {
      warning =
        "Probably you need to shut down Safari and restart it, this for correct webcam access.";
    } else if (isSafari) {
      warning =
        `Safari below version 11 has no webcam support.<br/>Better upgrade Safari or pick` +
        ` <a href="${chromeDownload}" target="_blank">Chrome</a>,` +
        ` <a href="${firefoxDownload}" target="_blank">Firefox</a> or Android.`;
    }

    return warning;
  }

  function getUserMediaWarning() {
    let warning;

    if (isBadIOS) {
      warning =
        "On iPads or iPhones below iOS v11 this camera feature is missing.<br/><br/>" +
        "For now, we recommend you to upgrade iOS or to use an Android device.";
    } else {
      warning = getRecommendation();
    }

    if (!warning) {
      if (self.isChromeBased() || self.isFirefox() || isSafari) {
        warning = "For the webcam feature, your browser needs an upgrade.";
      } else if (isFacebook) {
        warning =
          `Hence we recommend you to use a real browser like ` +
          `<a href="${chromeDownload}" target="_blank">Chrome</a>, ` +
          `<a href="${firefoxDownload}" target="_blank">Firefox</a> or ` +
          `<a href="${edgeDownload}" target="_blank">Edge</a>.`;
      } else {
        warning =
          `Hence we recommend you to use either ` +
          `<a href="${chromeDownload}" target="_blank">Chrome</a>, ` +
          `<a href="${firefoxDownload}" target="_blank">Firefox</a>, ` +
          `<a href="${edgeDownload}" target="_blank">Edge</a> or Android.`;
      }
    }

    return warning;
  }

  this.canRecord = function () {
    const hasNavigator = typeof navigator !== "undefined";
    let canRecord = false;

    if (hasNavigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      canRecord = true;
    } else {
      const getUserMediaType = hasNavigator && typeof navigator.getUserMedia_;

      canRecord = getUserMediaType === "function";
    }

    return canRecord;
  };

  this.checkRecordingCapabilities = function () {
    let err;

    if (!isHTTPS) {
      err = VideomailError.create(
        {
          message: "Sorry, your page is insecure",
        },
        "Please switch to HTTPS to ensure all is encrypted.",
        options,
        {
          classList: [VideomailError.BROWSER_PROBLEM],
        },
      );
    } else if (!okBrowser || !this.canRecord()) {
      const classList = [];

      if (isBadIOS) {
        classList.push(VideomailError.IOS_PROBLEM);
      } else {
        classList.push(VideomailError.BROWSER_PROBLEM);
      }

      let message;

      // good to be able to distinguish between two reasons why and what sort of camera it is
      if (!okBrowser) {
        if (isMobile) {
          message = "Sorry, your browser is unable to use your mobile camera";
        } else {
          message = "Sorry, your browser is unable to use webcams";
        }
      } else if (isMobile) {
        if (isFacebook) {
          message = "Sorry, the Facebook app cannot record from your mobile camera";
        } else {
          message = "Sorry, your browser cannot record from your mobile camera";
        }
      } else {
        message = "Sorry, your browser cannot record from webcams";
      }

      if (isBadIOS) {
        /*
         * on older iPhones length of JSON is limited and breaking
         * so just don't report and ignore
         */
        options.reportErrors = false;
      }

      err = VideomailError.create(
        {
          message,
        },
        getUserMediaWarning(),
        options,
        {
          classList,
        },
      );
    }

    return err;
  };

  this.checkBufferTypes = function () {
    let err;

    if (typeof window === "undefined" || typeof window.atob === "undefined") {
      err = VideomailError.create("atob is not supported", options);
    } else if (typeof window.ArrayBuffer === "undefined") {
      err = VideomailError.create("ArrayBuffers are not supported", options);
    } else if (typeof window.Uint8Array === "undefined") {
      err = VideomailError.create("Uint8Arrays are not supported", options);
    }

    return err;
  };

  function canPlayType(video, type) {
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

  this.getVideoType = function (video) {
    if (!videoType && video) {
      if (canPlayType(video, "mp4")) {
        videoType = "mp4";
      } else if (canPlayType(video, "webm")) {
        videoType = "webm";
      }
    }

    if (videoType !== "webm" && videoType !== "mp4") {
      // we only support these two. anything else defaults to the fallback.
      videoType = FALLBACK_VIDEO_TYPE;
    }

    if (!videoType || videoType === "") {
      // just as a fallback
      videoType = FALLBACK_VIDEO_TYPE;
    }

    return videoType;
  };

  this.getNoAccessIssue = function () {
    const message = "Unable to access webcam";
    let explanation;

    if (this.isChromeBased()) {
      explanation = "Click on the allow button to grant access to your webcam.";
    } else if (this.isFirefox()) {
      explanation = "Please grant Firefox access to your webcam.";
    } else {
      explanation = "Your system does not let your browser access your webcam.";
    }

    return VideomailError.create(message, explanation, options);
  };

  this.isChromeBased = function () {
    return chromeBased;
  };

  this.isFirefox = function () {
    return firefox;
  };

  this.isEdge = function () {
    return isEdge;
  };

  this.isAndroid = function () {
    return isAndroid;
  };

  this.isMobile = function () {
    return uaParser.device.type === "mobile";
  };

  this.isOkSafari = function () {
    return isOkSafari;
  };

  this.isIOS = function () {
    return isIOS;
  };

  this.getUsefulData = function () {
    return {
      browser: uaParser.browser,
      device: uaParser.device,
      os: uaParser.os,
      engine: uaParser.engine,
      userAgent: ua,
    };
  };
};

export default Browser;
