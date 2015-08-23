var h = require('hyperscript'),

    AudioRecorder   = require('./../../util/audioRecorder'),
    VideomailError  = require('./../../util/videomailError'),
    EventEmitter    = require('./../../util/eventEmitter'),
    Events          = require('./../../events')

module.exports = function(recorder, options) {

    EventEmitter.call(this, options, 'UserMedia')

    var rawVisualUserMedia = recorder && recorder.getRawVisualUserMedia(),

        self   = this,
        paused = false,
        record = false,

        audioRecorder

    if (options && options.audio && options.audio.enabled)
        audioRecorder = new AudioRecorder(this, options)

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
        if ((rawVisualUserMedia.videoWidth && rawVisualUserMedia.videoWidth < 3) ||
            (rawVisualUserMedia.height && rawVisualUserMedia.height < 3)) {
            return true
        }
    }

    this.init = function(localMediaStream, videoCallback, audioCallback, endedEarlyCallback) {

        var onPlayReached           = false,
            onLoadedMetaDataReached = false

        function fireCallbacks() {
            if (onPlayReached && onLoadedMetaDataReached) {
                videoCallback()

                if (audioRecorder && audioCallback) {
                    audioRecorder.init(localMediaStream)

                    self.on(Events.SENDING_FIRST_FRAME, function() {
                        audioRecorder.record(audioCallback)
                    })
                }
            }
        }

        function onPlay() {
            try {
                options.debug('UserMedia: onPlay()')

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
                else {
                    onPlayReached = true
                    fireCallbacks()
                }
            } catch (exc) {
                self.emit(Events.ERROR, exc)
            }
        }

        function onLoadedMetaData() {
            rawVisualUserMedia.removeEventListener &&
            rawVisualUserMedia.removeEventListener('loadedmetadata', onLoadedMetaData)

            if (!hasEnded() && !hasInvalidDimensions()) {
                options.debug('UserMedia: onLoadedMetaData()')

                self.emit(Events.LOADED_META_DATA)

                onLoadedMetaDataReached = true
                fireCallbacks()
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

            // useful list of all available user media related events
            // var EVENTS = [
            //     'audioprocess',
            //     'canplay',
            //     'canplaythrough',
            //     'durationchange',
            //     'emptied',
            //     'ended',
            //     'loadeddata',
            //     'loadedmetadata',
            //     'MozAudioAvailable',
            //     'pause',
            //     'play',
            //     'playing',
            //     'ratechange',
            //     'seeked',
            //     'seeking',
            //     'stalled',
            //     'suspend',
            //     'timeupdate',
            //     'volumechange',
            //     'waiting',
            //     'complete'
            // ]

            // EVENTS.forEach(function(eventName) {
            //     rawVisualUserMedia.addEventListener(eventName, function() {
            //         console.log('userMedia event:', eventName)
            //     }, false)
            // })

            rawVisualUserMedia.addEventListener('play',            onPlay)
            rawVisualUserMedia.addEventListener('loadedmetadata',  onLoadedMetaData)
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

            paused = record = false

            audioRecorder && audioRecorder.stop()

        } catch (exc) {
            self.emit(Events.ERROR, exc)
        }
    }

    this.createCanvas = function() {
        // it's important not to use the responsive flag here so that
        // the true pixels are being used for the image generation
        return h('canvas', {
            width:  this.getRawWidth(),
            height: this.getRawHeight()
        })
    }

    this.getVideoHeight = function() {
        return rawVisualUserMedia.videoHeight
    }

    this.getVideoWidth = function() {
        return rawVisualUserMedia.videoWidth
    }

    this.getRawWidth = function(responsive) {
        var rawWidth     = this.getVideoWidth(),
            widthDefined = options.hasDefinedWidth()

        if (widthDefined || options.hasDefinedHeight()) {
            if (!responsive && widthDefined)
                rawWidth = options.video.width
            else
                rawWidth = recorder.calculateWidth(responsive)
        }

        if (responsive)
            rawWidth = recorder.limitWidth(rawWidth)

        return rawWidth
    }

    this.getRawHeight = function(responsive) {
        var rawHeight = this.getVideoHeight()

        if (options.hasDefinedDimension())
            rawHeight = recorder.calculateHeight(responsive)

        if (responsive)
            rawHeight = recorder.limitHeight(rawHeight)

        return rawHeight
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
