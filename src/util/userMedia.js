var h = require('hyperscript'),

    AudioSample     = require('./items/sample'),
    VideomailError  = require('./videomailError'),
    Events          = require('./../events'),

    audioContext

module.exports = function(rawVisualUserMedia, options) {

    var self            = this,
        recordAudio     = false,
        paused          = false,
        recorder

    function initAudio(localMediaStream, audioCallback) {

        // instantiate only once
        if (!audioContext)
            audioContext = new AudioContext()

        // creates an audio node from the microphone incoming stream
        var audioInput = audioContext.createMediaStreamSource(localMediaStream),
            volume     = audioContext.createGain()

        // set recording volume to max (0 .. 1)
        volume.gain.value = .9

        /*
        From the spec: This value controls how frequently the audioprocess event is
        dispatched and how many sample-frames need to be processed each call.
        Lower values for buffer size will result in a lower (better) latency.
        Higher values will be necessary to avoid audio breakup and glitches
        */
        var bufferSize = 2048 // remember it needs to be a power of two

        // Create a ScriptProcessorNode with the given bufferSize and a single input and output channel
        recorder = audioContext.createScriptProcessor(bufferSize, 1, 1)

        recorder.onaudioprocess = function(e) {
            if (!recordAudio|| paused)
                return

            // Returns a Float32Array containing the PCM data associated with the channel,
            // defined by the channel parameter (with 0 representing the first channel)
            var float32Array = e.inputBuffer.getChannelData(0)
            audioCallback(new AudioSample(float32Array))
        }

        // connect stream to our recorder
        audioInput.connect(recorder)

        // connect our recorder to the previous destination
        recorder.connect(audioContext.destination)

        // connect volume
        audioInput.connect(volume)
        volume.connect(recorder)
    }

    function setVisualStream(localMediaStream) {
        if (localMediaStream) {
            rawVisualUserMedia.srcObject = localMediaStream
            rawVisualUserMedia.src =    (window.URL && window.URL.createObjectURL(localMediaStream)) ||
                                        localMediaStream
        } else {
            rawVisualUserMedia.srcObject = null
            rawVisualUserMedia.removeAttribute('src')
        }
    }

    function getVisualStream() {
        return  rawVisualUserMedia.mozSrcObject ?
                rawVisualUserMedia.mozSrcObject :
                rawVisualUserMedia.srcObject
    }

    function hasEnded() {
        var visualStream = getVisualStream()
        return visualStream && visualStream.ended
    }

    this.init = function(localMediaStream, videoCallback, audioCallback, endedEarlyCallback) {

        function onPlaying() {
            try {
                options.debug('UserMedia emits: playing')

                rawVisualUserMedia.removeEventListener &&
                rawVisualUserMedia.removeEventListener('playing', onPlaying)

                localMediaStream.removeEventListener &&
                localMediaStream.removeEventListener('ended', onPlaying)

                if (hasEnded())
                    endedEarlyCallback(
                        VideomailError.create(
                            'Already busy',
                            'Probably another browser window is using your webcam?',
                            options
                        )
                    )
                else
                    videoCallback()
            } catch (exc) {
                self.emit(Events.ERROR, exc)
            }
        }

        try {
            var videoTrack, videoTracks

            if (localMediaStream.getVideoTracks) {
                videoTracks = localMediaStream.getVideoTracks()
                videoTrack  = videoTracks[0]
            }

            if (!videoTrack)
                options.debug('UserMedia: detected (but no video tracks exist')
            else {
                var description

                if (videoTrack.label && videoTrack.label.length > 0)
                    description = videoTracks.label
                else
                    description = videoTrack.kind

                options.debug('UserMedia: detected', description ? description : '')
            }

            setVisualStream(localMediaStream)

            options.audio.enabled &&
            audioCallback &&
            initAudio(localMediaStream, audioCallback)

            rawVisualUserMedia.addEventListener('playing', onPlaying)
            rawVisualUserMedia.play()
        } catch (exc) {
            self.emit(Events.ERROR, exc)
        }
    }

    this.isReady = function() {
        return !!rawVisualUserMedia.src
    }

    this.stop = function() {
        try {
            var visualStream = getVisualStream()

            if (visualStream) {
                visualStream.stop && visualStream.stop()

                setVisualStream(null)
            }

            paused = recordAudio  = false

            if (recorder)
                recorder.onaudioprocess = undefined
        } catch (exc) {
            self.emit(Events.ERROR, exc)
        }
    }

    this.pause = function() {
        paused = true
    }

    this.isPaused = function() {
        return paused
    }

    this.resume = function() {
        paused = false
    }

    this.getRawVisuals = function() {
        return rawVisualUserMedia
    }

    this.createCanvas = function() {
        return h('canvas', {
            width:  rawVisualUserMedia.width  || rawVisualUserMedia.clientWidth,
            height: rawVisualUserMedia.height || rawVisualUserMedia.clientHeight
        })
    }

    this.recordAudio = function() {
        recordAudio = true
    }

    this.getAudioSampleRate = function() {
        return audioContext.sampleRate
    }
}
