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

  it("records a wrapper separately from automation and removes query data from its endpoint", () => {
    function WrappedSocket(_url: string, _protocols?: string[]) {
      throw new DOMException("The provided URL is invalid.", "SyntaxError");
    }
    vi.stubGlobal("WebSocket", WrappedSocket);

    const diagnostic = getWebSocketDiagnostic(
      "wss://user:password@example.test/ws?token=private#fragment",
    );

    expect(diagnostic.details).toMatchObject({
      version: 4,
      constructor: {
        available: true,
        name: "WrappedSocket",
        arity: 2,
        nativeLike: false,
      },
      endpoint: "wss://example.test/ws",
      urlParsedProtocol: "wss:",
      urlHasWhitespace: false,
      urlHasControlChars: false,
      urlHasReplacementChar: false,
      probeBase: "SyntaxError:The provided URL is invalid.",
      probeSimpleQuery: "SyntaxError:The provided URL is invalid.",
    });
  });

  it("distinguishes successful construction from a successful handshake", () => {
    const close = vi.fn();
    vi.stubGlobal("WebSocket", function Socket() {
      return { close };
    });

    const diagnostic = getWebSocketDiagnostic("wss://example.test/ws");

    expect({
      base: diagnostic.details.probeBase,
      simpleQuery: diagnostic.details.probeSimpleQuery,
      closed: close.mock.calls.length,
    }).toEqual({ base: "ok", simpleQuery: "ok", closed: 2 });
  });

  it("still produces diagnostics when the WebSocket API is missing", () => {
    vi.stubGlobal("WebSocket", undefined);

    expect(getWebSocketDiagnostic("wss://example.test/ws").details.constructor).toEqual({
      available: false,
      name: undefined,
      arity: undefined,
      nativeLike: false,
    });
  });
});
