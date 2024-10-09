import { VideomailClientOptions } from "../types/options";
import Browser from "./Browser";

let browser: Browser | undefined;

function getBrowser(localOptions: VideomailClientOptions) {
  if (!browser) {
    browser = new Browser(localOptions);
  }

  return browser;
}

export default getBrowser;
