/*
  A provisional memory cap, not a protocol limit or a measured target.
  Tune it using real queue sizes and a per-recorder memory budget:
  - Raise it only if valid takes hit the cap, drain within 10 seconds, and memory allows.
  - Lower it only if measured peaks leave room and tighter bounds help.
  A bigger queue won't fix a stalled connection. It just delays the failure.
*/
const DEFAULT_MAX_QUEUED_BYTES = 1_048_576;

interface PendingWrite<T> {
  buffer: Buffer;
  params: T | undefined;
}

class BoundedWriteQueue<T> {
  private readonly writes: PendingWrite<T>[] = [];
  private queuedBytes = 0;

  // Callers can choose a cap that fits their memory budget.
  constructor(private readonly maxBytes = DEFAULT_MAX_QUEUED_BYTES) {}

  // Reject writes that exceed the cap without changing the queue.
  public enqueue(buffer: Buffer, params?: T) {
    if (this.queuedBytes + buffer.length > this.maxBytes) {
      return false;
    }

    this.writes.push({ buffer, params });
    this.queuedBytes += buffer.length;

    return true;
  }

  public dequeue() {
    const write = this.writes.shift();

    if (write) {
      this.queuedBytes -= write.buffer.length;
    }

    return write;
  }

  public clear() {
    this.writes.length = 0;
    this.queuedBytes = 0;
  }
}

export default BoundedWriteQueue;
