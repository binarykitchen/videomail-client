import { VideomailClientOptions } from "../types/options";
import Browser from "./Browser";

let browser: Browser;

function getBrowser(localOptions: VideomailClientOptions) {
  if (!browser) {
    browser = new Browser(localOptions);
  }

  return browser;
}

export default getBrowser;
