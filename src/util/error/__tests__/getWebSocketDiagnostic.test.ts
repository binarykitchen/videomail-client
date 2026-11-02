import getWebSocketDiagnostic from "../getWebSocketDiagnostic";

describe("getWebSocketDiagnostic", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([{ languages: [] }, { languages: ["en-NZ"] }])(
    "does not label constructor failures or language settings as automation: %j",
    ({ languages }) => {
      vi.stubGlobal("navigator", {
        userAgent: "Mozilla/5.0 Chrome/156.0.0.0",
        webdriver: false,
        languages,
        language: "en-NZ",
        onLine: true,
      });
      vi.stubGlobal("WebSocket", function () {
        throw new DOMException("Socket construction blocked", "SecurityError");
      });

      expect(getWebSocketDiagnostic("wss://example.test/ws").looksAutomated).toBe(false);
    },
  );
});
