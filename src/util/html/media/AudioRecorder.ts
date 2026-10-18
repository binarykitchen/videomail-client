import AudioSample from "audio-sample";
import isPOT from "is-power-of-two";

import { VideomailClientOptions } from "../../../types/options";
import UserMedia from "../../../wrappers/visuals/userMedia";
import createError from "../../error/createError";
import getBrowser from "../../getBrowser";

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
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  private scriptProcessor?: ScriptProcessorNode | undefined;
  private audioInput?: MediaStreamAudioSourceNode;
  private volume?: GainNode;
  private vcAudioContext?: AudioContext | undefined;

  private readonly userMedia: UserMedia;
  private readonly options: VideomailClientOptions;

  public constructor(userMedia: UserMedia, options: VideomailClientOptions) {
    this.options = options;
    this.userMedia = userMedia;
  }

  private hasAudioContext() {
    return Boolean(getAudioContextClass()) && Boolean(this.getAudioContext());
  }

  private getAudioContext() {
    // instantiate only once
    if (!this.vcAudioContext) {
      const AudioContext = getAudioContextClass();
      this.vcAudioContext = new AudioContext();
    }

    return this.vcAudioContext;
  }

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  private onAudioProcess(e: AudioProcessingEvent, cb: AudioProcessCB) {
    if (!this.userMedia.isRecording() || this.userMedia.isPaused()) {
      return;
    }

    /*
     * Returns a Float32Array containing the PCM data associated with the channel,
     * defined by the channel parameter (with 0 representing the first channel)
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const float32Array = e.inputBuffer.getChannelData(0);

    cb(new AudioSample(float32Array));
  }

  private disconnect() {
    if (this.scriptProcessor) {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      this.scriptProcessor.onaudioprocess = null;
      this.scriptProcessor.disconnect();
    }

    this.audioInput?.disconnect();
    this.volume?.disconnect();
  }

  public init(localMediaStream: MediaStream) {
    this.options.logger.debug("AudioRecorder: init()");

    // Detach old nodes to avoid duplicate samples, but reuse the context/sample rate.
    this.disconnect();

    // creates an audio node from the microphone incoming stream
    const volume = this.getAudioContext().createGain();
    this.volume = volume;

    try {
      this.audioInput = this.getAudioContext().createMediaStreamSource(localMediaStream);
    } catch (exc) {
      throw createError({
        message: "Webcam has no audio",
        exc,
        options: this.options,
      });
    }

    let { bufferSize } = this.options.audio;

    // see https://github.com/binarykitchen/videomail-client/issues/184
    if (bufferSize === "auto") {
      if (getBrowser(this.options).isFirefox()) {
        bufferSize = 512;
      } else {
        bufferSize = 2048;
      }
    }

    if (bufferSize === undefined || !isPOT(bufferSize)) {
      throw createError({
        message: `Audio buffer size must be a power of two. The current buffer size is ${bufferSize}.`,
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

    volume.gain.value = this.options.audio.volume;

    /*
     * Create a ScriptProcessorNode with the given bufferSize and
     * a single input and output channel
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    this.scriptProcessor = this.getAudioContext().createScriptProcessor(
      bufferSize,
      CHANNELS,
      CHANNELS,
    );

    // Connect this path: microphone -> volume control -> recorder -> browser output.
    // We go left to right to make it easy to read.
    // We could connect the last part first and still get the same path.

    // First, apply the volume setting to the microphone data.
    this.audioInput.connect(volume);

    // Next, send the adjusted data to the recorder.
    volume.connect(this.scriptProcessor);

    // Last, give the recorder an output so it keeps working.
    // This output contains only zeros, so no microphone audio is played back.
    this.scriptProcessor.connect(this.getAudioContext().destination);
  }

  public record(cb: AudioProcessCB) {
    this.options.logger.debug("AudioRecorder: record()");

    if (this.scriptProcessor) {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      this.scriptProcessor.onaudioprocess = (e) => {
        this.onAudioProcess(e, cb);
      };
    }
  }

  public async resume() {
    const context = this.getAudioContext();

    if (context.state !== "running") {
      await context.resume();
    }
  }

  public stop() {
    this.options.logger.debug("AudioRecorder: stop()");

    this.disconnect();

    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/close
    if (this.hasAudioContext()) {
      this.getAudioContext()
        .close()
        .then(() => {
          this.options.logger.debug("AudioRecorder: audio context is closed");
          this.vcAudioContext = undefined;
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
    if (this.hasAudioContext()) {
      return this.getAudioContext().sampleRate;
    }

    return -1;
  }
}

export default AudioRecorder;
