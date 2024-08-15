import AudioSample from "audio-sample";
import isPOT from "is-power-of-two";
import Browser from "./browser";
import VideomailError from "./videomailError";

const CHANNELS = 1;

/*
 * for inspiration see
 * https://github.com/saebekassebil/microphone-stream
 */

// todo code needs rewrite

export default function (userMedia, options) {
  let scriptProcessor;
  let audioInput;
  let vcAudioContext;

  const browser = new Browser(options);

  function getAudioContextClass() {
    return window.AudioContext || window.webkitAudioContext;
  }

  function hasAudioContext() {
    return Boolean(getAudioContextClass()) && Boolean(getAudioContext());
  }

  function getAudioContext() {
    // instantiate only once
    if (!vcAudioContext) {
      const AudioContext = getAudioContextClass();
      vcAudioContext = new AudioContext();
    }

    return vcAudioContext;
  }

  function onAudioProcess(e, cb) {
    if (!userMedia.isRecording() || userMedia.isPaused()) {
      return;
    }

    /*
     * Returns a Float32Array containing the PCM data associated with the channel,
     * defined by the channel parameter (with 0 representing the first channel)
     */
    const float32Array = e.inputBuffer.getChannelData(0);

    cb(new AudioSample(float32Array));
  }

  this.init = function (localMediaStream) {
    options.debug("AudioRecorder: init()");

    // creates an audio node from the microphone incoming stream
    const volume = getAudioContext().createGain();

    try {
      audioInput = getAudioContext().createMediaStreamSource(localMediaStream);
    } catch (exc) {
      throw VideomailError.create("Webcam has no audio", exc.toString(), options);
    }

    let { bufferSize } = options.audio;

    // see https://github.com/binarykitchen/videomail-client/issues/184
    if (bufferSize === "auto") {
      if (browser.isFirefox()) {
        bufferSize = 512;
      } else {
        bufferSize = 2048;
      }
    }

    if (!isPOT(bufferSize)) {
      throw VideomailError.create("Audio buffer size must be a power of two.", options);
    }

    if (!options.audio.volume || options.audio.volume > 1) {
      throw VideomailError.create("Audio volume must be between zero and one.", options);
    }

    volume.gain.value = options.audio.volume;

    /*
     * Create a ScriptProcessorNode with the given bufferSize and
     * a single input and output channel
     */
    scriptProcessor = getAudioContext().createScriptProcessor(
      bufferSize,
      CHANNELS,
      CHANNELS,
    );

    // connect stream to our scriptProcessor
    audioInput.connect(scriptProcessor);

    // connect our scriptProcessor to the previous destination
    scriptProcessor.connect(getAudioContext().destination);

    // connect volume
    audioInput.connect(volume);
    volume.connect(scriptProcessor);
  };

  this.record = function (cb) {
    options.debug("AudioRecorder: record()");

    scriptProcessor.onaudioprocess = function (e) {
      onAudioProcess(e, cb);
    };
  };

  this.stop = function () {
    options.debug("AudioRecorder: stop()");

    if (scriptProcessor) {
      scriptProcessor.onaudioprocess = undefined;
    }

    if (audioInput) {
      audioInput.disconnect();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/close
    if (hasAudioContext()) {
      if (getAudioContext().close) {
        getAudioContext()
          .close()
          .then(function () {
            options.debug("AudioRecorder: audio context is closed");
            vcAudioContext = null;
          })
          .catch(function (err) {
            throw VideomailError.create(err, options);
          });
      } else {
        vcAudioContext = null;
      }
    }
  };

  this.getSampleRate = function () {
    if (hasAudioContext()) {
      return getAudioContext().sampleRate;
    }

    return -1;
  };
}
