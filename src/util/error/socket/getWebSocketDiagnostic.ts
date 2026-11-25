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

import getConstructorDetails from "./util/getConstructorDetails";
import getDiagnosticSignals from "./util/getDiagnosticSignals";
import getEdgeCodes from "./util/getEdgeCodes";
import getLanguagesValue from "./util/getLanguagesValue";
import hasControlCharacters from "./util/hasControlCharacters";
import probeWebSocketConstructor from "./util/probeWebSocketConstructor";

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
