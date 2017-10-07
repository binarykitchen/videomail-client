import isPOT from 'is-power-of-two'
import AudioSample from 'audio-sample'

import VideomailError from './videomailError'

const CHANNELS = 1

// for inspiration see
// https://github.com/saebekassebil/microphone-stream

export default function (userMedia, options) {
  var scriptProcessor
  var audioInput
  var vcAudioContext

  function getAudioContext () {
    // instantiate only once
    if (!vcAudioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      vcAudioContext = new AudioContext()
    }

    return vcAudioContext
  }

  function onAudioProcess (e, cb) {
    if (!userMedia.isRecording() || userMedia.isPaused()) {
      return
    }

    // Returns a Float32Array containing the PCM data associated with the channel,
    // defined by the channel parameter (with 0 representing the first channel)
    const float32Array = e.inputBuffer.getChannelData(0)

    cb(new AudioSample(float32Array))
  }

  this.init = function (localMediaStream) {
    options.debug('AudioRecorder: init()')

    // creates an audio node from the microphone incoming stream
    const volume = getAudioContext().createGain()

    try {
      audioInput = getAudioContext().createMediaStreamSource(localMediaStream)
    } catch (exc) {
      throw VideomailError.create(
        'Webcam has no audio',
        exc.toString(),
        options
      )
    }

    if (!isPOT(options.audio.bufferSize)) {
      throw VideomailError.create('Audio buffer size must be a power of two.', options)
    } else if (!options.audio.volume || options.audio.volume > 1) {
      throw VideomailError.create('Audio volume must be between zero and one.', options)
    }

    volume.gain.value = options.audio.volume

    // Create a ScriptProcessorNode with the given bufferSize and
    // a single input and output channel
    scriptProcessor = getAudioContext().createScriptProcessor(
      options.audio.bufferSize,
      CHANNELS,
      CHANNELS
    )

    // connect stream to our scriptProcessor
    audioInput.connect(scriptProcessor)

    // connect our scriptProcessor to the previous destination
    scriptProcessor.connect(getAudioContext().destination)

    // connect volume
    audioInput.connect(volume)
    volume.connect(scriptProcessor)
  }

  this.record = function (cb) {
    options.debug('AudioRecorder: record()')

    scriptProcessor.onaudioprocess = function (e) {
      onAudioProcess(e, cb)
    }
  }

  this.stop = function () {
    options.debug('AudioRecorder: stop()')

    if (scriptProcessor) {
      scriptProcessor.onaudioprocess = undefined
    }

    if (audioInput) {
      audioInput.disconnect()
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/close
    getAudioContext()
    .close()
    .then(function () {
      options.debug('AudioRecorder: audio context is closed')
      vcAudioContext = null
    })
  }

  this.getSampleRate = function () {
    if (getAudioContext()) {
      return getAudioContext().sampleRate
    } else {
      return -1
    }
  }
}
