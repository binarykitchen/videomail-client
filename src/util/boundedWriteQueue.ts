// This class wraps a payload and its write metadata together as one FIFO entry.

/*
  This constant defines the default maximum number of bytes that can be queued in the write buffer.

  Provisional client-side ceiling; not protocol-defined or derived from measurements.

  Revisit using observed queue sizes and an explicit per-recorder memory budget.

  (+) Increase the cap only if valid recordings hit it during temporary backpressure, then drain before the 10-second timeout, and the memory budget allows more headroom.

  (-) Decrease it only if measured legitimate peaks stay well below a lower limit and tighter memory bounds matter. If backpressure persists until timeout, a larger cap won’t fix the underlying connection stall; it only delays failure.
*/
const DEFAULT_MAX_QUEUED_BYTES = 1_048_576;

interface PendingWrite<T> {
  buffer: Buffer;
  params: T | undefined;
}

class BoundedWriteQueue<T> {
  private readonly writes: PendingWrite<T>[] = [];
  private queuedBytes = 0;

  // Allow smaller or larger limits where a caller has a specific memory budget.
  constructor(private readonly maxBytes = DEFAULT_MAX_QUEUED_BYTES) {}

  // Add a write if it fits; return false without changing the queue when it does not.
  public enqueue(buffer: Buffer, params?: T) {
    if (this.queuedBytes + buffer.length > this.maxBytes) {
      return false;
    }

    this.writes.push({ buffer, params });
    this.queuedBytes += buffer.length;

    return true;
  }

  // Remove the oldest write and release its bytes from the queue budget.
  public dequeue() {
    const write = this.writes.shift();

    if (write) {
      this.queuedBytes -= write.buffer.length;
    }

    return write;
  }

  // Discard all pending writes and reset the byte count.
  public clear() {
    this.writes.length = 0;
    this.queuedBytes = 0;
  }
}

export default BoundedWriteQueue;
