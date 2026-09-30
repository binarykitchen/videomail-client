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
