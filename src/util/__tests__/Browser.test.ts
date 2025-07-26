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

    expect(browser.isAndroid()).toBe(false);
    expect(browser.isChromeBased()).toBe(false);
    expect(browser.isFirefox()).toBe(false);
    expect(browser.isIOS()).toBe(false);
    expect(browser.isMobile()).toBe(false);
    expect(browser.isOkSafari()).toBe(false);
  });

  it("getNoAccessIssue returns error", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const browser = new Browser(defaultOptions);

    const err = browser.getNoAccessIssue();

    expect(err.message).toBe("Unable to access webcam");
    expect(err.explanation).toBe(
      "Your system does not let your browser access your webcam",
    );
  });
});
