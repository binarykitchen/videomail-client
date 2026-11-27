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
    }).toEqual({
      android: false,
      chromeBased: false,
      firefox: false,
      ios: false,
      mobile: false,
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
      // iOS apps such as Videomail's Capacitor app never reveal iOS 27 in the user agent.
      name: "an iOS WebView with the frozen version",
      platform: "iPhone; CPU iPhone OS 18_7 like Mac OS X",
      browser: "Mobile/15E148",
      usesCanvas: true,
    },
    {
      name: "Chrome on iOS with the frozen version",
      platform: "iPhone; CPU iPhone OS 18_7 like Mac OS X",
      browser: "CriOS/142.0.0.0 Mobile/15E148 Safari/604.1",
      usesCanvas: true,
    },
    {
      name: "an iOS 18.7.2 WebView",
      platform: "iPhone; CPU iPhone OS 18_7_2 like Mac OS X",
      browser: "Mobile/15E148",
      usesCanvas: false,
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

  describe("on an iPad with a Mac user agent", () => {
    const IPAD_APP_USER_AGENT =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)";

    afterEach(() => {
      Reflect.deleteProperty(window.navigator, "maxTouchPoints");
      vi.restoreAllMocks();
    });

    it.each([
      { name: "iPadOS 27", hasWebKit27Features: true, usesCanvas: true },
      { name: "older iPadOS", hasWebKit27Features: false, usesCanvas: false },
    ])(
      "selects the right live preview for $name",
      ({ hasWebKit27Features, usesCanvas }) => {
        // jsdom has no touch screen, unlike iPads.
        Object.defineProperty(window.navigator, "maxTouchPoints", {
          configurable: true,
          value: 5,
        });
        vi.spyOn(CSS, "supports").mockReturnValue(hasWebKit27Features);

        const options = mergeWithDefaultOptions({ fakeUaString: IPAD_APP_USER_AGENT });

        expect(new Browser(options).shouldUseCanvasCameraPreview()).toBe(usesCanvas);
      },
    );
  });

  describe("useful data for videos and error reports", () => {
    const ANDROID_CHROME =
      "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36";

    it("is plain data, free of any parser library", () => {
      const options = mergeWithDefaultOptions({ fakeUaString: ANDROID_CHROME });

      expect(new Browser(options).getUsefulData()).toStrictEqual({
        ua: ANDROID_CHROME,
        browser: { name: "Chrome", version: "140.0.0.0" },
        // bowser leaves out what the user agent doesn't tell
        device: { type: "mobile", vendor: undefined, model: undefined },
        engine: { name: "Blink", version: undefined },
        os: { name: "Android", version: "15" },
      });
    });

    it("counts Chrome on Android as Chrome-based for camera hints", () => {
      const options = mergeWithDefaultOptions({ fakeUaString: ANDROID_CHROME });

      expect(new Browser(options).isChromeBased()).toBe(true);
    });
  });
});
