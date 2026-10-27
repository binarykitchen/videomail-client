import AudioSample from "audio-sample";
import type { Mock } from "vitest";

import mergeWithDefaultOptions from "../../../options/mergeWithDefaultOptions";
import AudioRecorder from "../AudioRecorder";
import { AUDIO_RECORDER_PROCESSOR_NAME } from "../AudioRecorderWorklet";

interface FakeAudioWorkletNode {
  readonly connect: Mock<(destination: AudioNode) => void>;
  readonly disconnect: Mock<() => void>;
  onprocessorerror: (() => void) | null;
  readonly port: {
    onmessage: ((event: MessageEvent<unknown>) => void) | null;
    readonly postMessage: Mock<(recordingId: number) => void>;
    readonly close: Mock<() => void>;
  };
}

const STREAM = {} as MediaStream;
const WORKLETS: FakeAudioWorkletNode[] = [];

function createWorkletNode(..._args: ConstructorParameters<typeof AudioWorkletNode>) {
  const worklet: FakeAudioWorkletNode = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    onprocessorerror: null,
    port: {
      onmessage: null,
      postMessage: vi.fn(),
      close: vi.fn(),
    },
  };
  WORKLETS.push(worklet);

  return worklet;
}

const CREATE_WORKLET = vi.fn(createWorkletNode);
const CREATE_MODULE_URL = vi.fn<(module: Blob) => string>();
const REVOKE_MODULE_URL = vi.fn<(url: string) => void>();

class FakeAudioContext {
  public static latest: FakeAudioContext;
  public static instances: FakeAudioContext[] = [];

  public readonly close = vi.fn(() => Promise.resolve());
  public state: AudioContextState = "running";
  public readonly resume = vi.fn(() => {
    this.state = "running";
    return Promise.resolve();
  });
  public readonly createGain = vi.fn(() => this.gainNode);
  public readonly createMediaStreamSource = vi.fn(() => this.audioInput);
  public readonly destination = {} as AudioDestinationNode;
  public readonly audioWorklet = {
    addModule: vi.fn<(url: string) => Promise<void>>(() => Promise.resolve()),
  };
  public readonly gainNode = {
    connect: vi.fn<(destination: AudioNode) => void>(),
    disconnect: vi.fn<() => void>(),
    gain: { value: 0 },
  };
  public readonly audioInput = {
    connect: vi.fn<(destination: AudioNode) => void>(),
    disconnect: vi.fn<() => void>(),
  };
  public readonly sampleRate = 48_000;

  public constructor() {
    FakeAudioContext.latest = this;
    FakeAudioContext.instances.push(this);
  }
}

function createUserMedia(recording = true, paused = false) {
  return {
    isPaused: vi.fn(() => paused),
    isRecording: vi.fn(() => recording),
  };
}

function createRecorder(recording = true, paused = false) {
  const options = mergeWithDefaultOptions({
    audio: { bufferSize: 1024, volume: 0.4 },
  });

  return new AudioRecorder(createUserMedia(recording, paused), options);
}

function getWorklet(index = 0) {
  const worklet = WORKLETS[index];

  if (!worklet) {
    throw new Error("Audio worklet was not created.");
  }

  return worklet;
}

function createAudioEvent(recordingId = 1, samples = new Float32Array([0.25])) {
  return new MessageEvent<unknown>("message", { data: { recordingId, samples } });
}

describe("AudioRecorder", () => {
  beforeEach(() => {
    FakeAudioContext.instances = [];
    WORKLETS.length = 0;
    CREATE_WORKLET.mockReset().mockImplementation(createWorkletNode);
    CREATE_MODULE_URL.mockReset().mockReturnValue("blob:videomail-audio");
    REVOKE_MODULE_URL.mockClear();
    vi.stubGlobal("AudioContext", FakeAudioContext);
    vi.stubGlobal("AudioWorkletNode", CREATE_WORKLET);
    vi.stubGlobal("URL", {
      createObjectURL: CREATE_MODULE_URL,
      revokeObjectURL: REVOKE_MODULE_URL,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("creates an explicitly mono worklet with the configured batch size", async () => {
    const recorder = createRecorder();

    await recorder.init(STREAM);

    expect(CREATE_WORKLET).toHaveBeenCalledWith(
      FakeAudioContext.latest,
      AUDIO_RECORDER_PROCESSOR_NAME,
      {
        channelCount: 1,
        channelCountMode: "explicit",
        outputChannelCount: [1],
        processorOptions: { bufferSize: 1024 },
      },
    );
  });

  it.each([0, 0.2, 0.4, 1])("sets the configured input gain to %s", async (volume) => {
    const options = mergeWithDefaultOptions({
      audio: { bufferSize: 1024, volume },
    });
    const recorder = new AudioRecorder(createUserMedia(), options);

    await recorder.init(STREAM);

    expect(FakeAudioContext.latest.gainNode.gain.value).toBe(volume);
  });

  it("uses unity input gain by default", async () => {
    const options = mergeWithDefaultOptions({ audio: { bufferSize: 1024 } });
    const recorder = new AudioRecorder(createUserMedia(), options);

    await recorder.init(STREAM);

    expect(FakeAudioContext.latest.gainNode.gain.value).toBe(1);
  });

  it("connects the microphone only to the input gain", async () => {
    const recorder = createRecorder();
    await recorder.init(STREAM);
    const { audioInput, gainNode } = FakeAudioContext.latest;

    expect(audioInput.connect.mock.calls).toEqual([[gainNode]]);
  });

  it("connects the input gain only to the worklet", async () => {
    const recorder = createRecorder();
    await recorder.init(STREAM);
    const { gainNode } = FakeAudioContext.latest;

    expect(gainNode.connect.mock.calls).toEqual([[getWorklet()]]);
  });

  it("connects the silent worklet output to the destination", async () => {
    const recorder = createRecorder();
    await recorder.init(STREAM);

    expect(getWorklet().connect.mock.calls).toEqual([
      [FakeAudioContext.latest.destination],
    ]);
  });

  it("uses 2048 PCM frames per batch in automatic mode", async () => {
    const recorder = new AudioRecorder(createUserMedia(), mergeWithDefaultOptions());

    await recorder.init(STREAM);

    expect(CREATE_WORKLET.mock.calls[0]?.[2]?.processorOptions).toEqual({
      bufferSize: 2048,
    });
  });

  it.each([256, 512, 1024, 2048, 4096, 8192, 16_384])(
    "accepts the supported batch size %s",
    async (bufferSize) => {
      const options = mergeWithDefaultOptions({ audio: { bufferSize } });
      const recorder = new AudioRecorder(createUserMedia(), options);

      await recorder.init(STREAM);

      expect(CREATE_WORKLET.mock.calls[0]?.[2]?.processorOptions).toEqual({
        bufferSize,
      });
    },
  );

  it.each([0, -256, 128, 1000, 1024.5, 32_768, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects the invalid batch size %s",
    async (bufferSize) => {
      const options = mergeWithDefaultOptions({ audio: { bufferSize } });
      const recorder = new AudioRecorder(createUserMedia(), options);

      await expect(recorder.init(STREAM)).rejects.toThrow(
        "Audio buffer size must be a power of two between 256 and 16384.",
      );
    },
  );

  it("rejects a missing batch size", async () => {
    const options = mergeWithDefaultOptions();
    delete options.audio.bufferSize;
    const recorder = new AudioRecorder(createUserMedia(), options);

    await expect(recorder.init(STREAM)).rejects.toThrow("Audio buffer size is required.");
  });

  it.each([-0.1, 1.1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects the invalid volume %s",
    async (volume) => {
      const options = mergeWithDefaultOptions({
        audio: { bufferSize: 1024, volume },
      });
      const recorder = new AudioRecorder(createUserMedia(), options);

      await expect(recorder.init(STREAM)).rejects.toThrow(
        "Audio volume must be between zero and one.",
      );
    },
  );

  it("reports a stream without audio", async () => {
    const recorder = createRecorder();
    recorder.getSampleRate();
    FakeAudioContext.latest.createMediaStreamSource.mockImplementationOnce(() => {
      throw new Error("missing track");
    });

    await expect(recorder.init(STREAM)).rejects.toThrow("Webcam has no audio");
  });

  it("forwards the unchanged PCM payload while user media is recording", async () => {
    const recorder = createRecorder();
    const callback = vi.fn<(sample: AudioSample) => void>();
    const samples = new Float32Array([-1, -0.5, 0, 0.25, 1]);
    await recorder.init(STREAM);
    recorder.record(callback);

    getWorklet().port.onmessage?.(createAudioEvent(1, samples));

    expect(callback.mock.calls.map(([sample]) => sample.toBuffer())).toEqual([
      new AudioSample(samples).toBuffer(),
    ]);
  });

  it.each([
    [false, false],
    [true, true],
  ])(
    "does not forward samples when recording is %s and paused is %s",
    async (recording, paused) => {
      const recorder = createRecorder(recording, paused);
      const callback = vi.fn();
      await recorder.init(STREAM);
      recorder.record(callback);

      getWorklet().port.onmessage?.(createAudioEvent(0));

      expect(callback).not.toHaveBeenCalled();
    },
  );

  it("does not start capture until a recording callback is attached", async () => {
    const recorder = createRecorder();
    await recorder.init(STREAM);

    recorder.updateRecordingState();

    expect(getWorklet().port.postMessage).toHaveBeenCalledExactlyOnceWith(0);
  });

  it("starts the audio thread with a recording segment identifier", async () => {
    const recorder = createRecorder();
    await recorder.init(STREAM);

    recorder.record(vi.fn());

    expect(getWorklet().port.postMessage).toHaveBeenCalledExactlyOnceWith(1);
  });

  it.each([
    undefined,
    null,
    "not PCM",
    {},
    { recordingId: 1 },
    { samples: new Float32Array([0.5]) },
    { recordingId: 1, samples: [0.5] },
    { recordingId: 1, samples: new Float64Array([0.5]) },
    { recordingId: 1, samples: new Float32Array() },
    { recordingId: 2, samples: new Float32Array([0.5]) },
  ])("ignores malformed or stale worklet data %s", async (data: unknown) => {
    const recorder = createRecorder();
    const callback = vi.fn();
    await recorder.init(STREAM);
    recorder.record(callback);

    getWorklet().port.onmessage?.(new MessageEvent("message", { data }));

    expect(callback).not.toHaveBeenCalled();
  });

  it("rejects queued samples from before a quick pause and resume", async () => {
    const userMedia = createUserMedia();
    const recorder = new AudioRecorder(userMedia, mergeWithDefaultOptions());
    const callback = vi.fn();
    await recorder.init(STREAM);
    recorder.record(callback);
    userMedia.isPaused.mockReturnValue(true);
    recorder.updateRecordingState();
    userMedia.isPaused.mockReturnValue(false);
    recorder.updateRecordingState();

    getWorklet().port.onmessage?.(createAudioEvent(1));
    getWorklet().port.onmessage?.(createAudioEvent(2));

    expect(callback).toHaveBeenCalledOnce();
  });

  it("disconnects the entire audio graph and closes its port when stopped", async () => {
    const recorder = createRecorder();
    await recorder.init(STREAM);
    const worklet = getWorklet();

    recorder.stop();

    expect({
      inputs: FakeAudioContext.latest.audioInput.disconnect.mock.calls.length,
      gains: FakeAudioContext.latest.gainNode.disconnect.mock.calls.length,
      worklets: worklet.disconnect.mock.calls.length,
      ports: worklet.port.close.mock.calls.length,
      handler: worklet.port.onmessage,
      errorHandler: worklet.onprocessorerror,
      lastControl: worklet.port.postMessage.mock.lastCall,
    }).toEqual({
      inputs: 1,
      gains: 1,
      worklets: 1,
      ports: 1,
      handler: null,
      errorHandler: null,
      lastControl: [-1],
    });
  });

  it("closes the audio context when stopped", async () => {
    const recorder = createRecorder();
    await recorder.init(STREAM);

    recorder.stop();

    expect(FakeAudioContext.latest.close).toHaveBeenCalledOnce();
  });

  it("does not create an audio context just to stop an unused recorder", () => {
    const recorder = createRecorder();

    recorder.stop();

    expect(FakeAudioContext.instances).toEqual([]);
  });

  it("does not create an audio context just to resume an unused recorder", async () => {
    const recorder = createRecorder();

    await recorder.resume();

    expect(FakeAudioContext.instances).toEqual([]);
  });

  it("closes the context only once on repeated stops", async () => {
    const recorder = createRecorder();
    await recorder.init(STREAM);

    recorder.stop();
    recorder.stop();

    expect(FakeAudioContext.latest.close).toHaveBeenCalledOnce();
  });

  it("disconnects the old microphone graph before reattaching without changing sample rate", async () => {
    const recorder = createRecorder();
    await recorder.init(STREAM);
    const originalContext = FakeAudioContext.latest;

    await recorder.init(STREAM);

    expect({
      sameContext: FakeAudioContext.latest === originalContext,
      inputDisconnects: originalContext.audioInput.disconnect.mock.calls.length,
      gainDisconnects: originalContext.gainNode.disconnect.mock.calls.length,
      processorDisconnects: getWorklet().disconnect.mock.calls.length,
      moduleLoads: originalContext.audioWorklet.addModule.mock.calls.length,
      sampleRate: recorder.getSampleRate(),
    }).toEqual({
      sameContext: true,
      inputDisconnects: 1,
      gainDisconnects: 1,
      processorDisconnects: 1,
      moduleLoads: 1,
      sampleRate: 48_000,
    });
  });

  it("resumes a suspended audio context before capture can continue", async () => {
    const recorder = createRecorder();
    await recorder.init(STREAM);
    FakeAudioContext.latest.state = "suspended";

    await recorder.resume();

    expect(FakeAudioContext.latest.resume).toHaveBeenCalledOnce();
  });

  it("propagates audio context recovery failure", async () => {
    const recorder = createRecorder();
    await recorder.init(STREAM);
    FakeAudioContext.latest.state = "suspended";
    FakeAudioContext.latest.resume.mockRejectedValue(
      new DOMException("Denied", "NotAllowedError"),
    );

    await expect(recorder.resume()).rejects.toThrow("Denied");
  });

  it("waits for the module before constructing the audio graph", async () => {
    const recorder = createRecorder();
    const pending = Promise.withResolvers<undefined>();
    recorder.getSampleRate();
    FakeAudioContext.latest.audioWorklet.addModule.mockReturnValue(pending.promise);

    const initialization = recorder.init(STREAM);
    const nodesBeforeLoading = WORKLETS.length;
    pending.resolve(undefined);
    await initialization;

    expect({ before: nodesBeforeLoading, after: WORKLETS.length }).toEqual({
      before: 0,
      after: 1,
    });
  });

  it("revokes the module URL after it loads", async () => {
    const recorder = createRecorder();

    await recorder.init(STREAM);

    expect(REVOKE_MODULE_URL).toHaveBeenCalledExactlyOnceWith("blob:videomail-audio");
  });

  it("reports module loading failures", async () => {
    const recorder = createRecorder();
    recorder.getSampleRate();
    FakeAudioContext.latest.audioWorklet.addModule.mockRejectedValueOnce(
      new Error("CSP blocked blob: module"),
    );

    await expect(recorder.init(STREAM)).rejects.toThrow(
      "Unable to load the audio recorder worklet.",
    );
  });

  it.each(["AbortError", "SecurityError"])(
    "preserves worklet diagnostics when the browser rejects a module with %s",
    async (name) => {
      const recorder = createRecorder();
      const error = new DOMException("CSP blocked the audio module", name);
      recorder.getSampleRate();
      FakeAudioContext.latest.audioWorklet.addModule.mockRejectedValueOnce(error);

      await expect(recorder.init(STREAM)).rejects.toMatchObject({
        message: expect.stringContaining("Unable to load the audio recorder worklet."),
        cause: error,
      });
    },
  );

  it("revokes the module URL even when loading fails", async () => {
    const recorder = createRecorder();
    recorder.getSampleRate();
    FakeAudioContext.latest.audioWorklet.addModule.mockRejectedValueOnce(
      new Error("CSP blocked blob: module"),
    );

    await recorder.init(STREAM).catch(() => undefined);

    expect(REVOKE_MODULE_URL).toHaveBeenCalledExactlyOnceWith("blob:videomail-audio");
  });

  it("allows retrying a failed module load", async () => {
    const recorder = createRecorder();
    recorder.getSampleRate();
    FakeAudioContext.latest.audioWorklet.addModule.mockRejectedValueOnce(
      new Error("temporary module failure"),
    );
    await recorder.init(STREAM).catch(() => undefined);

    await recorder.init(STREAM);

    expect(FakeAudioContext.latest.audioWorklet.addModule).toHaveBeenCalledTimes(2);
  });

  it("shares module loading between overlapping initializations", async () => {
    const recorder = createRecorder();

    await Promise.all([recorder.init(STREAM), recorder.init(STREAM)]);

    expect({
      loads: FakeAudioContext.latest.audioWorklet.addModule.mock.calls.length,
      worklets: WORKLETS.length,
    }).toEqual({ loads: 1, worklets: 1 });
  });

  it("does not attach a late worklet after stopping", async () => {
    const recorder = createRecorder();
    const pending = Promise.withResolvers<undefined>();
    recorder.getSampleRate();
    FakeAudioContext.latest.audioWorklet.addModule.mockReturnValue(pending.promise);
    const initialization = recorder.init(STREAM);

    recorder.stop();
    pending.resolve(undefined);
    await initialization;

    expect(WORKLETS).toEqual([]);
  });

  it("releases a pending module URL as soon as recording is stopped", async () => {
    const recorder = createRecorder();
    const pending = Promise.withResolvers<undefined>();
    recorder.getSampleRate();
    FakeAudioContext.latest.audioWorklet.addModule.mockReturnValue(pending.promise);
    const initialization = recorder.init(STREAM);

    recorder.stop();
    pending.resolve(undefined);
    await initialization;

    expect(REVOKE_MODULE_URL).toHaveBeenCalledExactlyOnceWith("blob:videomail-audio");
  });

  it("ignores module load failures from a stopped initialization", async () => {
    const recorder = createRecorder();
    const pending = Promise.withResolvers<undefined>();
    recorder.getSampleRate();
    FakeAudioContext.latest.audioWorklet.addModule.mockReturnValue(pending.promise);
    const initialization = recorder.init(STREAM);

    recorder.stop();
    pending.reject(new Error("cancelled module load"));

    await expect(initialization).resolves.toBeUndefined();
  });

  it("does not let an old context close clear a newly initialized context", async () => {
    const recorder = createRecorder();
    const closing = Promise.withResolvers<undefined>();
    await recorder.init(STREAM);
    const oldContext = FakeAudioContext.latest;
    oldContext.close.mockReturnValue(closing.promise);
    recorder.stop();

    await recorder.init(STREAM);
    const newContext = FakeAudioContext.latest;
    closing.resolve(undefined);
    await closing.promise;
    recorder.getSampleRate();

    expect({
      contexts: FakeAudioContext.instances.length,
      distinct: newContext !== oldContext,
      current: FakeAudioContext.latest === newContext,
    }).toEqual({ contexts: 2, distinct: true, current: true });
  });

  it("cleans up partial graphs when worklet construction fails", async () => {
    const recorder = createRecorder();
    CREATE_WORKLET.mockImplementationOnce(() => {
      throw new Error("Cannot construct processor");
    });

    await recorder.init(STREAM).catch(() => undefined);

    expect({
      inputs: FakeAudioContext.latest.audioInput.disconnect.mock.calls.length,
      gains: FakeAudioContext.latest.gainNode.disconnect.mock.calls.length,
    }).toEqual({ inputs: 1, gains: 1 });
  });

  it("reports worklet processor failures through the existing error event", async () => {
    const recorder = createRecorder();
    const onError = vi.fn();
    recorder.on("ERROR", onError);
    await recorder.init(STREAM);

    getWorklet().onprocessorerror?.();

    expect(onError).toHaveBeenCalledWith({
      err: expect.objectContaining({ message: "Audio recording processor failed." }),
    });
  });

  it("reports unsupported AudioWorklet instead of using a deprecated fallback", async () => {
    const recorder = createRecorder();
    vi.stubGlobal("AudioWorkletNode", undefined);

    await expect(recorder.init(STREAM)).rejects.toThrow(
      "Audio recording requires AudioWorklet support in a secure context.",
    );
  });

  it("reports unavailable Web Audio support", async () => {
    const recorder = createRecorder();
    vi.stubGlobal("AudioContext", undefined);

    await expect(recorder.init(STREAM)).rejects.toThrow(
      "Audio recording requires Web Audio support.",
    );
  });

  it("reports a missing audioWorklet implementation in an insecure context", async () => {
    const recorder = createRecorder();
    recorder.getSampleRate();
    Object.defineProperty(FakeAudioContext.latest, "audioWorklet", {
      value: undefined,
    });

    await expect(recorder.init(STREAM)).rejects.toThrow(
      "Audio recording requires AudioWorklet support in a secure context.",
    );
  });

  it("does not resume a context that is already running", async () => {
    const recorder = createRecorder();
    await recorder.init(STREAM);

    await recorder.resume();

    expect(FakeAudioContext.latest.resume).not.toHaveBeenCalled();
  });

  it("does not forward a queued callback after teardown", async () => {
    const recorder = createRecorder();
    const callback = vi.fn();
    await recorder.init(STREAM);
    recorder.record(callback);
    const queuedMessage = getWorklet().port.onmessage;

    recorder.stop();
    queuedMessage?.(createAudioEvent());

    expect(callback).not.toHaveBeenCalled();
  });

  it("cleans up an already constructed worklet when connecting the graph fails", async () => {
    const recorder = createRecorder();
    recorder.getSampleRate();
    FakeAudioContext.latest.gainNode.connect.mockImplementationOnce(() => {
      throw new Error("Cannot connect processor");
    });

    await recorder.init(STREAM).catch(() => undefined);

    expect({
      worklets: getWorklet().disconnect.mock.calls.length,
      ports: getWorklet().port.close.mock.calls.length,
      inputs: FakeAudioContext.latest.audioInput.disconnect.mock.calls.length,
    }).toEqual({ worklets: 1, ports: 1, inputs: 1 });
  });

  it.each([new Error("Context close failed"), "unknown context close failure"])(
    "reports a context close rejection without leaving an unhandled promise: %s",
    async (error) => {
      const options = mergeWithDefaultOptions();
      const onError = vi
        .spyOn(options.logger, "error")
        .mockImplementation(() => undefined);
      const recorder = new AudioRecorder(createUserMedia(), options);
      await recorder.init(STREAM);
      FakeAudioContext.latest.close.mockRejectedValueOnce(error);

      recorder.stop();

      await vi.waitFor(() => {
        expect(onError).toHaveBeenCalledOnce();
      });
    },
  );

  it("returns the audio context sample rate", () => {
    const recorder = createRecorder();

    expect(recorder.getSampleRate()).toBe(48_000);
  });

  it("returns a sentinel sample rate when AudioContext is unavailable", () => {
    vi.stubGlobal("AudioContext", undefined);
    const recorder = createRecorder();

    expect(recorder.getSampleRate()).toBe(-1);
  });
});
