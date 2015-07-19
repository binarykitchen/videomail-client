var h = require('hyperscript'),

    AudioRecorder   = require('./audioRecorder'),
    VideomailError  = require('./videomailError'),
    Events          = require('./../events')

module.exports = function(rawVisualUserMedia, options) {

    var self   = this,
        paused = false,
        record = false,

        audioRecorder

    if (options.audio.enabled)
        audioRecorder = new AudioRecorder(this)

    function attachMediaStream(stream) {
        if (typeof rawVisualUserMedia.srcObject !== 'undefined')
            rawVisualUserMedia.srcObject = stream

        else if (typeof rawVisualUserMedia.src !== 'undefined') {
            var URL = window.URL || window.webkitURL
            rawVisualUserMedia.src = URL.createObjectURL(stream) || stream

        } else
            console.error('Error attaching stream to element.')
    }

    function setVisualStream(localMediaStream) {
        if (localMediaStream)
            attachMediaStream(localMediaStream)
        else {
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

    function hasInvalidDimensions() {
        if (rawVisualUserMedia.videoWidth && rawVisualUserMedia.height) {
            if (rawVisualUserMedia.videoWidth < 3 ||
                rawVisualUserMedia.height < 3) {
                return true
            }
        }
    }

    this.init = function(localMediaStream, videoCallback, audioCallback, endedEarlyCallback) {

        function onPlay() {
            try {
                options.debug('UserMedia emits: play')

                rawVisualUserMedia.removeEventListener &&
                rawVisualUserMedia.removeEventListener('play', onPlay)

                localMediaStream.removeEventListener &&
                localMediaStream.removeEventListener('ended', onPlay)

                if (hasEnded() || hasInvalidDimensions())
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

            if (audioRecorder && audioCallback)
                audioRecorder.attach(localMediaStream, audioCallback)

            rawVisualUserMedia.addEventListener('play', onPlay)
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

            paused = record  = false

            audioRecorder && audioRecorder.stop()

        } catch (exc) {
            self.emit(Events.ERROR, exc)
        }
    }

    this.createCanvas = function() {
        return h('canvas', {
            width:  rawVisualUserMedia.width  || rawVisualUserMedia.clientWidth,
            height: rawVisualUserMedia.height || rawVisualUserMedia.clientHeight
        })
    }

    this.getRawVisuals = function() {
        return rawVisualUserMedia
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

    this.record = function() {
        record = true
    }

    this.isRecording = function() {
        return record
    }

    this.getAudioSampleRate = function() {
        if (audioRecorder)
            return audioRecorder.getSampleRate()
        else
            return -1
    }
}
