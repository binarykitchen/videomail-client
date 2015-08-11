var isPOT = require('is-power-of-two'),

    AudioSample     = require('./items/audioSample'),
    VideomailError  = require('./videomailError')

module.exports = function(userMedia, options) {

    var scriptProcessor

    function getAudioContext() {
        // instantiate only once
        if (!window.audioContext) {
            var AudioContext = window.AudioContext || window.webkitAudioContext
            window.audioContext = new AudioContext()
        }

        return window.audioContext
    }

    function onAudioProcess(e, cb) {
        if (!userMedia.isRecording() || userMedia.isPaused())
            return

        // Returns a Float32Array containing the PCM data associated with the channel,
        // defined by the channel parameter (with 0 representing the first channel)
        var float32Array = e.inputBuffer.getChannelData(0)
        cb(new AudioSample(float32Array))
    }

    this.init = function(localMediaStream) {

        // creates an audio node from the microphone incoming stream
        var audioInput = getAudioContext().createMediaStreamSource(localMediaStream),
            volume     = getAudioContext().createGain(),
            channels   = 1

        if (!isPOT(options.audio.bufferSize))
            throw VideomailError.create('Audio buffer size must be a power of two.', options)

        else if (!options.audio.volume || options.audio.volume > 1)
            throw VideomailError.create('Audio volume must be between zero and one.', options)

        volume.gain.value = options.audio.volume

        // Create a ScriptProcessorNode with the given bufferSize and
        // a single input and output channel
        scriptProcessor =
            getAudioContext().createScriptProcessor(
                options.audio.bufferSize,
                channels,
                channels
            )

        // connect stream to our scriptProcessor
        audioInput.connect(scriptProcessor)

        // connect our scriptProcessor to the previous destination
        scriptProcessor.connect(getAudioContext().destination)

        // connect volume
        audioInput.connect(volume)
        volume.connect(scriptProcessor)
    }

    this.record = function(cb) {
        options.debug('AudioRecorder: record()')

        scriptProcessor.onaudioprocess = function(e) {
            onAudioProcess(e, cb)
        }
    }

    this.stop = function() {
        options.debug('AudioRecorder: stop()')

        if (scriptProcessor)
            scriptProcessor.onaudioprocess = undefined
    }

    this.getSampleRate = function() {
        if (getAudioContext())
            return getAudioContext().sampleRate
        else
            return -1
    }
}
