import AudioSample from "audio-sample";
import isPOT from "is-power-of-two";

import { VideomailClientOptions } from "../types/options";
import createError from "../util/error/createError";
import getBrowser from "../util/getBrowser";
import UserMedia from "../wrappers/visuals/userMedia";
import processorUrl from "./pcm-processor.worklet.ts?url";

const CHANNELS = 1;

/*
 * For inspiration see
 * https://github.com/saebekassebil/microphone-stream
 */

function getAudioContextClass() {
  return window.AudioContext;
}

export type AudioProcessCB = (audioSample: AudioSample) => void;

class AudioRecorder {
  private worklet?: AudioWorkletNode | undefined;
  private audioInput?: MediaStreamAudioSourceNode | undefined;
  private volume?: GainNode | undefined;
  private vcAudioContext?: AudioContext | undefined;
  private generation = 0;

  private readonly userMedia: UserMedia;
  private readonly options: VideomailClientOptions;

  public constructor(userMedia: UserMedia, options: VideomailClientOptions) {
    this.options = options;
    this.userMedia = userMedia;
  }

  private getAudioContext() {
    // instantiate only once
    if (!this.vcAudioContext) {
      const AudioContext = getAudioContextClass();
      this.vcAudioContext = new AudioContext();
    }

    return this.vcAudioContext;
  }

  private onAudioProcess(samples: Float32Array, cb: AudioProcessCB) {
    if (!this.userMedia.isRecording() || this.userMedia.isPaused()) {
      return;
    }

    cb(new AudioSample(samples));
  }

  public async init(localMediaStream: MediaStream) {
    this.options.logger.debug("AudioRecorder: init()");

    let { bufferSize } = this.options.audio;

    // see https://github.com/binarykitchen/videomail-client/issues/184
    if (bufferSize === "auto") {
      if (getBrowser(this.options).isFirefox()) {
        bufferSize = 512;
      } else {
        bufferSize = 2048;
      }
    }

    if (
      bufferSize === undefined ||
      !isPOT(bufferSize) ||
      bufferSize < 256 ||
      bufferSize > 16_384
    ) {
      throw createError({
        message: `Audio buffer size must be a power of two between 256 and 16384. The current buffer size is ${bufferSize}.`,
        options: this.options,
      });
    }

    if (
      !Number.isFinite(this.options.audio.volume) ||
      this.options.audio.volume < 0 ||
      this.options.audio.volume > 1
    ) {
      throw createError({
        message: `Audio volume must be between zero and one. The current volume is ${this.options.audio.volume}.`,
        options: this.options,
      });
    }

    this.stop();
    const generation = this.generation;
    const context = this.getAudioContext();

    try {
      this.audioInput = context.createMediaStreamSource(localMediaStream);
    } catch (exc) {
      this.stop();
      throw createError({ message: "Webcam has no audio", exc, options: this.options });
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!context.audioWorklet) {
      this.stop();
      throw createError({
        message: "AudioWorklet is not supported in this browser.",
        options: this.options,
      });
    }

    try {
      await context.audioWorklet.addModule(processorUrl);

      if (this.generation !== generation) {
        return;
      }

      this.worklet = new AudioWorkletNode(context, "videomail-pcm", {
        numberOfInputs: CHANNELS,
        numberOfOutputs: CHANNELS,
        outputChannelCount: [CHANNELS],
        processorOptions: { bufferSize },
      });
      this.volume = context.createGain();
      this.volume.gain.value = this.options.audio.volume;

      this.audioInput.connect(this.volume);
      this.volume.connect(this.worklet);
      this.worklet.connect(context.destination);
    } catch (exc) {
      if (this.generation === generation) {
        this.stop();
        throw createError({
          message: "Failed to initialize the audio worklet.",
          exc,
          options: this.options,
        });
      }
    }
  }

  public record(cb: AudioProcessCB) {
    this.options.logger.debug("AudioRecorder: record()");

    if (this.worklet) {
      this.worklet.port.onmessage = (event: MessageEvent<Float32Array>) => {
        this.onAudioProcess(event.data, cb);
      };
    }
  }

  public stop() {
    this.options.logger.debug("AudioRecorder: stop()");

    this.generation++;
    const context = this.vcAudioContext;

    if (this.worklet) {
      this.worklet.port.onmessage = null;
      this.worklet.port.close();
      this.worklet.disconnect();
      this.worklet = undefined;
    }

    this.volume?.disconnect();
    this.volume = undefined;
    this.audioInput?.disconnect();
    this.audioInput = undefined;
    this.vcAudioContext = undefined;

    if (context) {
      void context
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
    return this.vcAudioContext?.sampleRate ?? -1;
  }
}

export default AudioRecorder;
