import { createNanoEvents } from "nanoevents";

import getEventDetails from "../error/getEventDetails";
import Timeout from "../Timeout";
import decodeMessage from "./util/decodeMessage";
import isSendable from "./util/isSendable";

/*
 * The CONNECTING ready state from the WebSocket spec. Kept here, because wrappers
 * and test doubles don't always copy the static constants of the global WebSocket.
 */
const CONNECTING = 0;

/*
 * Backpressure 🚰
 *
 * Browsers have no "drain" event, only bufferedAmount: the bytes still waiting to
 * go out. Writers pause once more than 512 KiB wait, the same point where
 * websocket-stream used to throttle. They continue once half of it has gone, so
 * they don't flip between pausing and writing on every frame.
 */
const HIGH_WATER_MARK_BYTES = 512 * 1024;
const LOW_WATER_MARK_BYTES = HIGH_WATER_MARK_BYTES / 2;

// How often to look at bufferedAmount again while writers are paused.
const DRAIN_CHECK_INTERVAL_MS = 50;

/*
 * Browsers fire close straight after error, in the same task. Should a wrapper
 * ever skip that close, the error still gets reported after this grace period.
 */
const ERROR_WITHOUT_CLOSE_GRACE_MS = 1000;

// "Normal closure". Without any code, the server would log 1005 (no status).
const NORMAL_CLOSURE_CODE = 1000;

export interface SocketCloseDetails {
  code: number;
  reason: string;
  wasClean: boolean;
}

interface SocketStreamEvents {
  connect: () => void;
  data: (text: string) => void;
  drain: () => void;
  // Close details are missing only when a wrapper never closed after the error.
  error: (event: Event, closeDetails?: SocketCloseDetails) => void;
  close: (closeDetails: SocketCloseDetails) => void;
}

interface HeldWrite {
  chunk: Uint8Array;
  onFlushed: (() => void) | undefined;
}

/*
 * A thin, stream-like layer over the browser's own WebSocket 🔌
 *
 * It replaces websocket-stream, which wrapped the socket in Node streams and
 * pulled their polyfills into our bundle. The recorder listens to the same
 * events as before: connect, data, drain, error and close.
 *
 *   recorder ──write()──▶ SocketStream ──send()──▶ WebSocket ──▶ Videomail
 *       ▲                      │
 *       └── false, then drain ─┘   only while over 512 KiB wait to be sent
 */
class SocketStream {
  public readonly socket: WebSocket;

  private readonly emitter = createNanoEvents<SocketStreamEvents>();

  private readonly drainCheck = new Timeout();

  private readonly errorWithoutClose = new Timeout();

  // Browsers throw when sending before the socket opens, so hold writes until then.
  private heldWrites: HeldWrite[] = [];

  // An error waits for the close that follows, so it can be reported with its close code.
  private pendingError: Event | undefined;

  private ended = false;

  // Everything below is only kept for error reports.
  private openedAt: number | undefined;

  private closedAt: number | undefined;

  private messagesSent = 0;

  private bytesSent = 0;

  private messagesReceived = 0;

  private closeDetails: SocketCloseDetails | undefined;

  private errorDetails: Record<string, unknown> | undefined;

  // Pass a freshly created socket. From here on, the stream owns it.
  public constructor(socket: WebSocket) {
    this.socket = socket;

    // Binary messages then arrive as bytes, which decode right away and in order.
    socket.binaryType = "arraybuffer";

    socket.addEventListener("open", () => {
      this.handleOpen();
    });

    socket.addEventListener("message", (event) => {
      this.handleMessage(event);
    });

    socket.addEventListener("error", (event) => {
      this.handleError(event);
    });

    socket.addEventListener("close", (event) => {
      this.handleClose(event);
    });
  }

  // Like websocket-stream: true once we destroyed it, or once the socket failed or closed.
  public get destroyed() {
    return this.ended;
  }

  public on<E extends keyof SocketStreamEvents>(
    event: E,
    callback: SocketStreamEvents[E],
  ) {
    return this.emitter.on(event, callback);
  }

  /*
   * Returns false once the browser falls behind with sending. Then wait for
   * "drain" before writing more. onFlushed runs once the socket took the chunk.
   */
  public write(chunk: Uint8Array, onFlushed?: () => void) {
    if (this.socket.readyState === CONNECTING) {
      this.heldWrites.push({ chunk, onFlushed });
      return true;
    }

    this.send(chunk, onFlushed);

    if (this.isBehind()) {
      this.waitForDrain();
      return false;
    }

    return true;
  }

  // Closes the socket and forgets every listener, so late events reach no one.
  public destroy() {
    this.end();
    this.pendingError = undefined;
    this.errorWithoutClose.clear();
    this.emitter.events = {};
    this.socket.close(NORMAL_CLOSURE_CODE);
  }

  // A snapshot for error reports: how far the socket got and how it ended.
  public getDiagnostics() {
    const openForMs =
      this.openedAt === undefined
        ? undefined
        : (this.closedAt ?? Date.now()) - this.openedAt;

    return {
      readyState: this.socket.readyState,
      bufferedAmount: this.socket.bufferedAmount,
      binaryType: this.socket.binaryType,
      protocol: this.socket.protocol,
      extensions: this.socket.extensions,
      openForMs,
      messagesSent: this.messagesSent,
      bytesSent: this.bytesSent,
      messagesReceived: this.messagesReceived,
      heldWrites: this.heldWrites.length,
      waitingForDrain: this.drainCheck.isPending(),
      destroyed: this.ended,
      close: this.closeDetails,
      error: this.errorDetails,
    };
  }

  private handleOpen() {
    this.openedAt = Date.now();

    const heldWrites = this.heldWrites;
    this.heldWrites = [];

    // Held writes go first, so nothing can overtake them once connected.
    for (const { chunk, onFlushed } of heldWrites) {
      this.send(chunk, onFlushed);
    }

    this.emitter.emit("connect");
  }

  private handleMessage(event: MessageEvent<unknown>) {
    this.messagesReceived++;
    this.emitter.emit("data", decodeMessage(event.data));
  }

  private handleError(event: Event) {
    this.end();
    this.pendingError = event;
    this.errorDetails = getEventDetails(event);

    this.errorWithoutClose.start(() => {
      this.reportPendingError();
    }, ERROR_WITHOUT_CLOSE_GRACE_MS);
  }

  private handleClose(event: CloseEvent) {
    this.end();
    this.closedAt = Date.now();
    this.closeDetails = {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean,
    };

    // websocket-stream reported errors before the close, too. Keep that order.
    this.reportPendingError(this.closeDetails);
    this.emitter.emit("close", this.closeDetails);
  }

  private reportPendingError(closeDetails?: SocketCloseDetails) {
    const error = this.pendingError;

    if (!error) {
      return;
    }

    // Report each error once, even if a late close follows the grace period.
    this.pendingError = undefined;
    this.errorWithoutClose.clear();
    this.emitter.emit("error", error, closeDetails);
  }

  // No more sending or waiting. Pending errors still get reported.
  private end() {
    this.ended = true;
    this.heldWrites = [];
    this.drainCheck.clear();
  }

  private send(chunk: Uint8Array, onFlushed: (() => void) | undefined) {
    this.socket.send(isSendable(chunk) ? chunk : new Uint8Array(chunk));

    this.messagesSent++;
    this.bytesSent += chunk.byteLength;

    // The socket has taken the chunk. Like stream callbacks, confirm asynchronously.
    if (onFlushed) {
      queueMicrotask(onFlushed);
    }
  }

  private isBehind() {
    return this.socket.bufferedAmount > HIGH_WATER_MARK_BYTES;
  }

  private hasCaughtUp() {
    return this.socket.bufferedAmount <= LOW_WATER_MARK_BYTES;
  }

  private waitForDrain() {
    // Keep a pending check, so further writes can't keep pushing it back.
    if (this.drainCheck.isPending()) {
      return;
    }

    this.drainCheck.start(() => {
      if (this.hasCaughtUp()) {
        this.emitter.emit("drain");
      } else {
        this.waitForDrain();
      }
    }, DRAIN_CHECK_INTERVAL_MS);
  }
}

export default SocketStream;
