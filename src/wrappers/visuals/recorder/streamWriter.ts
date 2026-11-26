import type { VideomailClientOptions } from "../../../types/options";
import type { RecordingStats } from "../../../types/RecordingStats";
import type { DespotEmitter } from "../../../util/Despot";
import Despot from "../../../util/Despot";
import createError from "../../../util/error/createError";
import type VideomailError from "../../../util/error/VideomailError";
import getAutomationSignals from "../../../util/getAutomationSignals";
import BoundedWriteQueue from "../../../util/streams/BoundedWriteQueue";
import type SocketStream from "../../../util/streams/SocketStream";
import pretty from "../../../util/string/pretty";
import Timeout from "../../../util/Timeout";

export const PIPE_SYMBOL = "°º¤ø,¸¸,ø¤º°`°º¤ø,¸,ø¤°º¤ø,¸¸,ø¤º°`°º¤ø,¸ ";

export interface WriteStreamParams {
  frameNumber?: number;
  onFlushedCallback?: (params: WriteStreamParams) => void;
}

abstract class RecorderStreamWriter extends Despot {
  protected readonly pendingWrites = new BoundedWriteQueue<WriteStreamParams>();

  protected samplesCount = 0;

  protected framesCount = 0;

  protected recordingStats?: RecordingStats;

  protected confirmedFrameNumber = 0;

  protected confirmedSampleNumber = 0;

  protected readonly backpressureTimeout = new Timeout();

  // Lives here, so a failed take can cancel a pending reconnect, too.
  protected readonly reconnectTimeout = new Timeout(() => {
    this.options.logger.debug("Recorder: reconnect timeout cleared");
  });

  protected recordingDimensions?: Pick<HTMLCanvasElement, "width" | "height"> | undefined;

  protected stream?: SocketStream | undefined;

  protected streamBackpressured = false;

  protected resumeAfterDrain = false;

  // Once media starts, a replacement socket cannot safely resume this take.
  protected mediaTransmissionStarted = false;

  protected recordingActive = false;

  protected recordingTransportFailed = false;

  protected connecting = false;

  protected connected = false;

  protected reconnecting = false;

  protected abstract isUserMediaPaused(): boolean;
  protected abstract isCaptureLoopRunning(): boolean;
  protected abstract stopCaptureLoop(): void;
  protected abstract startCaptureLoop(): void;
  protected abstract stopPings(): void;
  public abstract reset(): void;

  protected constructor(options: VideomailClientOptions, emitter?: DespotEmitter) {
    super("Recorder", options, emitter);
  }

  private hasExceededWebSocketSendBuffer(buffer: Uint8Array, opts?: WriteStreamParams) {
    return buffer.length > 0 && !this.pendingWrites.enqueue(buffer, opts);
  }

  // What the socket can tell about itself, so error reports show how far it got.
  protected getSocketDiagnostics() {
    return this.stream?.getDiagnostics();
  }

  protected writeStream(buffer: Uint8Array, opts?: WriteStreamParams) {
    if (this.stream) {
      if (this.stream.destroyed) {
        // prevents https://github.com/binarykitchen/videomail.io/issues/393
        this.stopPings();

        const err = createError({
          message: "Already disconnected",
          explanation:
            "Sorry, connection to the server has been destroyed. Please reload.",
          options: this.options,
          cause: { socket: this.getSocketDiagnostics() },
        });

        this.handleTransportFailure(err);
      } else if (this.streamBackpressured) {
        // Keep extra chunks in our bounded queue, not the socket's buffer.
        if (this.hasExceededWebSocketSendBuffer(buffer, opts)) {
          this.failMediaTransmission(
            createError({
              message: "WebSocket send buffer limit exceeded",
              explanation:
                "The connection to the server is too slow to keep up with this recording. The recording has been stopped; please start a new one.",
              options: this.options,
              cause: { socket: this.getSocketDiagnostics() },
            }),
          );
        }
      } else {
        this.writeToStream(this.stream, buffer, opts);
      }
    }
  }

  // Most chunks need no confirmation, so they skip the extra microtask.
  private getFlushedCallback(opts?: WriteStreamParams) {
    const onFlushedCallback = opts?.onFlushedCallback;

    if (!opts || !onFlushedCallback) {
      return undefined;
    }

    return () => {
      try {
        onFlushedCallback(opts);
      } catch (exc) {
        const err = createError({
          message: "Failed to write stream buffer",
          explanation: `stream.write() failed because of ${pretty(exc)}`,
          options: this.options,
          exc,
        });

        this.emit("ERROR", { err });
      }
    };
  }

  private writeToStream(
    stream: SocketStream,
    buffer: Uint8Array,
    opts?: WriteStreamParams,
  ) {
    try {
      const canContinue = stream.write(buffer, this.getFlushedCallback(opts));

      if (!canContinue) {
        // The socket took this chunk but is behind. Wait for drain before sending more.
        this.streamBackpressured = true;
        this.startBackpressureTimeout();
        this.pauseForBackpressure();
        return false;
      }

      return true;
    } catch (exc) {
      const err = createError({
        message: "Failed writing to server",
        explanation: `stream.write() failed because of ${pretty(exc)}`,
        options: this.options,
        exc,
        cause: { socket: this.getSocketDiagnostics() },
      });

      this.handleTransportFailure(err);
      return false;
    }
  }

  private flushPendingWrites(stream: SocketStream) {
    if (this.isStaleStream(stream)) {
      return;
    }

    this.streamBackpressured = false;
    this.backpressureTimeout.clear();

    // Preserve media order and stop again if the socket falls behind during the flush.
    let pendingWrite = this.pendingWrites.dequeue();

    while (pendingWrite) {
      if (!this.writeToStream(stream, pendingWrite.buffer, pendingWrite.params)) {
        return;
      }

      pendingWrite = this.pendingWrites.dequeue();
    }

    this.resumeRecordingAfterDrain();
  }

  private isStaleStream(stream: SocketStream) {
    return this.stream !== stream || stream.destroyed;
  }

  private canPauseForBackpressure() {
    return (
      this.recordingActive && !this.isUserMediaPaused() && this.isCaptureLoopRunning()
    );
  }

  private pauseForBackpressure() {
    if (!this.canPauseForBackpressure()) {
      return;
    }

    // Stop producing frames until the outgoing stream can accept more data.
    this.resumeAfterDrain = true;
    this.stopCaptureLoop();
  }

  private resumeRecordingAfterDrain() {
    if (!this.resumeAfterDrain) {
      return;
    }

    this.resumeAfterDrain = false;

    if (this.canResumeAfterDrain()) {
      this.startCaptureLoop();
    }
  }

  private canResumeAfterDrain() {
    return this.recordingActive && !this.isUserMediaPaused();
  }

  // Once media flows, any transport failure ends the take. Before that, it's just reported.
  protected handleTransportFailure(err: VideomailError) {
    if (this.mediaTransmissionStarted) {
      this.failMediaTransmission(err);
      return;
    }

    this.emit("ERROR", { err });
  }

  private failMediaTransmission(err: VideomailError) {
    if (this.recordingTransportFailed) {
      return;
    }

    // Without a server replay protocol, a partial take cannot be recovered.
    this.recordingTransportFailed = true;
    this.recordingActive = false;
    this.mediaTransmissionStarted = false;
    this.streamBackpressured = false;
    this.resumeAfterDrain = false;
    this.pendingWrites.clear();
    this.connected = false;
    this.connecting = false;
    this.reconnecting = false;

    this.reconnectTimeout.clear();
    this.backpressureTimeout.clear();
    this.discardSocket();
    this.reset();

    this.framesCount = this.samplesCount = 0;
    this.confirmedFrameNumber = this.confirmedSampleNumber = 0;
    delete this.recordingStats;
    this.recordingDimensions = undefined;

    this.emit("ERROR", { err });
  }

  private startBackpressureTimeout() {
    if (!this.shouldStartBackpressureTimeout()) {
      return;
    }

    // A stalled socket may never drain, so bound how long the take can wait.
    this.backpressureTimeout.start(() => {
      if (this.shouldIgnoreBackpressureTimeout()) {
        return;
      }

      const err = createError({
        message: "WebSocket write timed out",
        explanation:
          "The server stopped accepting recording data. The recording has been stopped; please check your connection and start a new one.",
        options: this.options,
        cause: { socket: this.getSocketDiagnostics() },
      });

      this.failMediaTransmission(err);
    }, this.options.timeouts.connection);
  }

  // Keep the first deadline, so further full writes can't keep pushing it back.
  private shouldStartBackpressureTimeout() {
    return !this.backpressureTimeout.isPending() && this.mediaTransmissionStarted;
  }

  private shouldIgnoreBackpressureTimeout() {
    return !this.streamBackpressured || this.recordingTransportFailed;
  }

  protected failInterruptedRecording() {
    // Progress confirmations do not tell us how to replay missing media safely.
    const unconfirmedFrames = Math.max(0, this.framesCount - this.confirmedFrameNumber);
    const unconfirmedSamples = Math.max(
      0,
      this.samplesCount - this.confirmedSampleNumber,
    );
    const err = createError({
      message: "Recording interrupted",
      explanation:
        "The server connection closed before this recording completed. It cannot be safely resumed, so it has been stopped. Please start a new recording.",
      options: this.options,
      cause: {
        transportPhase: "recording",
        mediaTransmissionStarted: true,
        // False after Stop, while the take waited for the server's preview.
        recordingActive: this.recordingActive,
        automation: getAutomationSignals(),
        framesCount: this.framesCount,
        samplesCount: this.samplesCount,
        unconfirmedFrames,
        unconfirmedSamples,
        // Holds the close code and reason, e.g. 1006 when the network dropped.
        socket: this.getSocketDiagnostics(),
      },
    });

    this.failMediaTransmission(err);
  }

  protected handleStreamDrain(stream: SocketStream) {
    this.options.logger.debug(`${PIPE_SYMBOL}Stream *drain* event emitted`);
    this.flushPendingWrites(stream);
  }

  protected discardSocket() {
    this.options.logger.debug(`Recorder: discarding socket stream ...`);

    this.backpressureTimeout.clear();
    this.pendingWrites.clear();
    this.streamBackpressured = false;
    this.resumeAfterDrain = false;

    const stream = this.stream;
    this.stream = undefined;

    // Even after an error, the socket may still be open and keep its listeners.
    stream?.destroy();
  }
}

export default RecorderStreamWriter;
