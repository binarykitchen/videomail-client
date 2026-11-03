/*
 * Some browser environments reject valid WebSocket URLs during construction.
 *
 * During investigation:
 * - URL parsing succeeded and the page used HTTPS.
 * - Both a bare wss:// URL and a simple query threw SyntaxError on construction.
 * - User agents looked like Chrome, and navigator.webdriver was false.
 *
 * These probes test construction, not connectivity or the visitor's identity.
 */

import getAutomationSignals from "../getAutomationSignals";

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

function getConstructorDetails() {
  const socketConstructor: unknown = globalThis.WebSocket;
  const available = typeof socketConstructor === "function";
  let name: string | undefined;
  let arity: number | undefined;
  let nativeLike = false;

  if (available) {
    name = socketConstructor.name.slice(0, 80);
    arity = socketConstructor.length;
    nativeLike = Function.prototype.toString
      .call(socketConstructor)
      .includes("[native code]");
  }

  // Native-looking functions can still be proxies; do not treat this as bot evidence.
  return { available, name, arity, nativeLike };
}

function getWebSocketDiagnostic(url2Connect: string) {
  const constructor = getConstructorDetails();
  let urlParsedProtocol = "invalid";
  let endpoint: string | undefined;

  try {
    const url = new URL(url2Connect);
    urlParsedProtocol = url.protocol;
    endpoint = `${url.origin}${url.pathname}`;
  } catch (_exc) {
    // Keep "invalid" when parsing fails.
  }

  const urlHasWhitespace = /\s/u.test(url2Connect);
  const urlHasControlChars = hasControlCharacters(url2Connect);
  const urlHasReplacementChar = url2Connect.includes("\uFFFD");
  const probeBase = probeWebSocketConstructor("wss://videomail.io");
  const probeWithSimpleQuery = probeWebSocketConstructor("wss://videomail.io/?a=b");
  const languages = getLanguagesValue();
  const automationSignals = getDiagnosticSignals(probeBase, probeWithSimpleQuery);
  const details = {
    version: 4,
    constructor,
    endpoint,
    urlLength: url2Connect.length,
    urlParsedProtocol,
    urlHasWhitespace,
    urlHasControlChars,
    urlHasReplacementChar,
    probeBase,
    probeSimpleQuery: probeWithSimpleQuery,
    locationProtocol: location.protocol,
    secureContext: globalThis.isSecureContext,
    online: navigator.onLine,
    languages,
    visibilityState: document.visibilityState,
    topLevel: window.top === window,
  };

  const diagnosticPairs = [
    `webdriver=${String(navigator.webdriver)}`,
    `wsCtorNative=${String(constructor.nativeLike)}`,
    `wsCtorName=${constructor.name ?? "unavailable"}`,
    `wsCtorArity=${constructor.arity ?? "unavailable"}`,
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
    text: `websocketDiagnostics(v4): ${diagnosticPairs.join("; ")}`,
    looksAutomated: automationSignals.looksAutomated,
    details,
  };
}

export default getWebSocketDiagnostic;
