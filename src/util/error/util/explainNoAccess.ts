import type { VideomailClientOptions } from "../../../types/options";
import getBrowser from "../../browser/getBrowser";

// Each browser asks for webcam access its own way, so point users to the right place.
function explainNoAccess(options: VideomailClientOptions) {
  const browser = getBrowser(options);

  if (browser.isChromeBased()) {
    return "Click on the allow button to grant access to your webcam";
  }

  if (browser.isFirefox()) {
    return "Please grant Firefox access to your webcam";
  }

  return "Your system does not let your browser access your webcam";
}

export default explainNoAccess;
