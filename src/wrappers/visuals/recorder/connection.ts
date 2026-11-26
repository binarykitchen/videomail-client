import { serializeError } from "serialize-error";

import Constants from "../../../constants";
import type { VideomailCommand, VideomailCommandArgs } from "../../../types/command";
import type { VideomailClientOptions } from "../../../types/options";
import type { RecordingStats } from "../../../types/RecordingStats";
import type { DespotEmitter } from "../../../util/Despot";
import createError from "../../../util/error/createError";
import getEventDetails from "../../../util/error/getEventDetails";
import getWebSocketDiagnostic from "../../../util/error/socket/getWebSocketDiagnostic";
import getAutomationSignals from "../../../util/getAutomationSignals";
import isEvent from "../../../util/isEvent";
import isVideomailCommand from "../../../util/isVideomailCommand";
import SocketStream, {
  type SocketCloseDetails,
} from "../../../util/streams/SocketStream";
import pretty from "../../../util/string/pretty";
import summarize from "../../../util/string/summarize";
import Timeout from "../../../util/Timeout";
import RecorderStreamWriter, { PIPE_SYMBOL } from "./streamWriter";

type ConnectionFailureReason = "timeout" | "closed" | "error";
type RecorderOutgoingCommandArgs = VideomailCommandArgs | RecordingStats;

abstract class RecorderConnection extends RecorderStreamWriter {
  protected readonly connectionTimeout = new Timeout(() => {
    this.options.logger.debug("Recorder: connection timeout cleared");
  });

  protected userMediaLoaded?: boolean | undefined;

  protected userMediaLoading = false;

  protected unloaded?: boolean;

  protected connectionFailed = false;

  protected reconnectAttempts = 0;

  protected blocking = false;

  protected connectingStartedAt?: number | undefined;

  protected lastCloseEvent?: SocketCloseDetails | undefined;

  protected lastSocketError?: Record<string, unknown> | undefined;

  protected pingInterval?: number | undefined;

  private connectionOpenedAt?: number | undefined;

  protected abstract executeCommand(command: VideomailCommand): void;
  public abstract isUserMediaLoaded(): boolean | undefined;
  public abstract validate(): boolean;

  protected constructor(options: VideomailClientOptions, emitter?: DespotEmitter) {
    super(options, emitter);
  }

  private canReconnectAfterStreamClose() {
    // Lazy-camera apps still need to recover an established, unused connection.
    return this.connected || this.reconnecting;
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
      const stream = this.stream;
      window.setTimeout(() => {
        if (this.stream === stream) {
          this.handleConnectionFailure({ url2Connect, cause: "closed" });
        }
      }, 0);
    }
  }

  private shouldIgnoreStreamClose() {
    return (
      this.recordingTransportFailed ||
      Boolean(this.unloaded) ||
      this.validate() ||
      (this.blocking && !this.mediaTransmissionStarted)
    );
  }

  protected closeIdleConnection(reason: string) {
    if (this.mediaTransmissionStarted) {
      return;
    }

    // Clear ownership before destroy(): late events must not replace the primary error.
    this.options.logger.debug(
      summarize("Recorder: closing idle connection", {
        reason,
        connected: this.connected,
        connecting: this.connecting,
        visibilityState: document.visibilityState,
      }),
    );
    this.connected = this.connecting = this.reconnecting = false;
    this.connectionTimeout.clear();
    this.reconnectTimeout.clear();
    this.stopPings();
    this.discardSocket();
  }

  public suspendConnection() {
    // Mobile operating systems suspend WebSockets; an unused session can be replaced.
    this.closeIdleConnection("background");
  }

  public recoverConnection() {
    if (!this.canRecoverConnection()) {
      return;
    }

    // Reconnect transport only: camera permission still requires the user's choice.
    this.reconnecting = true;
    this.reconnectAttempts = 0;
    this.initSocket();
  }

  private canRecoverConnection() {
    return (
      this.canReplaceTransport() &&
      !this.validate() &&
      this.isConnectionIdle() &&
      this.isOnline()
    );
  }

  private canReplaceTransport() {
    return !this.mediaTransmissionStarted && !this.unloaded && !this.blocking;
  }

  private isConnectionIdle() {
    return !this.connected && !this.connecting;
  }

  // Only the first open counts. A closing socket or an unloaded recorder can't connect.
  private canAcceptOpenedSocket(socket: Pick<WebSocket, "readyState">) {
    return !this.connected && socket.readyState !== WebSocket.CLOSING && !this.unloaded;
  }

  private handleStreamError(url2Connect: string, err: unknown) {
    if (isEvent(err)) {
      this.lastSocketError = getEventDetails(err);
    } else {
      this.lastSocketError = serializeError(err);
    }

    const debugLine = summarize(`${PIPE_SYMBOL}Stream *error* event emitted:`, {
      error: serializeError(err),
    });

    this.options.logger.debug(debugLine);

    if (this.shouldIgnoreStreamClose()) {
      this.connected = false;
      this.stopPings();
      this.discardSocket();
      return;
    }

    if (this.mediaTransmissionStarted) {
      this.failInterruptedRecording();
      return;
    }

    // An idle transport error follows the same recovery path as an idle close.
    this.reconnecting ||= this.canReconnectAfterStreamClose();
    this.connected = false;
    this.stopPings();
    this.handleConnectionFailure({ url2Connect, cause: "error" });
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

    if (this.reconnectTimeout.isPending()) {
      return true;
    }

    // Back off between retries: 1s, 2s, 4s, up to 10s.
    const delayMs = Math.min(1000 * 2 ** this.reconnectAttempts, 10000);
    this.reconnectAttempts++;
    this.connecting = false;

    this.connectionTimeout.clear();
    this.discardSocket();

    this.options.logger.debug(
      `Recorder: retrying WebSocket connection in ${delayMs}ms (cause ${params.cause}).`,
    );

    this.reconnectTimeout.start(() => {
      if (this.shouldContinueReconnect()) {
        this.initSocket();
      }
    }, delayMs);

    return true;
  }

  private canRetryConnection() {
    return this.reconnecting && this.isOnline() && !this.unloaded && !this.blocking;
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
    const reconnectAttempts = this.reconnectAttempts;
    this.reconnectAttempts = 0;

    this.reconnectTimeout.clear();
    this.connectionTimeout.clear();

    const { url2Connect, cause } = params;

    const online = this.isOnline();
    const elapsedMs = this.connectingStartedAt
      ? Date.now() - this.connectingStartedAt
      : undefined;
    const closeEvent = this.lastCloseEvent;
    const socketError = this.lastSocketError;

    const contents = {
      cause,
      transportPhase: this.connectionOpenedAt === undefined ? "initial" : "idle",
      mediaTransmissionStarted: this.mediaTransmissionStarted,
      recordingActive: this.recordingActive,
      framesCount: this.framesCount,
      samplesCount: this.samplesCount,
      reconnectAttempts,
      connectionOpenedAt: this.connectionOpenedAt,
      automation: getAutomationSignals(),
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
      // Counters and buffer state of the failed socket, if it got that far.
      socket: this.getSocketDiagnostics(),
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
      this.connectionFailed ||
      this.connected ||
      Boolean(this.unloaded) ||
      this.validate() ||
      (this.blocking && !this.mediaTransmissionStarted)
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

    this.reconnectTimeout.clear();

    // Skip known crawlers to avoid connection reports from non-recording clients.
    const automation = getAutomationSignals();
    if (automation.userAgentMatched) {
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

    try {
      nativeSocket = new WebSocket(url2Connect);
    } catch (exc) {
      this.connecting = this.connected = false;

      const diagnostic = getWebSocketDiagnostic(url2Connect);
      const connectionPhase = this.connectionOpenedAt === undefined ? "initial" : "idle";

      // Useful for temporary full technical diagnostic regardless of cause
      // this.options.logger.debug(`Recorder: WebSocket diagnostic: ${diagnostic.text}`);

      /*
       * Use a clearly distinct message for crawler/bot failures so the
       * server can filter these from email alerts while still logging them.
       * Failed probes alone do not establish that the visitor is automated.
       */

      let message: string;

      if (diagnostic.looksAutomated) {
        message = "Automated crawler: WebSocket not supported in this environment";
      } else {
        /*
          `Failed to construct WebSocket` means construction threw before a usable socket existed, unlike a later handshake or stream failure.
        */
        message = `Failed to construct WebSocket to ${url2Connect}`;
      }

      const explanation = diagnostic.looksAutomated
        ? "Headless crawlers cannot use Videomail's WebSocket. No action needed."
        : `Please check your connection and try again. If the problem persists, contact us. Diagnostic: ${diagnostic.text}`;

      const err = createError({
        message,
        explanation,
        options: this.options,
        exc,
        // Keep constructor failures distinct from handshake and stream failures.
        cause: {
          automation,
          transportStage: "constructor",
          transportPhase: this.mediaTransmissionStarted ? "recording" : connectionPhase,
          mediaTransmissionStarted: this.mediaTransmissionStarted,
          webSocketDiagnostic: diagnostic.details,
        },
      });

      this.emit("ERROR", { err });

      // No need to continue further
      return;
    }

    // Handlers check against this stream, so a replaced one's late events are ignored.
    const stream = new SocketStream(nativeSocket);
    this.stream = stream;

    this.startConnectionTimeout(url2Connect);
    this.listenToStream(stream, url2Connect, cb);
  }

  private startConnectionTimeout(url2Connect: string) {
    this.connectionTimeout.start(() => {
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
    }, this.options.timeouts.connection);
  }

  private listenToStream(stream: SocketStream, url2Connect: string, cb?: () => void) {
    stream.on("close", (closeDetails) => {
      if (this.stream === stream) {
        // Keep the native details for reports. Code 1006, for example, means it dropped.
        this.lastCloseEvent = closeDetails;
        this.handleStreamClose(url2Connect);
      }
    });

    stream.on("connect", () => {
      if (this.stream === stream) {
        this.handleStreamConnect(stream, cb);
      }
    });

    stream.on("data", (text) => {
      if (this.stream === stream) {
        this.handleStreamData(text);
      }
    });

    // Browsers close a socket right after an error, so its close details come along.
    stream.on("error", (event, closeDetails) => {
      if (this.stream === stream) {
        this.lastCloseEvent = closeDetails;
        this.handleStreamError(url2Connect, event);
      }
    });

    stream.on("drain", () => {
      if (this.stream === stream) {
        this.handleStreamDrain(stream);
      }
    });
  }

  private handleStreamConnect(stream: SocketStream, cb?: () => void) {
    this.options.logger.debug(`${PIPE_SYMBOL}Stream *connect* event emitted`);

    this.connectionTimeout.clear();

    if (this.canAcceptOpenedSocket(stream.socket)) {
      this.connected = true;
      this.connectionOpenedAt = Date.now();
      this.connecting = this.unloaded = false;
      this.reconnecting = false;
      this.reconnectAttempts = 0;
      this.reconnectTimeout.clear();

      this.emit("CONNECTED");

      cb?.();
    }
  }

  private handleStreamData(text: string) {
    // No log line: a confirmation arrives for every frame, and
    // executeCommand() already logs everything else.
    try {
      const command: unknown = JSON.parse(text);

      if (!isVideomailCommand(command)) {
        throw new TypeError("The server message has no command name.");
      }

      this.executeCommand(command);
    } catch (exc) {
      this.options.logger.error(`Failed to parse command: ${exc}`);

      const err = createError({
        message: "Invalid server command",
        // Show the raw text, see https://github.com/binarykitchen/videomail.io/issues/288
        explanation: `Contact us. The invalid command was: ${text}.`,
        options: this.options,
        exc,
      });

      this.emit("ERROR", { err });
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
