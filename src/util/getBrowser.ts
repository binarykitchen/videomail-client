import Browser from "./browser";

let browser;

function getBrowser(localOptions) {
  if (!browser) {
    browser = new Browser(localOptions);
  }

  return browser;
}

export default getBrowser;
