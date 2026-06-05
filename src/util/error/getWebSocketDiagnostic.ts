// Temporary: this to be removed once we have a better understanding of the root cause of
// random WebSocket connection failures from deafhistorycollectionsaustralia

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

function getWebSocketDiagnostic(url2Connect: string) {
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

  const diagnostic =
    ` websocketDiagnostics{` +
    `webdriver=${String(navigator.webdriver)}, ` +
    `wsCtorNative=${String(wsCtorNative)}, ` +
    `urlLen=${url2Connect.length}, ` +
    `urlParsedProtocol=${urlParsedProtocol}, ` +
    `locationProtocol=${location.protocol}, ` +
    `secureContext=${String(globalThis.isSecureContext)}, ` +
    `online=${String(navigator.onLine)}, ` +
    `urlHasWhitespace=${String(urlHasWhitespace)}, ` +
    `urlHasControlChars=${String(urlHasControlChars)}, ` +
    `urlHasReplacementChar=${String(urlHasReplacementChar)}, ` +
    `urlFirstCodes=${getEdgeCodes(url2Connect, 4)}, ` +
    `urlLastCodes=${getEdgeCodes(url2Connect, 4, true)}` +
    `}`;

  return diagnostic;
}

export default getWebSocketDiagnostic;
