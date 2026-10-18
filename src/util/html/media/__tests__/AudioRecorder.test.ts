import UserMedia from "../../../../wrappers/visuals/userMedia";
import mergeWithDefaultOptions from "../../../options/mergeWithDefaultOptions";
import AudioRecorder from "../AudioRecorder";

class FakeAudioContext {
  public static latest: FakeAudioContext;

  public readonly close = vi.fn(() => Promise.resolve());
  public state = "running";
  public readonly resume = vi.fn(() => {
    this.state = "running";
    return Promise.resolve();
  });
  public readonly createGain = vi.fn(() => this.gainNode);
  public readonly createMediaStreamSource = vi.fn(() => this.audioInput);
  public readonly createScriptProcessor = vi.fn(() => this.scriptProcessor);
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
  public readonly scriptProcessor = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    onaudioprocess: null as ((event: AudioProcessEvent) => void) | null,
  };

  public constructor() {
    FakeAudioContext.latest = this;
  }
}

interface AudioProcessEvent {
  inputBuffer: {
    getChannelData: (channel: number) => Float32Array;
  };
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

function createAudioEvent() {
  return {
    inputBuffer: {
      getChannelData: vi.fn(() => new Float32Array([0.25])),
    },
  };
}

describe("AudioRecorder", () => {
  beforeEach(() => {
    vi.stubGlobal("AudioContext", FakeAudioContext);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("creates a mono script processor with the configured buffer size", () => {
    const recorder = createRecorder();

    recorder.init({} as MediaStream);

    expect(FakeAudioContext.latest.createScriptProcessor).toHaveBeenCalledWith(
      1024,
      1,
      1,
    );
  });

  it.each([0, 0.2, 0.4, 1])("sets the configured input gain to %s", (volume) => {
    const options = mergeWithDefaultOptions({
      audio: { bufferSize: 1024, volume },
    });
    const recorder = new AudioRecorder(createUserMedia(), options);

    recorder.init({} as MediaStream);

    expect(FakeAudioContext.latest.gainNode.gain.value).toBe(volume);
  });

  it("uses unity input gain by default", () => {
    const options = mergeWithDefaultOptions({ audio: { bufferSize: 1024 } });
    const recorder = new AudioRecorder(createUserMedia(), options);

    recorder.init({} as MediaStream);

    expect(FakeAudioContext.latest.gainNode.gain.value).toBe(1);
  });

  it("connects the microphone only to the input gain", () => {
    const recorder = createRecorder();
    recorder.init({} as MediaStream);
    const { audioInput, gainNode } = FakeAudioContext.latest;

    expect(audioInput.connect.mock.calls).toEqual([[gainNode]]);
  });

  it("connects the input gain only to the script processor", () => {
    const recorder = createRecorder();
    recorder.init({} as MediaStream);
    const { gainNode, scriptProcessor } = FakeAudioContext.latest;

    expect(gainNode.connect.mock.calls).toEqual([[scriptProcessor]]);
  });

  it("keeps the script processor connected to the destination", () => {
    const recorder = createRecorder();
    recorder.init({} as MediaStream);
    const { scriptProcessor, destination } = FakeAudioContext.latest;

    expect(scriptProcessor.connect.mock.calls).toEqual([[destination]]);
  });

  it("rejects a buffer size that is not a power of two", () => {
    const options = mergeWithDefaultOptions({ audio: { bufferSize: 1000 } });
    const recorder = new AudioRecorder(createUserMedia(), options);

    expect(() => {
      recorder.init({} as MediaStream);
    }).toThrow("Audio buffer size must be a power of two.");
  });

  it.each([-0.1, 1.1])("rejects the out-of-range volume %s", (volume) => {
    const options = mergeWithDefaultOptions({
      audio: { bufferSize: 1024, volume },
    });
    const recorder = new AudioRecorder(createUserMedia(), options);

    expect(() => {
      recorder.init({} as MediaStream);
    }).toThrow("Audio volume must be between zero and one.");
  });

  it("reports a stream without audio", () => {
    const recorder = createRecorder();
    recorder.getSampleRate();
    FakeAudioContext.latest.createMediaStreamSource.mockImplementationOnce(() => {
      throw new Error("missing track");
    });

    expect(() => {
      recorder.init({} as MediaStream);
    }).toThrow("Webcam has no audio");
  });

  it("forwards audio samples while user media is recording", () => {
    const recorder = createRecorder();
    const callback = vi.fn();
    recorder.init({} as MediaStream);
    recorder.record(callback);

    FakeAudioContext.latest.scriptProcessor.onaudioprocess?.(createAudioEvent());

    expect(callback).toHaveBeenCalledOnce();
  });

  it.each([
    [false, false],
    [true, true],
  ])(
    "does not forward samples when recording is %s and paused is %s",
    (recording, paused) => {
      const recorder = createRecorder(recording, paused);
      const callback = vi.fn();
      recorder.init({} as MediaStream);
      recorder.record(callback);

      FakeAudioContext.latest.scriptProcessor.onaudioprocess?.(createAudioEvent());

      expect(callback).not.toHaveBeenCalled();
    },
  );

  it("disconnects the audio input when stopped", () => {
    const recorder = createRecorder();
    recorder.init({} as MediaStream);

    recorder.stop();

    expect(FakeAudioContext.latest.audioInput.disconnect).toHaveBeenCalledOnce();
  });

  it("closes the audio context when stopped", () => {
    const recorder = createRecorder();
    recorder.init({} as MediaStream);

    recorder.stop();

    expect(FakeAudioContext.latest.close).toHaveBeenCalledOnce();
  });

  it("disconnects the old microphone graph before reattaching without changing sample rate", () => {
    const recorder = createRecorder();
    recorder.init({} as MediaStream);
    const originalContext = FakeAudioContext.latest;

    recorder.init({} as MediaStream);

    expect({
      sameContext: FakeAudioContext.latest === originalContext,
      inputDisconnects: originalContext.audioInput.disconnect.mock.calls.length,
      gainDisconnects: originalContext.gainNode.disconnect.mock.calls.length,
      processorDisconnects: originalContext.scriptProcessor.disconnect.mock.calls.length,
      sampleRate: recorder.getSampleRate(),
    }).toEqual({
      sameContext: true,
      inputDisconnects: 1,
      gainDisconnects: 1,
      processorDisconnects: 1,
      sampleRate: 48_000,
    });
  });

  it("resumes a suspended audio context before capture can continue", async () => {
    const recorder = createRecorder();
    recorder.init({} as MediaStream);
    FakeAudioContext.latest.state = "suspended";

    await recorder.resume();

    expect(FakeAudioContext.latest.resume).toHaveBeenCalledOnce();
  });

  it("propagates audio context recovery failure", async () => {
    const recorder = createRecorder();
    recorder.init({} as MediaStream);
    FakeAudioContext.latest.state = "suspended";
    FakeAudioContext.latest.resume.mockRejectedValue(
      new DOMException("Denied", "NotAllowedError"),
    );

    await expect(recorder.resume()).rejects.toThrow("Denied");
  });

  it("returns the audio context sample rate", () => {
    const recorder = createRecorder();

    expect(recorder.getSampleRate()).toBe(48_000);
  });

  it("returns a sentinel sample rate when AudioContext is unavailable", () => {
    vi.unstubAllGlobals();
    const recorder = createRecorder();

    expect(recorder.getSampleRate()).toBe(-1);
  });
});
