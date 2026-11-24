import mergeWithDefaultOptions from "../../options/mergeWithDefaultOptions";
import Browser from "../Browser";

describe("Browser class", () => {
  it("constructor with default tells test environment runs under jsdom", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const browser = new Browser(defaultOptions);

    const data = browser.getUsefulData();

    expect(data.ua).toContain("jsdom");
  });

  it("all browser tests return false", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const browser = new Browser(defaultOptions);

    expect({
      android: browser.isAndroid(),
      chromeBased: browser.isChromeBased(),
      firefox: browser.isFirefox(),
      ios: browser.isIOS(),
      mobile: browser.isMobile(),
      okSafari: browser.isOkSafari(),
    }).toEqual({
      android: false,
      chromeBased: false,
      firefox: false,
      ios: false,
      mobile: false,
      okSafari: false,
    });
  });

  it.each([
    {
      android: false,
      mobile: true,
      os: "iOS",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    },
    {
      android: true,
      mobile: true,
      os: "Android",
      userAgent:
        "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    },
  ])("detects $os", ({ android, mobile, userAgent }) => {
    const options = mergeWithDefaultOptions({ fakeUaString: userAgent });
    const browser = new Browser(options);

    expect({
      android: browser.isAndroid(),
      ios: browser.isIOS(),
      mobile: browser.isMobile(),
    }).toEqual({ android, ios: !android, mobile });
  });

  it.each([
    {
      name: "Safari 27 with a frozen iOS version in the user agent",
      platform: "iPhone; CPU iPhone OS 18_7 like Mac OS X",
      browser: "Version/27.2 Mobile/15E148 Safari/604.1",
      usesCanvas: true,
    },
    {
      name: "iOS 27 WebView",
      platform: "iPhone; CPU iPhone OS 27_2 like Mac OS X",
      browser: "Mobile/15E148",
      usesCanvas: true,
    },
    {
      name: "Safari 26",
      platform: "iPhone; CPU iPhone OS 18_7 like Mac OS X",
      browser: "Version/26.2 Mobile/15E148 Safari/604.1",
      usesCanvas: false,
    },
    {
      name: "Safari 16 on iPhone",
      platform: "iPhone; CPU iPhone OS 16_7 like Mac OS X",
      browser: "Version/16.6 Mobile/15E148 Safari/604.1",
      usesCanvas: false,
    },
    {
      name: "desktop Safari 27",
      platform: "Macintosh; Intel Mac OS X 10_15_7",
      browser: "Version/27.2 Safari/605.1.15",
      usesCanvas: false,
    },
  ])("selects the right live preview for $name", ({ platform, browser, usesCanvas }) => {
    const options = mergeWithDefaultOptions({
      fakeUaString: `Mozilla/5.0 (${platform}) AppleWebKit/605.1.15 (KHTML, like Gecko) ${browser}`,
    });

    expect(new Browser(options).shouldUseCanvasCameraPreview()).toBe(usesCanvas);
  });

  it("getNoAccessIssue returns error", () => {
    const defaultOptions = mergeWithDefaultOptions({ reportErrors: false });
    const browser = new Browser(defaultOptions);

    const err = browser.getNoAccessIssue();

    expect(err).toMatchObject({
      explanation: "Your system does not let your browser access your webcam",
      message: "Unable to access webcam",
    });
  });
});
