import BoundedWriteQueue from "../boundedWriteQueue";

describe("BoundedWriteQueue", () => {
  it("returns queued writes in order and releases their byte budget", () => {
    const queue = new BoundedWriteQueue<string>(5);

    const firstEnqueue = queue.enqueue(Buffer.from("abc"), "first");
    const secondEnqueue = queue.enqueue(Buffer.from("de"), "second");
    const firstDequeue = queue.dequeue();
    const thirdEnqueue = queue.enqueue(Buffer.from("fgh"), "third");
    const secondDequeue = queue.dequeue();
    const thirdDequeue = queue.dequeue();

    expect({
      firstEnqueue,
      firstDequeue,
      secondEnqueue,
      secondDequeue,
      thirdDequeue,
      thirdEnqueue,
    }).toEqual({
      firstEnqueue: true,
      firstDequeue: { buffer: Buffer.from("abc"), params: "first" },
      secondEnqueue: true,
      secondDequeue: { buffer: Buffer.from("de"), params: "second" },
      thirdDequeue: { buffer: Buffer.from("fgh"), params: "third" },
      thirdEnqueue: true,
    });
  });

  it("rejects writes that exceed the byte limit without changing the queue", () => {
    const queue = new BoundedWriteQueue<void>(3);
    const firstBuffer = Buffer.from("abc");

    const firstEnqueue = queue.enqueue(firstBuffer);
    const rejectedEnqueue = queue.enqueue(Buffer.from("d"));
    const dequeued = queue.dequeue();

    expect({ firstEnqueue, rejectedEnqueue, dequeued }).toEqual({
      firstEnqueue: true,
      rejectedEnqueue: false,
      dequeued: { buffer: firstBuffer, params: undefined },
    });
  });

  it("clears queued writes and their byte budget", () => {
    const queue = new BoundedWriteQueue<void>(2);

    queue.enqueue(Buffer.from("ab"));
    queue.clear();

    const enqueueAfterClear = queue.enqueue(Buffer.from("cd"));
    const dequeuedAfterClear = queue.dequeue();

    expect({ enqueueAfterClear, dequeuedAfterClear }).toEqual({
      enqueueAfterClear: true,
      dequeuedAfterClear: { buffer: Buffer.from("cd"), params: undefined },
    });
  });
});
