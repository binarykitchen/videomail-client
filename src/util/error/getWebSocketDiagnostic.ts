/*
 * Some crawlers report "the provided URL is invalid" for valid WebSocket URLs.
 * During investigation:
 * - URL parsing succeeded and the page used HTTPS.
 * - Both a bare wss:// URL and a simple query threw SyntaxError on construction.
 * - User agents looked like Chrome, and navigator.webdriver was false.
 *
 * These probes help separate URL problems from runtimes without working sockets.
 */

function getEdgeCodes(value: string, amount: number, fromEnd?: boolean) {
  const chars = fromEnd ? value.slice(-amount) : value.slice(0, amount);
  const codes = Array.from(chars, (char) => String(char.codePointAt(0))).join(".");

  return codes || "none";
}

function hasControlCharacters(value: string) {
  return Array.from(value).some((char) => {
    const code = char.codePointAt(0);

    if (code === undefined) {
      return false;
    }

    return code <= 31 || code === 127;
  });
}

function probeWebSocketConstructor(url: string) {
  // Test construction, not connectivity. Some crawlers fail even on a simple URL.
  try {
    const socket = new WebSocket(url);
    socket.close();
    return "ok";
  } catch (exc) {
    if (exc instanceof Error) {
      return `${exc.name}:${exc.message}`;
    }

    return String(exc);
  }
}

function getLanguagesValue() {
  const languageList = navigator.languages;

  if (languageList.length > 0) {
    return languageList.join(",");
  }

  // navigator.languages is empty in some minimal/headless environments.
  return navigator.language || "none";
}

function getAutomationSignals(probeBase: string, probeSimpleQuery: string) {
  const reasons: string[] = [];

  // Some crawlers hide webdriver, so false does not rule out automation.
  if (navigator.webdriver) {
    reasons.push("webdriver=true");
  }

  // Some headless runtimes still leak their identity in the UA string.
  if (/HeadlessChrome|PhantomJS|puppeteer|playwright/iu.test(navigator.userAgent)) {
    reasons.push("headless_ua_marker");
  }

  // An empty language list can be another automation hint.
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
    looksAutomated: reasons.length > 0,
    reasons: reasons.length > 0 ? reasons.join(",") : "none",
  };
}

function getWebSocketDiagnostic(url2Connect: string) {
  const wsCtorFingerprint = String(globalThis.WebSocket)
    .slice(0, 80)
    .replace(/\s+/gu, " ");
  const wsCtorNative = wsCtorFingerprint.includes("[native code]");

  let urlParsedProtocol = "invalid";

  try {
    urlParsedProtocol = new URL(url2Connect).protocol;
  } catch (_exc) {
    // Keep "invalid" when parsing fails.
  }

  const urlHasWhitespace = /\s/u.test(url2Connect);
  const urlHasControlChars = hasControlCharacters(url2Connect);
  const urlHasReplacementChar = url2Connect.includes("\uFFFD");
  const probeBase = probeWebSocketConstructor("wss://videomail.io");
  const probeWithSimpleQuery = probeWebSocketConstructor("wss://videomail.io/?a=b");
  const languages = getLanguagesValue();
  const automationSignals = getAutomationSignals(probeBase, probeWithSimpleQuery);

  const diagnosticPairs = [
    `webdriver=${String(navigator.webdriver)}`,
    `wsCtorNative=${String(wsCtorNative)}`,
    `looksAutomated=${String(automationSignals.looksAutomated)}`,
    `automationReasons=${automationSignals.reasons}`,
    `urlLen=${url2Connect.length}`,
    `urlParsedProtocol=${urlParsedProtocol}`,
    `locationProtocol=${location.protocol}`,
    `secureContext=${String(globalThis.isSecureContext)}`,
    `online=${String(navigator.onLine)}`,
    `languages=${languages}`,
    `urlHasWhitespace=${String(urlHasWhitespace)}`,
    `urlHasControlChars=${String(urlHasControlChars)}`,
    `urlHasReplacementChar=${String(urlHasReplacementChar)}`,
    `probeBase=${probeBase}`,
    `probeSimpleQuery=${probeWithSimpleQuery}`,
    `urlFirstCodes=${getEdgeCodes(url2Connect, 4)}`,
    `urlLastCodes=${getEdgeCodes(url2Connect, 4, true)}`,
    "ipAsnCheck=server_side_only",
  ];

  return {
    text: `websocketDiagnostics(v3): ${diagnosticPairs.join("; ")}`,
    looksAutomated: automationSignals.looksAutomated,
  };
}

export default getWebSocketDiagnostic;
