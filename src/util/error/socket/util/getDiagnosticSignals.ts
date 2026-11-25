import getAutomationSignals from "../../../getAutomationSignals";

function getDiagnosticSignals(probeBase: string, probeSimpleQuery: string) {
  const reasons: string[] = [];
  const automation = getAutomationSignals();

  // Some crawlers hide webdriver, so false does not rule out automation.
  if (automation.webdriver) {
    reasons.push("webdriver=true");
  }

  // Some headless runtimes still leak their identity in the UA string.
  if (automation.userAgentMatched) {
    reasons.push("headless_ua_marker");
  }

  // Language settings are context, not proof of automation.
  if (navigator.languages.length === 0) {
    reasons.push("no_languages");
  }

  // A simple URL failing during construction points to a runtime problem.
  if (probeBase !== "ok") {
    reasons.push("probe_base_failed");
  }

  if (probeSimpleQuery !== "ok") {
    reasons.push("probe_simple_query_failed");
  }

  return {
    // Socket failures and language settings are diagnostics, not proof of a bot.
    looksAutomated: automation.webdriver || automation.userAgentMatched,
    reasons: reasons.length > 0 ? reasons.join(",") : "none",
  };
}

export default getDiagnosticSignals;
