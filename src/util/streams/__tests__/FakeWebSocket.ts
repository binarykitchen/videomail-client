/*
 * A browser-like WebSocket for tests 🧪
 *
 * It records what gets sent and dispatches real DOM events, so code under test
 * sees the same event objects and order as in a browser: error, then close.
 */
class FakeWebSocket extends EventTarget {
  // Ready states, like the static ones on the global WebSocket.
  public static readonly CONNECTING = 0;
  public static readonly OPEN = 1;
  public static readonly CLOSING = 2;
  public static readonly CLOSED = 3;

  public readyState = 0;

  public bufferedAmount = 0;

  public binaryType: BinaryType = "blob";

  public protocol = "";

  public extensions = "";

  public readonly sent: unknown[] = [];

  public readonly close = vi.fn((_code?: number, _reason?: string) => {
    this.readyState = 2;
  });

  // Like browsers, refuse to send before the socket opened.
  public send(data: unknown) {
    if (this.readyState === 0) {
      throw new DOMException("Still in CONNECTING state.", "InvalidStateError");
    }

    this.sent.push(data);
  }

  public open() {
    this.readyState = 1;
    this.dispatchEvent(new Event("open"));
  }

  public receive(data: unknown) {
    this.dispatchEvent(new MessageEvent("message", { data }));
  }

  // A failed connection: browsers fire error, then close, in the same task.
  public fail(code = 1006) {
    this.readyState = 3;
    this.dispatchEvent(new Event("error"));
    this.dispatchEvent(new CloseEvent("close", { code, reason: "", wasClean: false }));
  }

  public closeFromServer(code: number, reason = "") {
    this.readyState = 3;
    this.dispatchEvent(new CloseEvent("close", { code, reason, wasClean: true }));
  }

  // Pretends to be a WebSocket for code that expects one.
  public asWebSocket() {
    return this as unknown as WebSocket;
  }
}

export default FakeWebSocket;
