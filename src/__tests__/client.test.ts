import { VideomailClient } from "../client";

const fakeSockets: FakeWebSocket[] = [];

class FakeWebSocket {
  public static readonly CLOSING = 2;
  public static readonly OPEN = 1;

  public readonly OPEN = FakeWebSocket.OPEN;
  public readyState = 0;
  public onclose?: (event: Event) => void;
  public onopen?: (event: Event) => void;

  private readonly listeners = new Map<string, ((event: Event) => void)[]>();

  public constructor(public readonly url: string) {
    fakeSockets.push(this);
  }

  public addEventListener(eventName: string, listener: (event: Event) => void) {
    const listeners = this.listeners.get(eventName) ?? [];
    listeners.push(listener);
    this.listeners.set(eventName, listeners);
  }

  public close() {
    if (this.readyState === 3) {
      return;
    }

    this.readyState = 3;
    this.emit("close", new Event("close"));
  }

  public open() {
    this.readyState = FakeWebSocket.OPEN;
    this.emit("open", new Event("open"));
  }

  private emit(eventName: string, event: Event) {
    if (eventName === "close") {
      this.onclose?.(event);
    }

    if (eventName === "open") {
      this.onopen?.(event);
    }

    for (const listener of this.listeners.get(eventName) ?? []) {
      listener(event);
    }
  }
}

describe("Client", () => {
  const mock = {
    onHide() {},
  };

  it("constructor with default arguments", () => {
    const videomailClient = new VideomailClient();

    expect(videomailClient.isBuilt()).toBe(false);
  });

  it("constructor throws error when width is not divisible by two", () => {
    expect(() => {
      new VideomailClient({ reportErrors: false, video: { width: 99 } });
    }).toThrow(/Width must be divisible by two/u);
  });

  it("showing it sets its built flag to true", () => {
    const videomailClient = new VideomailClient();

    videomailClient.show();

    expect(videomailClient.isBuilt()).toBe(true);
  });

  it("hiding emits hide event", () => {
    const videomailClient = new VideomailClient();

    const onHideSpy = vi.spyOn(mock, "onHide");

    videomailClient.show();

    videomailClient.on("HIDE", () => {
      mock.onHide();
    });

    videomailClient.hide();

    expect(onHideSpy).toHaveBeenCalledTimes(1);
  });

  it("on unload, hidden and not built", () => {
    const videomailClient = new VideomailClient();

    videomailClient.show();
    videomailClient.unload();

    expect(videomailClient.isBuilt()).toBe(false);
  });

  it("not dirty when just shown", () => {
    const videomailClient = new VideomailClient();
    videomailClient.show();

    expect(videomailClient.isDirty()).toBe(false);
  });

  it("not recording when just shown", () => {
    const videomailClient = new VideomailClient();
    videomailClient.show();

    expect(videomailClient.isRecording()).toBe(false);
  });

  it("retries an initial WebSocket close before emitting an error", async () => {
    vi.useFakeTimers();
    fakeSockets.length = 0;

    const nativeWebSocket = globalThis.WebSocket;
    globalThis.WebSocket = FakeWebSocket as unknown as typeof WebSocket;

    try {
      const videomailClient = new VideomailClient({
        reportErrors: false,
        timeouts: { connection: 3e3 },
      });
      const onConnected = vi.fn();
      const onError = vi.fn();

      videomailClient.on("CONNECTED", onConnected);
      videomailClient.on("ERROR", onError);
      videomailClient.show();

      expect(fakeSockets).toHaveLength(1);

      const initialSocket = fakeSockets[0];

      if (!initialSocket) {
        throw new Error("The initial fake WebSocket was not created");
      }

      initialSocket.close();
      vi.runAllTicks();
      await vi.advanceTimersByTimeAsync(0);

      expect(onError).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(1e3);

      expect(fakeSockets).toHaveLength(2);

      const retrySocket = fakeSockets[1];

      if (!retrySocket) {
        throw new Error("The retry fake WebSocket was not created");
      }

      retrySocket.open();

      expect(onConnected).toHaveBeenCalledTimes(1);
      videomailClient.unload();
    } finally {
      Object.defineProperty(globalThis, "WebSocket", {
        configurable: true,
        value: nativeWebSocket,
        writable: true,
      });
      vi.useRealTimers();
      fakeSockets.splice(0);
    }
  });

  it("emits an error when the initial WebSocket retry window expires", async () => {
    vi.useFakeTimers();
    fakeSockets.length = 0;

    const nativeWebSocket = globalThis.WebSocket;
    globalThis.WebSocket = FakeWebSocket as unknown as typeof WebSocket;

    try {
      const videomailClient = new VideomailClient({
        reportErrors: false,
        timeouts: { connection: 3e3 },
      });
      const onError = vi.fn();

      videomailClient.on("ERROR", onError);
      videomailClient.show();

      const initialSocket = fakeSockets[0];

      if (!initialSocket) {
        throw new Error("The initial fake WebSocket was not created");
      }

      initialSocket.close();
      vi.runAllTicks();
      await vi.advanceTimersByTimeAsync(3e3);

      expect(onError).toHaveBeenCalledTimes(1);
      videomailClient.unload();
    } finally {
      Object.defineProperty(globalThis, "WebSocket", {
        configurable: true,
        value: nativeWebSocket,
        writable: true,
      });
      vi.useRealTimers();
      fakeSockets.splice(0);
    }
  });
});
