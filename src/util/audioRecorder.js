var AudioSample = require('./items/audioSample')

module.exports = function(userMedia) {

    var scriptProcessor

    function getAudioContext() {
        // instantiate only once
        if (!window.audioContext)
            window.audioContext = new AudioContext()

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

    this.attach = function(localMediaStream, cb) {

        // creates an audio node from the microphone incoming stream
        var audioInput = getAudioContext().createMediaStreamSource(localMediaStream),
            volume     = getAudioContext().createGain()

        // set recording volume to max (0 .. 1)
        volume.gain.value = .9

        /*
        From the spec: This value controls how frequently the audioprocess event is
        dispatched and how many sample-frames need to be processed each call.
        Lower values for buffer size will result in a lower (better) latency.
        Higher values will be necessary to avoid audio breakup and glitches
        */
        var bufferSize = 2048 // remember it needs to be a power of two

        // Create a ScriptProcessorNode with the given bufferSize and
        // a single input and output channel
        scriptProcessor = getAudioContext().createScriptProcessor(bufferSize, 1, 1)

        scriptProcessor.onaudioprocess = function(e) {
            onAudioProcess(e, cb)
        }

        // connect stream to our scriptProcessor
        audioInput.connect(scriptProcessor)

        // connect our scriptProcessor to the previous destination
        scriptProcessor.connect(getAudioContext().destination)

        // connect volume
        audioInput.connect(volume)
        volume.connect(scriptProcessor)
    }

    this.stop = function() {
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
