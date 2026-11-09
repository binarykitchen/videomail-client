import Browser from "../Browser";
import mergeWithDefaultOptions from "../options/mergeWithDefaultOptions";

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
