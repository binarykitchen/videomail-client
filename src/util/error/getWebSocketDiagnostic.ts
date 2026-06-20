/*
 * Background
 * ----------
 * From June 2026 onwards we observed repeated "Failed to construct WebSocket:
 * the provided URL is invalid" errors from deafhistorycollections.com.au.
 * All originated from Tencent cloud IPs (Beijing, AS45090) that set
 * languages=zh-CN,zh and spoofed macOS/Chrome user-agents.
 *
 * Investigation findings:
 * - The constructed URL itself was always valid and clean.
 * - new URL(socketUrl) succeeded; parsed protocol was correctly "wss:".
 * - The page was served over HTTPS (secureContext=true) from the same domain.
 * - probeBase (wss://videomail.io) and probeSimpleQuery (wss://videomail.io/?a=b)
 *   BOTH threw SyntaxError — meaning the runtime cannot construct ANY WebSocket,
 *   not just ours. This is the definitive signal: it is not a URL problem.
 * - navigator.webdriver was false, but modern stealth crawlers hide this flag.
 *
 * Conclusion: these are JavaScript-capable web scrapers / headless crawlers
 * rendering pages for indexing. They execute JS but have no real browser
 * networking stack, so any WebSocket construction fails at the engine level.
 * Real users never trigger probeBase failures.
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
  /*
   * The most reliable bot signal: try constructing a completely trivial WebSocket.
   * A real browser will accept wss://videomail.io (it may fail to connect, but
   * the constructor itself never throws for a syntactically valid URL).
   * Crawlers with no networking stack throw SyntaxError synchronously here,
   * which conclusively identifies them regardless of spoofed UA or webdriver=false.
   */
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

  /*
   * webdriver=true is only set by standard Selenium/WebDriver tooling.
   * Stealth crawlers actively hide it, so absence does NOT prove a real user.
   * It is kept here as a low-effort early signal when present.
   */
  if (navigator.webdriver) {
    reasons.push("webdriver=true");
  }

  // Some headless runtimes still leak their identity in the UA string.
  if (/HeadlessChrome|PhantomJS|puppeteer|playwright/iu.test(navigator.userAgent)) {
    reasons.push("headless_ua_marker");
  }

  // Real browsers always expose at least one language. An empty list is a red flag.
  if (navigator.languages.length === 0) {
    reasons.push("no_languages");
  }

  /*
   * Definitive signal: if even the simplest wss:// URL fails synchronously in
   * the constructor, this runtime has no functional WebSocket support at all.
   * No real browser ever fails here for a syntactically valid URL.
   */
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

export interface WebSocketDiagnosticResult {
  text: string;
  looksAutomated: boolean;
}

function getWebSocketDiagnostic(url2Connect: string): WebSocketDiagnosticResult {
  const wsCtorFingerprint = String(globalThis.WebSocket)
    .slice(0, 80)
    .replace(/\s+/gu, " ");
  const wsCtorNative = wsCtorFingerprint.includes("[native code]");

  let urlParsedProtocol = "invalid";

  try {
    urlParsedProtocol = new URL(url2Connect).protocol;
  } catch (_exc) {
    // keep fallback value "invalid"
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
