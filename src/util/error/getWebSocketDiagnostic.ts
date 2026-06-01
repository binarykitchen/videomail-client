function getWebSocketDiagnostic() {
  const wsCtorName = globalThis.WebSocket.name;
  const wsCtorFingerprint = String(globalThis.WebSocket)
    .slice(0, 80)
    .replace(/\s+/gu, " ");

  const webdriverFlag = String(navigator.webdriver);
  const diagnostic =
    ` websocketDiagnostics{webdriver=${webdriverFlag}, wsCtor=${wsCtorName}, ` +
    `wsCtorFingerprint=${wsCtorFingerprint}}`;

  return diagnostic;
}

export default getWebSocketDiagnostic;
