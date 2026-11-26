import SocketStream from "../SocketStream";
import FakeWebSocket from "./FakeWebSocket";

const KIB = 1024;

function createStream() {
  const socket = new FakeWebSocket();
  const stream = new SocketStream(socket.asWebSocket());

  return { socket, stream };
}

describe("SocketStream", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("holds writes until the socket opens, then sends them first and in order", () => {
    const { socket, stream } = createStream();
    const sentWhenConnected: unknown[][] = [];
    stream.on("connect", () => sentWhenConnected.push([...socket.sent]));
    const first = Uint8Array.of(1);
    const second = Uint8Array.of(2);

    const accepted = [stream.write(first), stream.write(second)];
    const sentBeforeOpen = socket.sent.length;
    socket.open();

    expect({ accepted, sentBeforeOpen, sentWhenConnected }).toStrictEqual({
      accepted: [true, true],
      sentBeforeOpen: 0,
      sentWhenConnected: [[first, second]],
    });
  });

  it("confirms a held write only once the socket has taken it", async () => {
    const { socket, stream } = createStream();
    const onFlushed = vi.fn<() => void>();

    stream.write(Uint8Array.of(1), onFlushed);
    await Promise.resolve();
    const callsBeforeOpen = onFlushed.mock.calls.length;
    socket.open();
    await Promise.resolve();

    expect({
      callsBeforeOpen,
      callsAfterOpen: onFlushed.mock.calls.length,
    }).toStrictEqual({ callsBeforeOpen: 0, callsAfterOpen: 1 });
  });

  it("asks writers to wait while the browser is behind and drains once half caught up", () => {
    const { socket, stream } = createStream();
    const drain = vi.fn<() => void>();
    stream.on("drain", drain);
    socket.open();

    socket.bufferedAmount = 600 * KIB;
    const accepted = stream.write(Uint8Array.of(1));
    socket.bufferedAmount = 300 * KIB;
    vi.advanceTimersByTime(50);
    const drainsWhileStillBehind = drain.mock.calls.length;
    socket.bufferedAmount = 200 * KIB;
    vi.advanceTimersByTime(50);

    expect({
      accepted,
      drainsWhileStillBehind,
      drains: drain.mock.calls.length,
    }).toStrictEqual({ accepted: false, drainsWhileStillBehind: 0, drains: 1 });
  });

  it("reports an error with the close details that follow it, before the close", () => {
    const { socket, stream } = createStream();
    const events: unknown[] = [];
    stream.on("error", (event, closeDetails) => events.push([event.type, closeDetails]));
    stream.on("close", (closeDetails) => events.push(["close", closeDetails]));
    socket.open();

    socket.fail(1006);

    const closeDetails = { code: 1006, reason: "", wasClean: false };

    expect(events).toStrictEqual([
      ["error", closeDetails],
      ["close", closeDetails],
    ]);
  });

  it("still reports an error once if a wrapper never closes after it", () => {
    const { socket, stream } = createStream();
    const errors: unknown[] = [];
    stream.on("error", (event, closeDetails) => errors.push([event.type, closeDetails]));
    socket.open();

    socket.dispatchEvent(new Event("error"));
    vi.advanceTimersByTime(1000);
    socket.closeFromServer(1006);

    expect(errors).toStrictEqual([["error", undefined]]);
  });

  it.each([
    ["text", '{"command":"ready"}'],
    ["binary", new TextEncoder().encode('{"command":"ready"}').buffer],
  ])("decodes %s server messages to text", (_kind, data) => {
    const { socket, stream } = createStream();
    const received: string[] = [];
    stream.on("data", (text) => received.push(text));
    socket.open();

    socket.receive(data);

    expect(received).toStrictEqual(['{"command":"ready"}']);
  });

  it("closes normally and ignores late events once destroyed", () => {
    const { socket, stream } = createStream();
    const listener = vi.fn<() => void>();
    stream.on("error", listener);
    stream.on("close", listener);
    socket.open();

    stream.destroy();
    socket.fail();

    expect({
      closeCalls: socket.close.mock.calls,
      destroyed: stream.destroyed,
      events: listener.mock.calls.length,
    }).toStrictEqual({ closeCalls: [[1000]], destroyed: true, events: 0 });
  });

  it("describes how far the socket got for error reports", () => {
    const { socket, stream } = createStream();
    socket.open();
    stream.write(Uint8Array.of(1, 2, 3));
    stream.write(Uint8Array.of(4, 5));
    socket.receive('{"command":"ready"}');

    socket.fail(1006);

    expect(stream.getDiagnostics()).toMatchObject({
      readyState: 3,
      binaryType: "arraybuffer",
      messagesSent: 2,
      bytesSent: 5,
      messagesReceived: 1,
      destroyed: true,
      close: { code: 1006, reason: "", wasClean: false },
      error: { type: "error" },
    });
  });
});
