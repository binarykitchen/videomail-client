import isAutomatedUserAgent from "./isAutomatedUserAgent";

function getAutomationSignals() {
  const webdriver: unknown = navigator.webdriver;

  // Missing markers mean "not detected", never "definitely human".
  return {
    webdriver: webdriver === true,
    userAgentMatched: isAutomatedUserAgent(),
  };
}

export default getAutomationSignals;
