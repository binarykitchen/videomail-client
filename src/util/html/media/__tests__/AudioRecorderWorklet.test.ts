import { runInNewContext } from "node:vm";

import registerAudioRecorderProcessor, {
  AUDIO_RECORDER_PROCESSOR_NAME,
  type AudioRecorderProcessor,
} from "../AudioRecorderWorklet";

interface FakeMessagePort {
  onmessage: ((event: MessageEvent<unknown>) => void) | null;
  readonly postMessage: ReturnType<
    typeof vi.fn<(message: unknown, transfer: Transferable[]) => void>
  >;
}

class FakeProcessor {
  public static latest: FakeProcessor;
  public readonly port: FakeMessagePort = {
    onmessage: null,
    postMessage: vi.fn<(message: unknown, transfer: Transferable[]) => void>(),
  };

  public constructor() {
    FakeProcessor.latest = this;
  }
}

function createWorklet(bufferSize = 256) {
  let processor: AudioRecorderProcessor | undefined;
  const register = vi.fn<Parameters<typeof registerAudioRecorderProcessor>[2]>();
  register.mockImplementation((_name, Constructor) => {
    processor = new Constructor({ processorOptions: { bufferSize } });
  });

  registerAudioRecorderProcessor(AUDIO_RECORDER_PROCESSOR_NAME, FakeProcessor, register);

  if (!processor) {
    throw new Error("Audio processor was not registered.");
  }

  const { port } = FakeProcessor.latest;

  return { processor, port, register };
}

function setRecording(port: FakeMessagePort, recordingId: unknown) {
  port.onmessage?.(new MessageEvent("message", { data: recordingId }));
}

describe("AudioRecorderWorklet", () => {
  it("registers the named processor", () => {
    const { register } = createWorklet();

    expect(register).toHaveBeenCalledWith(
      AUDIO_RECORDER_PROCESSOR_NAME,
      expect.any(Function),
    );
  });

  it("registers from its serialized source without an enclosing module scope", () => {
    const register = vi.fn<Parameters<typeof registerAudioRecorderProcessor>[2]>();

    runInNewContext(
      `(${registerAudioRecorderProcessor.toString()})("isolated-recorder", Processor, register);`,
      { Processor: FakeProcessor, register },
      { timeout: 1000 },
    );

    expect(register).toHaveBeenCalledWith("isolated-recorder", expect.any(Function));
  });

  it("does not capture microphone pre-roll", () => {
    const { processor, port } = createWorklet();

    processor.process([[new Float32Array(256).fill(0.5)]], []);

    expect(port.postMessage).not.toHaveBeenCalled();
  });

  it("batches successive render blocks without changing PCM samples", () => {
    const { processor, port } = createWorklet();
    const samples = Float32Array.from({ length: 256 }, (_value, index) => index / 256);
    setRecording(port, 1);

    processor.process([[samples.subarray(0, 128)]], []);
    processor.process([[samples.subarray(128)]], []);

    expect(port.postMessage).toHaveBeenCalledExactlyOnceWith(
      { recordingId: 1, samples },
      [expect.any(ArrayBuffer)],
    );
  });

  it("waits for a complete batch", () => {
    const { processor, port } = createWorklet();
    setRecording(port, 1);

    processor.process([[new Float32Array(128)]], []);

    expect(port.postMessage).not.toHaveBeenCalled();
  });

  it("handles render blocks that do not divide the batch size", () => {
    const { processor, port } = createWorklet();
    const samples = Float32Array.from({ length: 512 }, (_value, index) => index / 512);
    setRecording(port, 1);

    processor.process([[samples.subarray(0, 192)]], []);
    processor.process([[samples.subarray(192, 384)]], []);
    processor.process([[samples.subarray(384)]], []);

    expect(port.postMessage.mock.calls.map(([message]) => message)).toEqual([
      { recordingId: 1, samples: samples.slice(0, 256) },
      { recordingId: 1, samples: samples.slice(256) },
    ]);
  });

  it("emits multiple batches from a large render block", () => {
    const { processor, port } = createWorklet();
    const samples = new Float32Array(768).fill(-0.25);
    setRecording(port, 3);

    processor.process([[samples]], []);

    expect(port.postMessage.mock.calls.map(([message]) => message)).toEqual([
      { recordingId: 3, samples: samples.slice(0, 256) },
      { recordingId: 3, samples: samples.slice(256, 512) },
      { recordingId: 3, samples: samples.slice(512) },
    ]);
  });

  it("does not discard silent input", () => {
    const { processor, port } = createWorklet();
    setRecording(port, 1);

    processor.process([[new Float32Array(256)]], []);

    expect(port.postMessage).toHaveBeenCalledWith(
      { recordingId: 1, samples: new Float32Array(256) },
      [expect.any(ArrayBuffer)],
    );
  });

  it("keeps microphone monitoring silent", () => {
    const { processor, port } = createWorklet();
    const output = new Float32Array(128);
    setRecording(port, 1);

    processor.process([[new Float32Array(128).fill(0.5)]], [[output]]);

    expect(output).toEqual(new Float32Array(128));
  });

  it("does not modify the browser's input buffer", () => {
    const { processor, port } = createWorklet();
    const samples = new Float32Array(256).fill(0.25);
    setRecording(port, 1);

    processor.process([[samples]], []);

    expect(samples).toEqual(new Float32Array(256).fill(0.25));
  });

  it("keeps running when a microphone temporarily has no input", () => {
    const { processor, port } = createWorklet();
    setRecording(port, 1);

    expect(processor.process([], [])).toBe(true);
  });

  it("discards partial pre-pause samples before a new recording segment", () => {
    const { processor, port } = createWorklet();
    setRecording(port, 1);
    processor.process([[new Float32Array(128).fill(0.25)]], []);
    setRecording(port, 0);
    processor.process([[new Float32Array(256).fill(0.5)]], []);
    setRecording(port, 2);

    processor.process([[new Float32Array(256).fill(-0.25)]], []);

    expect(port.postMessage).toHaveBeenCalledExactlyOnceWith(
      { recordingId: 2, samples: new Float32Array(256).fill(-0.25) },
      [expect.any(ArrayBuffer)],
    );
  });

  it.each([undefined, null, "1", {}, 1.5, Number.NaN, Number.POSITIVE_INFINITY, -2])(
    "ignores invalid recording control %s",
    (recordingId) => {
      const { processor, port } = createWorklet();
      setRecording(port, recordingId);

      processor.process([[new Float32Array(256)]], []);

      expect(port.postMessage).not.toHaveBeenCalled();
    },
  );

  it("terminates processing after teardown", () => {
    const { processor, port } = createWorklet();
    setRecording(port, -1);

    expect(processor.process([], [])).toBe(false);
  });

  it("transfers each completed buffer and allocates an undetached replacement", () => {
    const { processor, port } = createWorklet();
    const received: unknown[] = [];
    port.postMessage.mockImplementation((message, transfer) => {
      received.push(structuredClone(message, { transfer }));
    });
    setRecording(port, 1);

    processor.process([[new Float32Array(512).fill(0.5)]], []);

    expect(received).toEqual(
      structuredClone([
        { recordingId: 1, samples: new Float32Array(256).fill(0.5) },
        { recordingId: 1, samples: new Float32Array(256).fill(0.5) },
      ]),
    );
  });
});
