import websocket from "websocket-stream";

import type { VideomailClientOptions } from "../../../types/options";
import type { RecordingStats } from "../../../types/RecordingStats";
import BoundedWriteQueue from "../../../util/boundedWriteQueue";
import Despot from "../../../util/Despot";
import createError from "../../../util/error/createError";
import VideomailError from "../../../util/error/VideomailError";
import pretty from "../../../util/string/pretty";

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

  protected backpressureTimeout?: number | undefined;

  protected recordingDimensions?: Pick<HTMLCanvasElement, "width" | "height"> | undefined;

  protected stream?: websocket.WebSocketDuplex | undefined;

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
  protected abstract clearReconnectTimeout(): void;
  public abstract reset(): void;

  protected constructor(options: VideomailClientOptions) {
    super("Recorder", options);
  }

  private hasExceededWebSocketSendBuffer(buffer: Buffer, opts?: WriteStreamParams) {
    return buffer.length > 0 && !this.pendingWrites.enqueue(buffer, opts);
  }

  protected writeStream(buffer: Buffer, opts?: WriteStreamParams) {
    if (this.stream) {
      if (this.stream.destroyed) {
        // prevents https://github.com/binarykitchen/videomail.io/issues/393
        this.stopPings();

        const err = createError({
          message: "Already disconnected",
          explanation:
            "Sorry, connection to the server has been destroyed. Please reload.",
          options: this.options,
        });

        this.handleWriteFailure(err);
      } else if (this.streamBackpressured) {
        // Keep extra chunks in our bounded queue, not the writable's buffer.
        if (this.hasExceededWebSocketSendBuffer(buffer, opts)) {
          this.failMediaTransmission(
            createError({
              message: "WebSocket send buffer limit exceeded",
              explanation:
                "The connection to the server is too slow to keep up with this recording. The recording has been stopped; please start a new one.",
              options: this.options,
            }),
          );
        }
      } else {
        this.writeToStream(this.stream, buffer, opts);
      }
    }
  }

  private writeToStream(
    stream: websocket.WebSocketDuplex,
    buffer: Buffer,
    opts?: WriteStreamParams,
  ) {
    const onFlushedCallback = opts?.onFlushedCallback;

    try {
      const canContinue = stream.write(buffer, () => {
        if (!onFlushedCallback) {
          return;
        }

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
      });

      if (!canContinue) {
        // This chunk was accepted; wait for drain before submitting another.
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
      });

      this.handleWriteFailure(err);
      return false;
    }
  }

  private flushPendingWrites(stream: websocket.WebSocketDuplex) {
    if (this.isStaleStream(stream)) {
      return;
    }

    this.streamBackpressured = false;
    this.clearBackpressureTimeout();

    // Preserve media order and stop again if the writable fills during the flush.
    let pendingWrite = this.pendingWrites.dequeue();

    while (pendingWrite) {
      if (!this.writeToStream(stream, pendingWrite.buffer, pendingWrite.params)) {
        return;
      }

      pendingWrite = this.pendingWrites.dequeue();
    }

    this.resumeRecordingAfterDrain();
  }

  private isStaleStream(stream: websocket.WebSocketDuplex) {
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

  private handleWriteFailure(err: VideomailError) {
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

    this.clearReconnectTimeout();
    this.clearBackpressureTimeout();
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
    this.backpressureTimeout = window.setTimeout(() => {
      this.backpressureTimeout = undefined;

      if (this.shouldIgnoreBackpressureTimeout()) {
        return;
      }

      const err = createError({
        message: "WebSocket write timed out",
        explanation:
          "The server stopped accepting recording data. The recording has been stopped; please check your connection and start a new one.",
        options: this.options,
      });

      this.failMediaTransmission(err);
    }, this.options.timeouts.connection);
  }

  private shouldStartBackpressureTimeout() {
    return this.backpressureTimeout === undefined && this.mediaTransmissionStarted;
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
      cause: { unconfirmedFrames, unconfirmedSamples },
    });

    this.failMediaTransmission(err);
  }

  protected handleStreamDrain(stream: websocket.WebSocketDuplex) {
    this.options.logger.debug(`${PIPE_SYMBOL}Stream *drain* event emitted`);
    this.flushPendingWrites(stream);
  }

  private clearBackpressureTimeout() {
    if (this.backpressureTimeout === undefined) {
      return;
    }

    window.clearTimeout(this.backpressureTimeout);
    this.backpressureTimeout = undefined;
  }

  protected discardSocket() {
    this.options.logger.debug(`Recorder: discarding socket stream ...`);

    this.clearBackpressureTimeout();
    this.pendingWrites.clear();
    this.streamBackpressured = false;
    this.resumeAfterDrain = false;

    const stream = this.stream;
    this.stream = undefined;

    if (stream && !stream.destroyed) {
      stream.destroy();
    }
  }
}

export default RecorderStreamWriter;
