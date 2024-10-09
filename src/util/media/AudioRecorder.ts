import AudioSample from "audio-sample";
import isPOT from "is-power-of-two";
import options from "../../options";
import getBrowser from "../getBrowser";
import createError from "../error/createError";

const CHANNELS = 1;

/*
 * for inspiration see
 * https://github.com/saebekassebil/microphone-stream
 */

function getAudioContextClass() {
  return window.AudioContext;
}

class AudioRecorder {
  private scriptProcessor;
  private audioInput;
  private vcAudioContext;

  private browser;
  private userMedia;
  private options;

  public constructor(userMedia, options) {
    this.browser = getBrowser(options);

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

  private onAudioProcess(e, cb) {
    if (!this.userMedia.isRecording() || this.userMedia.isPaused()) {
      return;
    }

    /*
     * Returns a Float32Array containing the PCM data associated with the channel,
     * defined by the channel parameter (with 0 representing the first channel)
     */
    const float32Array = e.inputBuffer.getChannelData(0);

    cb(new AudioSample(float32Array));
  }

  public init(localMediaStream) {
    this.options.debug("AudioRecorder: init()");

    // creates an audio node from the microphone incoming stream
    const volume = this.getAudioContext().createGain();

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
      if (this.browser.isFirefox()) {
        bufferSize = 512;
      } else {
        bufferSize = 2048;
      }
    }

    if (!isPOT(bufferSize)) {
      throw createError({
        message: "Audio buffer size must be a power of two.",
        options: this.options,
      });
    }

    if (!this.options.audio.volume || options.audio.volume > 1) {
      throw createError({
        message: "Audio volume must be between zero and one.",
        options: this.options,
      });
    }

    volume.gain.value = this.options.audio.volume;

    /*
     * Create a ScriptProcessorNode with the given bufferSize and
     * a single input and output channel
     */
    this.scriptProcessor = this.getAudioContext().createScriptProcessor(
      bufferSize,
      CHANNELS,
      CHANNELS,
    );

    // connect stream to our scriptProcessor
    this.audioInput.connect(this.scriptProcessor);

    // connect our scriptProcessor to the previous destination
    this.scriptProcessor.connect(this.getAudioContext().destination);

    // connect volume
    this.audioInput.connect(volume);
    volume.connect(this.scriptProcessor);
  }

  public record(cb) {
    this.options.debug("AudioRecorder: record()");

    this.scriptProcessor.onaudioprocess = (e) => {
      this.onAudioProcess(e, cb);
    };
  }

  public stop() {
    this.options.debug("AudioRecorder: stop()");

    if (this.scriptProcessor) {
      this.scriptProcessor.onaudioprocess = undefined;
    }

    if (this.audioInput) {
      this.audioInput.disconnect();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/close
    if (this.hasAudioContext()) {
      if (this.getAudioContext().close) {
        this.getAudioContext()
          .close()
          .then(() => {
            options.logger.debug("AudioRecorder: audio context is closed");
            this.vcAudioContext = null;
          })
          .catch(function (err) {
            throw createError({ err, options });
          });
      } else {
        this.vcAudioContext = null;
      }
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
