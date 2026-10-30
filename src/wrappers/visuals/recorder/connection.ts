import { serializeError } from "serialize-error";
import websocket from "websocket-stream";

import Constants from "../../../constants";
import type { VideomailCommand, VideomailCommandArgs } from "../../../types/command";
import type { VideomailClientOptions } from "../../../types/options";
import type { RecordingStats } from "../../../types/RecordingStats";
import createError from "../../../util/error/createError";
import getEventDetails from "../../../util/error/getEventDetails";
import getWebSocketDiagnostic from "../../../util/error/getWebSocketDiagnostic";
import isAutomatedUserAgent from "../../../util/isAutomatedUserAgent";
import pretty from "../../../util/string/pretty";
import summarize from "../../../util/string/summarize";
import RecorderStreamWriter, { PIPE_SYMBOL } from "./streamWriter";

type ConnectionFailureReason = "timeout" | "closed" | "error";
type RecorderOutgoingCommandArgs = VideomailCommandArgs | RecordingStats;

abstract class RecorderConnection extends RecorderStreamWriter {
  protected reconnectTimeout?: number | undefined;

  protected connectionTimeout?: number | undefined;

  protected userMediaLoaded?: boolean | undefined;

  protected userMediaLoading = false;

  protected unloaded?: boolean;

  protected connectionFailed = false;

  protected reconnectAttempts = 0;

  protected blocking = false;

  protected connectingStartedAt?: number | undefined;

  protected lastCloseEvent?:
    { code: number; reason: string; wasClean: boolean } | undefined;

  protected lastSocketError?: Record<string, unknown> | undefined;

  protected pingInterval?: number | undefined;

  protected abstract executeCommand(command: VideomailCommand): void;
  public abstract isUserMediaLoaded(): boolean | undefined;
  public abstract validate(): boolean;

  protected constructor(options: VideomailClientOptions) {
    super(options);
  }

  private canReconnectAfterStreamClose() {
    return Boolean(this.connected && this.userMediaLoaded);
  }

  private shouldReportStreamClose() {
    return !this.connecting && !this.blocking;
  }

  private handleStreamClose(url2Connect: string) {
    const debugLine = summarize(`${PIPE_SYMBOL}Stream has closed:`, {
      connecting: this.connecting,
      connected: this.connected,
      userMediaLoaded: this.userMediaLoaded,
      blocking: this.blocking,
    });

    this.options.logger.debug(debugLine);

    const canReconnect = this.canReconnectAfterStreamClose();

    this.connected = false;
    this.stopPings();

    if (this.shouldIgnoreStreamClose()) {
      return;
    }

    if (this.mediaTransmissionStarted) {
      this.failInterruptedRecording();
    } else if (canReconnect) {
      // Before media starts, reconnecting cannot leave a gap in the take.
      this.pendingWrites.clear();
      this.streamBackpressured = false;
      this.resumeAfterDrain = false;
      this.reconnecting = true;
      this.initSocket();
    } else if (this.shouldReportStreamClose()) {
      window.setTimeout(() => {
        this.handleConnectionFailure({ url2Connect, cause: "closed" });
      }, 0);
    }
  }

  private shouldIgnoreStreamClose() {
    return this.recordingTransportFailed || Boolean(this.unloaded) || this.validate();
  }

  private handleStreamError(url2Connect: string, err: unknown) {
    if (typeof Event !== "undefined" && err instanceof Event) {
      this.lastSocketError = getEventDetails(err);
    } else {
      this.lastSocketError = serializeError(err);
    }

    const debugLine = summarize(`${PIPE_SYMBOL}Stream *error* event emitted:`, {
      error: serializeError(err),
    });

    this.options.logger.debug(debugLine);

    if (this.validate()) {
      this.connected = false;
      this.stopPings();
      this.discardSocket();
      return;
    }

    if (!this.connected) {
      this.handleConnectionFailure({ url2Connect, cause: "error" });
      return;
    }

    const streamError =
      err instanceof Error
        ? err
        : new Error("WebSocket stream emitted an error event", {
            cause: this.lastSocketError ?? err,
          });

    if (this.mediaTransmissionStarted) {
      this.failInterruptedRecording();
      return;
    }

    this.emit("ERROR", {
      err: createError({
        message: "WebSocket stream error",
        explanation: `The WebSocket stream emitted an error event. Details: ${pretty(err)}`,
        options: this.options,
        exc: streamError,
      }),
    });
  }

  protected sendPings() {
    this.stopPings();

    this.pingInterval = window.setInterval(() => {
      this.options.logger.debug("Recorder: pinging...");
      this.writeStream(Buffer.from(""));
    }, this.options.timeouts.pingInterval);
  }

  protected stopPings() {
    if (this.pingInterval === undefined) {
      return;
    }

    this.options.logger.debug("Recorder: stopping pings...");

    window.clearInterval(this.pingInterval);
    this.pingInterval = undefined;
  }

  protected clearConnectionTimeout() {
    if (this.connectionTimeout === undefined) {
      return;
    }

    this.options.logger.debug("Recorder: clearConnectionTimeout()");

    window.clearTimeout(this.connectionTimeout);
    this.connectionTimeout = undefined;
  }

  protected clearReconnectTimeout() {
    if (this.reconnectTimeout === undefined) {
      return;
    }

    this.options.logger.debug("Recorder: clearReconnectTimeout()");

    window.clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = undefined;
  }

  private handleConnectionFailure(params: {
    url2Connect: string;
    cause: ConnectionFailureReason;
  }) {
    if (this.retryConnection(params)) {
      return;
    }

    this.failConnection(params);
  }

  private retryConnection(params: {
    url2Connect: string;
    cause: ConnectionFailureReason;
  }) {
    if (!this.canRetryConnection()) {
      return false;
    }

    if (this.reconnectTimeout !== undefined) {
      return true;
    }

    // Back off between retries: 1s, 2s, 4s, up to 10s.
    const delayMs = Math.min(1000 * 2 ** this.reconnectAttempts, 10000);
    this.reconnectAttempts++;
    this.connecting = false;

    this.clearConnectionTimeout();
    this.discardSocket();

    this.options.logger.debug(
      `Recorder: retrying WebSocket connection in ${delayMs}ms (cause ${params.cause}).`,
    );

    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectTimeout = undefined;

      if (this.shouldContinueReconnect()) {
        this.initSocket();
      }
    }, delayMs);

    return true;
  }

  private canRetryConnection() {
    return Boolean(
      this.reconnecting &&
      this.userMediaLoaded &&
      this.isOnline() &&
      !this.unloaded &&
      !this.blocking,
    );
  }

  private shouldContinueReconnect() {
    return this.reconnecting && !this.unloaded && !this.blocking;
  }

  private isOnline() {
    return navigator.onLine;
  }

  /*
   * Browsers hide most details when a socket fails before OPEN.
   * Report here so the UI does not stay stuck on "Connecting".
   * Include what we can observe:
   * - Online status and time spent waiting.
   * - The native close code and reason, if available.
   */
  private failConnection(params: {
    url2Connect: string;
    cause: ConnectionFailureReason;
  }) {
    if (this.shouldIgnoreConnectionFailure()) {
      return;
    }

    this.connectionFailed = true;
    this.connecting = false;
    this.reconnecting = false;
    this.reconnectAttempts = 0;

    this.clearReconnectTimeout();
    this.clearConnectionTimeout();

    const { url2Connect, cause } = params;

    const online = this.isOnline();
    const elapsedMs = this.connectingStartedAt
      ? Date.now() - this.connectingStartedAt
      : undefined;
    const closeEvent = this.lastCloseEvent;
    const socketError = this.lastSocketError;

    const contents = {
      cause,
      closeCode: closeEvent?.code,
      closeReason: closeEvent?.reason,
      elapsedMs,
      online,
      secureContext: globalThis.isSecureContext,
      socketReadyState: this.stream?.socket.readyState,
      timeoutMs: this.options.timeouts.connection,
      url: url2Connect,
      unloaded: this.unloaded,
      userMediaLoaded: this.userMediaLoaded,
      userMediaLoading: this.userMediaLoading,
      wasClean: closeEvent?.wasClean,
      socketError,
      blocking: this.blocking,
      visibilityState: document.visibilityState,
    };

    const debugLine = summarize("Recorder: failConnection() diagnostic", contents);

    this.options.logger.debug(debugLine);

    let explanation: string;

    if (!online) {
      explanation =
        "Your device appears to be offline. Please check your internet connection and try again.";
    } else if (cause === "timeout") {
      explanation = `The server at ${url2Connect} did not respond within ${this.options.timeouts.connection}ms, even though your device is online. This usually points to a firewall or proxy silently dropping the connection. Please try a different network. If the problem persists, contact us.`;
    } else if (cause === "error") {
      explanation = `An error occurred while connecting to ${url2Connect}. Please check your internet connection and try again. If the problem persists, contact us.`;
    } else {
      const closeSuffix = closeEvent ? ` (code ${closeEvent.code})` : "";
      explanation = `Connection to ${url2Connect} is closed${closeSuffix}. Please check your internet connection and try again. If the problem persists, contact us.`;
    }

    this.discardSocket();

    const err = createError({
      message: "Unable to connect to the server",
      explanation,
      options: this.options,
      cause: contents,
      exc: socketError
        ? new Error("WebSocket connection error", { cause: socketError })
        : undefined,
    });

    this.emit("ERROR", { err });
  }

  private shouldIgnoreConnectionFailure() {
    return (
      this.connectionFailed || this.connected || Boolean(this.unloaded) || this.validate()
    );
  }

  protected initSocket(cb?: () => void) {
    if (this.connected) {
      this.options.logger.debug(
        "Recorder: already **connected**. Not going to initialize a new WebSocket connection.",
      );

      cb?.();
      return;
    }

    if (this.connecting) {
      this.options.logger.debug(
        "Recorder: already **connecting**. Not going to initialize a new WebSocket connection.",
      );

      return;
    }

    this.clearReconnectTimeout();

    // Skip known crawlers to avoid connection reports from non-recording clients.
    if (isAutomatedUserAgent()) {
      this.connecting = false;
      this.options.logger.debug(
        "Recorder: skipping web socket connection for an automated crawler",
      );
      return;
    }

    this.connecting = true;
    this.connectionFailed = false;
    this.connectingStartedAt = Date.now();
    this.lastCloseEvent = undefined;
    this.lastSocketError = undefined;

    this.emit("CONNECTING");

    // https://github.com/maxogden/websocket-stream#binary-sockets

    /*
     * Browser WebSockets cannot send custom headers. Use a query parameter instead.
     * See https://github.com/websockets/ws/issues/467.
     */

    let url2Connect: string;

    try {
      // Parse the configured URL before opening a socket.
      // searchParams handles encoding the whitelist key.
      const socketUrlObj = new URL(this.options.socketUrl);

      socketUrlObj.searchParams.set(
        Constants.WHITELIST_KEY_LABEL,
        this.options.whitelistKey,
      );

      url2Connect = socketUrlObj.toString();
    } catch (exc) {
      this.connecting = this.connected = false;

      const err = createError({
        message: "Invalid WebSocket URL",
        explanation: `The configured socketUrl "${this.options.socketUrl}" is not a valid URL. Please check your videomail-client configuration.`,
        options: this.options,
        exc,
      });

      this.emit("ERROR", { err });

      return;
    }

    this.options.logger.debug(
      `Recorder: initializing web socket stream to ${url2Connect}`,
    );

    let nativeSocket: WebSocket;

    /*
     * Open the native socket before wrapping it as a stream.
     * This avoids websocket-stream quirks when passing protocol arguments.
     */

    try {
      nativeSocket = new WebSocket(url2Connect);

      // Keep native close details before the stream wrapper hides them.
      // Code 1006, for example, means an abnormal close.
      nativeSocket.addEventListener("close", (event) => {
        this.lastCloseEvent = {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        };
      });

      nativeSocket.addEventListener("error", (event) => {
        this.lastSocketError = getEventDetails(event);
      });
    } catch (exc) {
      this.connecting = this.connected = false;

      const diagnostic = getWebSocketDiagnostic(url2Connect);

      // Useful for temporary full technical diagnostic regardless of cause
      // this.options.logger.debug(`Recorder: WebSocket diagnostic: ${diagnostic.text}`);

      /*
       * Use a clearly distinct message for crawler/bot failures so the
       * server can filter these from email alerts while still logging them.
       * A real user never reaches this branch with probeBase failing.
       */
      const message = diagnostic.looksAutomated
        ? "Automated crawler: WebSocket not supported in this environment"
        : `Failed to construct WebSocket to ${url2Connect}`;

      const explanation = diagnostic.looksAutomated
        ? "Headless crawlers cannot use Videomail's WebSocket. No action needed."
        : `Please check your connection and try again. If the problem persists, contact us. Diagnostic: ${diagnostic.text}`;

      const err = createError({
        message,
        explanation,
        options: this.options,
        exc,
      });

      this.emit("ERROR", { err });

      // No need to continue further
      return;
    }

    try {
      this.stream = websocket(nativeSocket);
    } catch (exc) {
      this.connecting = this.connected = false;

      const err = createError({
        message: `Failed to create a stream to ${url2Connect}`,
        explanation:
          "Please check your connection and try again. If the problem persists, contact us.",
        options: this.options,
        exc,
      });

      this.emit("ERROR", { err });
    }

    /*
        Why this? Because it matters for event handlers.
        Because it's a reference to the stream that matters for event handlers.
      */
    const stream = this.stream;

    if (stream) {
      const connectionTimeoutMs = this.options.timeouts.connection;

      this.connectionTimeout = window.setTimeout(() => {
        if (this.isOnline() && this.isUserMediaLoaded()) {
          // Most likely because the Videomail server has restarted during a deployment.
          // In that case, reconnecting is the appropriate action.

          this.options.logger.debug(
            `${PIPE_SYMBOL}Reconnecting due to connection timeout.`,
          );

          this.reconnecting = true;
          this.handleConnectionFailure({ url2Connect, cause: "timeout" });
        } else {
          /*
           * Covers the case where the connection stalls instead of being refused, for
           * example when packets to the host are silently dropped. Then neither an error
           * nor a close event ever arrives and only the OS level timeout would end it.
           */
          this.handleConnectionFailure({ url2Connect, cause: "timeout" });
        }
      }, connectionTimeoutMs);

      // useful for debugging streams

      /*
       * if (!stream.originalEmit) {
       *   stream.originalEmit = stream.emit
       * }
       */

      /*
       * stream.emit = function (type) {
       *   if (stream) {
       *     this.options.logger.debug(PIPE_SYMBOL + 'Debugging stream event:', type)
       *     var args = Array.prototype.slice.call(arguments, 0)
       *     return stream.originalEmit.apply(stream, args)
       *   }
       * }
       */

      stream.on("close", () => {
        this.handleStreamClose(url2Connect);
      });

      stream.on("connect", (args) => {
        this.options.logger.debug(
          `${PIPE_SYMBOL}Stream *connect* event emitted with args: ${pretty(args)}`,
        );

        this.clearConnectionTimeout();

        const isClosing = this.stream?.socket.readyState === WebSocket.CLOSING;

        if (!this.connected && !isClosing && !this.unloaded) {
          this.connected = true;
          this.connecting = this.unloaded = false;
          this.reconnecting = false;
          this.reconnectAttempts = 0;
          this.clearReconnectTimeout();

          this.emit("CONNECTED");

          cb?.();
        }
      });

      stream.on("data", (data: Uint8Array) => {
        this.options.logger.debug(`${PIPE_SYMBOL}Stream *data* event emitted`);

        try {
          const command = JSON.parse(data.toString());
          this.executeCommand(command);
        } catch (exc) {
          this.options.logger.error(`Failed to parse command: ${exc}`);

          const err = createError({
            message: "Invalid server command",
            // toString() since https://github.com/binarykitchen/videomail.io/issues/288
            explanation: `Contact us. The invalid command was: ${data.toString()}.`,
            options: this.options,
            exc,
          });

          this.emit("ERROR", { err });
        }
      });

      stream.on("error", (err) => {
        this.handleStreamError(url2Connect, err);
      });

      stream.on("drain", () => {
        this.handleStreamDrain(stream);
      });

      stream.on("preend", (args) => {
        this.options.logger.debug(
          `${PIPE_SYMBOL}Stream *preend* event emitted with args: ${pretty(args)}`,
        );
      });

      stream.on("end", () => {
        this.options.logger.debug(`${PIPE_SYMBOL}Stream *end* event emitted`);
      });

      stream.on("pipe", (src) => {
        this.options.logger.debug(
          `${PIPE_SYMBOL}Stream *pipe* event emitted with src: ${pretty(src)}`,
        );
      });

      stream.on("unpipe", (src) => {
        this.options.logger.debug(
          `${PIPE_SYMBOL}Stream *unpipe* event emitted with src: ${pretty(src)}`,
        );
      });

      stream.on("resume", (args) => {
        this.options.logger.debug(
          `${PIPE_SYMBOL}Stream *resume* event emitted with args: ${pretty(args)}`,
        );
      });

      stream.on("uncork", (args) => {
        this.options.logger.debug(
          `${PIPE_SYMBOL}Stream *uncork* event emitted with args: ${pretty(args)}`,
        );
      });

      stream.on("readable", (args) => {
        this.options.logger.debug(
          `${PIPE_SYMBOL}Stream *readable* event emitted with args: ${pretty(args)}`,
        );
      });

      stream.on("prefinish", (args) => {
        this.options.logger.debug(
          `${PIPE_SYMBOL}Stream *prefinish* event emitted with args: ${pretty(args)}`,
        );
      });

      stream.on("finish", (args) => {
        this.options.logger.debug(
          `${PIPE_SYMBOL}Stream *finish* event emitted with args: ${pretty(args)}`,
        );
      });
    }
  }

  protected writeCommand(
    command: string,
    args?: RecorderOutgoingCommandArgs,
    cb?: () => void,
  ) {
    if (!this.connected) {
      this.options.logger.debug(`Reconnecting for the command ${command} …`);

      this.initSocket(() => {
        this.writeCommand(command, args, cb);
      });
    } else if (this.stream) {
      if (args) {
        this.options.logger.debug(`$ ${command} with ${pretty(args)}`);
      } else {
        this.options.logger.debug(`$ ${command}`);
      }

      const commandObj = { command, args };

      /*
       * TODO Revisit sending logs with commands. Large log arrays were rejected.
       * They may help diagnose near-zero frame rates. Consider debug-only use.
       *
       * if (this.options.logger && options.logger.getLines) {
       *   commandObj.logLines = options.logger.getLines()
       * }
       */

      this.writeStream(
        Buffer.from(JSON.stringify(commandObj)),
        cb
          ? {
              onFlushedCallback: () => {
                queueMicrotask(cb);
              },
            }
          : undefined,
      );
    }
  }
}

export default RecorderConnection;
