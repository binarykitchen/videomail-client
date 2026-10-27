import AudioSample from "audio-sample";
import isPOT from "is-power-of-two";

import type { VideomailClientOptions } from "../../../types/options";
import type UserMedia from "../../../wrappers/visuals/userMedia";
import Despot from "../../Despot";
import createError from "../../error/createError";
import registerAudioRecorderProcessor, {
  AUDIO_RECORDER_PROCESSOR_NAME,
} from "./AudioRecorderWorklet";

const CHANNELS = 1;
const DEFAULT_BUFFER_SIZE = 2048;
const MIN_BUFFER_SIZE = 256;
const MAX_BUFFER_SIZE = 16_384;

export type AudioProcessCB = (audioSample: AudioSample) => void;

class AudioRecorder extends Despot {
  private readonly userMedia: Pick<UserMedia, "isRecording" | "isPaused">;

  private worklet?: AudioWorkletNode | undefined;
  private audioInput?: MediaStreamAudioSourceNode | undefined;
  private volume?: GainNode | undefined;
  private vcAudioContext?: AudioContext | undefined;
  private workletReady?: Promise<void> | undefined;
  private moduleUrl?: string | undefined;
  private audioCallback?: AudioProcessCB | undefined;
  private initializationId = 0;
  private recordingSequence = 0;
  private recordingId = 0;

  public constructor(
    userMedia: Pick<UserMedia, "isRecording" | "isPaused">,
    options: VideomailClientOptions,
  ) {
    super("AudioRecorder", options);
    this.userMedia = userMedia;
  }

  private getAudioContext() {
    if (!this.vcAudioContext) {
      this.vcAudioContext = new window.AudioContext();
    }

    return this.vcAudioContext;
  }

  private getBufferSize() {
    const configuredSize = this.options.audio.bufferSize;
    const bufferSize = configuredSize === "auto" ? DEFAULT_BUFFER_SIZE : configuredSize;

    if (bufferSize === undefined) {
      throw createError({
        message: "Audio buffer size is required.",
        options: this.options,
      });
    }

    const validBufferSize =
      Number.isInteger(bufferSize) &&
      bufferSize >= MIN_BUFFER_SIZE &&
      bufferSize <= MAX_BUFFER_SIZE &&
      isPOT(bufferSize);

    if (!validBufferSize) {
      throw createError({
        message: `Audio buffer size must be a power of two between ${MIN_BUFFER_SIZE} and ${MAX_BUFFER_SIZE}. The current buffer size is ${bufferSize}.`,
        options: this.options,
      });
    }

    return bufferSize;
  }

  private validateVolume() {
    const { volume } = this.options.audio;
    const validVolume = Number.isFinite(volume) && volume >= 0 && volume <= 1;

    if (!validVolume) {
      throw createError({
        message: `Audio volume must be between zero and one. The current volume is ${volume}.`,
        options: this.options,
      });
    }
  }

  private revokeModuleUrl() {
    if (this.moduleUrl) {
      URL.revokeObjectURL(this.moduleUrl);
      this.moduleUrl = undefined;
    }
  }

  private async loadWorklet(context: AudioContext) {
    const source = `(${registerAudioRecorderProcessor.toString()})(${JSON.stringify(AUDIO_RECORDER_PROCESSOR_NAME)}, AudioWorkletProcessor, registerProcessor);`;
    const moduleUrl = URL.createObjectURL(
      new Blob([source], { type: "text/javascript" }),
    );
    this.moduleUrl = moduleUrl;

    try {
      await context.audioWorklet.addModule(moduleUrl);
    } finally {
      if (this.moduleUrl === moduleUrl) {
        this.revokeModuleUrl();
      }
    }
  }

  private onAudioProcess(event: MessageEvent<unknown>) {
    const callback = this.audioCallback;

    if (!callback) {
      return;
    }
    if (!this.userMedia.isRecording() || this.userMedia.isPaused()) {
      return;
    }

    const message = event.data;

    if (typeof message !== "object" || message === null) {
      return;
    }
    if (!("recordingId" in message) || message.recordingId !== this.recordingId) {
      return;
    }
    if (!("samples" in message) || !(message.samples instanceof Float32Array)) {
      return;
    }
    if (message.samples.length === 0) {
      return;
    }

    callback(new AudioSample(message.samples));
  }

  private disconnect() {
    if (this.worklet) {
      this.worklet.port.onmessage = null;
      this.worklet.onprocessorerror = null;
      this.worklet.port.postMessage(-1);
      this.worklet.port.close();
      this.worklet.disconnect();
      this.worklet = undefined;
    }

    this.audioInput?.disconnect();
    this.volume?.disconnect();
    this.audioInput = undefined;
    this.volume = undefined;
    this.audioCallback = undefined;
    this.recordingId = 0;
  }

  public async init(localMediaStream: MediaStream) {
    this.options.logger.debug("AudioRecorder: init()");

    const initializationId = ++this.initializationId;
    this.disconnect();

    const bufferSize = this.getBufferSize();
    this.validateVolume();

    if (typeof window.AudioContext !== "function") {
      throw createError({
        message: "Audio recording requires Web Audio support.",
        options: this.options,
      });
    }

    const context = this.getAudioContext();

    if (
      typeof context.audioWorklet === "undefined" ||
      typeof window.AudioWorkletNode !== "function"
    ) {
      throw createError({
        message: "Audio recording requires AudioWorklet support in a secure context.",
        options: this.options,
      });
    }

    const workletReady = (this.workletReady ??= this.loadWorklet(context));

    try {
      await workletReady;
    } catch (exc) {
      if (this.workletReady === workletReady) {
        this.workletReady = undefined;
      }
      if (initializationId !== this.initializationId) {
        return;
      }

      throw createError({
        message:
          "Unable to load the audio recorder worklet. Check AudioWorklet and Content Security Policy support for blob: scripts.",
        cause: exc,
        options: this.options,
      });
    }

    if (initializationId !== this.initializationId) {
      return;
    }

    try {
      this.audioInput = context.createMediaStreamSource(localMediaStream);
    } catch (exc) {
      throw createError({
        message: "Webcam has no audio",
        exc,
        options: this.options,
      });
    }

    try {
      this.volume = context.createGain();
      this.volume.gain.value = this.options.audio.volume;
      this.worklet = new window.AudioWorkletNode(context, AUDIO_RECORDER_PROCESSOR_NAME, {
        channelCount: CHANNELS,
        channelCountMode: "explicit",
        outputChannelCount: [CHANNELS],
        processorOptions: { bufferSize },
      });
      this.worklet.port.onmessage = (event: MessageEvent<unknown>) => {
        this.onAudioProcess(event);
      };
      this.worklet.onprocessorerror = () => {
        this.stop();
        this.emit("ERROR", {
          err: createError({
            message: "Audio recording processor failed.",
            options: this.options,
          }),
        });
      };

      this.audioInput.connect(this.volume);
      this.volume.connect(this.worklet);
      this.worklet.connect(context.destination);
    } catch (exc) {
      this.disconnect();
      throw createError({
        message: "Failed to connect the audio recorder.",
        exc,
        options: this.options,
      });
    }
  }

  public record(cb: AudioProcessCB) {
    this.options.logger.debug("AudioRecorder: record()");
    this.audioCallback = cb;
    this.updateRecordingState();
  }

  public updateRecordingState() {
    if (!this.worklet) {
      return;
    }

    const shouldRecord =
      Boolean(this.audioCallback) &&
      this.userMedia.isRecording() &&
      !this.userMedia.isPaused();

    this.recordingId = shouldRecord ? ++this.recordingSequence : 0;
    this.worklet.port.postMessage(this.recordingId);
  }

  public async resume() {
    const context = this.vcAudioContext;

    if (!context) {
      return;
    }

    if (context.state !== "running") {
      await context.resume();
    }
  }

  public stop() {
    this.options.logger.debug("AudioRecorder: stop()");

    this.initializationId++;
    this.disconnect();
    this.revokeModuleUrl();

    const context = this.vcAudioContext;
    this.vcAudioContext = undefined;
    this.workletReady = undefined;

    if (context && context.state !== "closed") {
      context
        .close()
        .then(() => {
          this.options.logger.debug("AudioRecorder: audio context is closed");
        })
        .catch((err: unknown) => {
          if (err instanceof Error) {
            this.options.logger.error(createError({ err, options: this.options }));
            return;
          }

          this.options.logger.error(err);
        });
    }
  }

  public getSampleRate() {
    if (typeof window.AudioContext === "function") {
      return this.getAudioContext().sampleRate;
    }

    return -1;
  }
}

export default AudioRecorder;
