import Browser from "../Browser";
import mergeWithDefaultOptions from "../options/mergeWithDefaultOptions";

describe("Browser", () => {
  test("Constructor with default tells test environment runs under jsdom", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const browser = new Browser(defaultOptions);

    const data = browser.getUsefulData();

    expect(data.ua).toContain("jsdom");
  });

  test("All browser tests return false", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const browser = new Browser(defaultOptions);

    expect(browser.isAndroid()).toBeFalsy();
    expect(browser.isChromeBased()).toBeFalsy();
    expect(browser.isFirefox()).toBeFalsy();
    expect(browser.isIOS()).toBeFalsy();
    expect(browser.isMobile()).toBeFalsy();
    expect(browser.isOkSafari()).toBeFalsy();
  });

  test("getNoAccessIssue returns error", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const browser = new Browser(defaultOptions);

    const err = browser.getNoAccessIssue();

    expect(err.message).toEqual("Unable to access webcam");
    expect(err.explanation).toEqual(
      "Your system does not let your browser access your webcam",
    );
  });
});
