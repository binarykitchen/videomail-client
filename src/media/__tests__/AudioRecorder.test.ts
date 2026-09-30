/* eslint-disable max-classes-per-file */

import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

import { ScriptTarget, transpileModule } from "typescript";

import mergeWithDefaultOptions from "../../util/options/mergeWithDefaultOptions";
import UserMedia from "../../wrappers/visuals/userMedia";
import AudioRecorder from "../AudioRecorder";

class FakeWorkletNode {
  public static instances: FakeWorkletNode[] = [];
  public readonly connect = vi.fn();
  public readonly disconnect = vi.fn();
  public readonly port = {
    onmessage: null as ((event: MessageEvent<Float32Array>) => void) | null,
    close: vi.fn(),
  };
  public readonly options: AudioWorkletNodeOptions;

  public constructor(
    _context: AudioContext,
    _name: string,
    options: AudioWorkletNodeOptions,
  ) {
    this.options = options;
    FakeWorkletNode.instances.push(this);
  }
}

class FakeAudioContext {
  public static latest: FakeAudioContext;
  public static failMediaSource = false;

  public readonly audioWorklet = { addModule: vi.fn().mockResolvedValue(undefined) };
  public readonly close = vi.fn(() => Promise.resolve());
  public readonly createGain = vi.fn(() => this.gainNode);
  public readonly createMediaStreamSource = vi.fn(() => {
    if (FakeAudioContext.failMediaSource) {
      throw new Error("missing track");
    }

    return this.audioInput;
  });
  public readonly destination = {} as AudioDestinationNode;
  public readonly gainNode = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    gain: { value: 0 },
  };
  public readonly audioInput = {
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
  public readonly sampleRate = 48_000;

  public constructor() {
    FakeAudioContext.latest = this;
  }
}

function createUserMedia(recording = true, paused = false) {
  return {
    isPaused: vi.fn(() => paused),
    isRecording: vi.fn(() => recording),
  } as unknown as UserMedia;
}

function createRecorder(recording = true, paused = false) {
  const options = mergeWithDefaultOptions({
    audio: { bufferSize: 1024, volume: 0.4 },
  });

  return new AudioRecorder(createUserMedia(recording, paused), options);
}

describe("AudioRecorder", () => {
  beforeEach(() => {
    FakeWorkletNode.instances = [];
    FakeAudioContext.failMediaSource = false;
    vi.stubGlobal("AudioContext", FakeAudioContext);
    vi.stubGlobal("AudioWorkletNode", FakeWorkletNode);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads an external mono worklet with the configured buffer size", async () => {
    const recorder = createRecorder();

    await recorder.init({} as MediaStream);

    expect({
      module: FakeAudioContext.latest.audioWorklet.addModule.mock.calls[0]?.[0],
      processor: FakeWorkletNode.instances[0]?.options.processorOptions,
      outputChannels: FakeWorkletNode.instances[0]?.options.outputChannelCount,
    }).toEqual({
      module: expect.stringMatching(/pcm-processor\.worklet\.(js|ts)$/u),
      processor: { bufferSize: 1024 },
      outputChannels: [1],
    });
  });

  it("routes microphone input through the configured gain before processing", async () => {
    const recorder = createRecorder();

    await recorder.init({} as MediaStream);

    expect({
      volume: FakeAudioContext.latest.gainNode.gain.value,
      inputConnections: FakeAudioContext.latest.audioInput.connect.mock.calls,
      gainConnections: FakeAudioContext.latest.gainNode.connect.mock.calls,
    }).toEqual({
      volume: 0.4,
      inputConnections: [[FakeAudioContext.latest.gainNode]],
      gainConnections: [[FakeWorkletNode.instances[0]]],
    });
  });

  it("rejects a buffer size that is not a supported power of two", async () => {
    const options = mergeWithDefaultOptions({ audio: { bufferSize: 1000 } });
    const recorder = new AudioRecorder(createUserMedia(), options);

    await expect(recorder.init({} as MediaStream)).rejects.toThrow(
      "Audio buffer size must be a power of two",
    );
  });

  it.each([-0.1, 1.1, Number.NaN])("rejects invalid volume %s", async (volume) => {
    const options = mergeWithDefaultOptions({ audio: { bufferSize: 1024, volume } });
    const recorder = new AudioRecorder(createUserMedia(), options);

    await expect(recorder.init({} as MediaStream)).rejects.toThrow(
      "Audio volume must be between zero and one.",
    );
  });

  it("reports a stream without audio", async () => {
    const recorder = createRecorder();
    FakeAudioContext.failMediaSource = true;

    await expect(recorder.init({} as MediaStream)).rejects.toThrow("Webcam has no audio");
  });

  it("forwards audio samples while user media is recording", async () => {
    const recorder = createRecorder();
    const callback = vi.fn();
    await recorder.init({} as MediaStream);
    recorder.record(callback);

    FakeWorkletNode.instances[0]?.port.onmessage?.({
      data: new Float32Array([0.25]),
    } as MessageEvent<Float32Array>);

    expect(callback).toHaveBeenCalledOnce();
  });

  it.each([
    [false, false],
    [true, true],
  ])(
    "does not forward samples when recording is %s and paused is %s",
    async (recording, paused) => {
      const recorder = createRecorder(recording, paused);
      const callback = vi.fn();
      await recorder.init({} as MediaStream);
      recorder.record(callback);

      FakeWorkletNode.instances[0]?.port.onmessage?.({
        data: new Float32Array([0.25]),
      } as MessageEvent<Float32Array>);

      expect(callback).not.toHaveBeenCalled();
    },
  );

  it("disconnects all audio nodes and closes the context when stopped", async () => {
    const recorder = createRecorder();
    await recorder.init({} as MediaStream);

    recorder.stop();

    expect({
      input: FakeAudioContext.latest.audioInput.disconnect.mock.calls.length,
      gain: FakeAudioContext.latest.gainNode.disconnect.mock.calls.length,
      worklet: FakeWorkletNode.instances[0]?.disconnect.mock.calls.length,
      context: FakeAudioContext.latest.close.mock.calls.length,
    }).toEqual({ input: 1, gain: 1, worklet: 1, context: 1 });
  });

  it("does not create an audio node when stopped during module loading", async () => {
    const recorder = createRecorder();
    await recorder.init({} as MediaStream);
    let finishLoading: () => void = () => undefined;
    FakeAudioContext.latest.audioWorklet.addModule.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishLoading = resolve;
        }),
    );

    const pending = recorder.init({} as MediaStream);
    recorder.stop();
    finishLoading();
    await pending;

    expect(FakeWorkletNode.instances).toHaveLength(1);
  });

  it("returns the initialized context's sample rate", async () => {
    const recorder = createRecorder();
    await recorder.init({} as MediaStream);

    expect(recorder.getSampleRate()).toBe(48_000);
  });

  it("does not create a context just to read an unavailable sample rate", () => {
    vi.unstubAllGlobals();
    const recorder = createRecorder();

    expect(recorder.getSampleRate()).toBe(-1);
  });

  it("combines worklet render quanta into complete PCM packets", () => {
    const packets: Float32Array[] = [];
    class ProcessorBase {
      public readonly port = {
        postMessage: (samples: Float32Array) => packets.push(samples),
      };
    }
    type ProcessorConstructor = new (options: {
      processorOptions: { bufferSize: number };
    }) => {
      process: (inputs: Float32Array[][]) => boolean;
    };
    let Processor: ProcessorConstructor | undefined;
    const source = readFileSync("src/media/pcm-processor.worklet.ts", "utf8");
    const compiledSource = transpileModule(source, {
      compilerOptions: { target: ScriptTarget.ES2020 },
    }).outputText;

    runInNewContext(compiledSource, {
      AudioWorkletProcessor: ProcessorBase,
      Float32Array,
      Math,
      registerProcessor: (_name: string, constructor: ProcessorConstructor) => {
        Processor = constructor;
      },
    });

    if (!Processor) {
      throw new Error("The PCM worklet was not registered");
    }

    const processor = new Processor({ processorOptions: { bufferSize: 256 } });
    processor.process([[new Float32Array(128).fill(0.25)]]);
    processor.process([[new Float32Array(128).fill(0.5)]]);

    expect(packets).toEqual([
      Float32Array.from([
        ...new Float32Array(128).fill(0.25),
        ...new Float32Array(128).fill(0.5),
      ]),
    ]);
  });
});
