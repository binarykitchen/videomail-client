const   h = require('hyperscript'),

        AudioRecorder   = require('./../../util/audioRecorder'),
        VideomailError  = require('./../../util/videomailError'),
        EventEmitter    = require('./../../util/eventEmitter'),
        Events          = require('./../../events')

module.exports = function(recorder, options) {

    EventEmitter.call(this, options, 'UserMedia')

    const rawVisualUserMedia = recorder && recorder.getRawVisualUserMedia(),
          self   = this

    var paused = false,
        record = false,

        audioRecorder,
        currentVisualStream

    function attachMediaStream(stream) {
        currentVisualStream = stream

        if (typeof rawVisualUserMedia.srcObject !== 'undefined')
            rawVisualUserMedia.srcObject = stream

        else if (typeof rawVisualUserMedia.src !== 'undefined') {
            const URL = window.URL || window.webkitURL
            rawVisualUserMedia.src = URL.createObjectURL(stream) || stream

        } else
            throw VideomailError.create('Error attaching stream to element.')
    }

    function setVisualStream(localMediaStream) {
        if (localMediaStream)
            attachMediaStream(localMediaStream)
        else {
            rawVisualUserMedia.removeAttribute('srcObject')
            rawVisualUserMedia.removeAttribute('src')

            currentVisualStream = null
        }
    }

    function getVisualStream() {
        if (rawVisualUserMedia.mozSrcObject)
            return rawVisualUserMedia.mozSrcObject

        else if (rawVisualUserMedia.srcObject)
            return rawVisualUserMedia.srcObject

        else
            return currentVisualStream
    }

    function hasEnded() {
        if (rawVisualUserMedia.ended)
            return rawVisualUserMedia.ended
        else {
            const visualStream = getVisualStream()
            return visualStream && visualStream.ended
        }
    }

    function hasInvalidDimensions() {
        if ((rawVisualUserMedia.videoWidth && rawVisualUserMedia.videoWidth < 3) ||
            (rawVisualUserMedia.height && rawVisualUserMedia.height < 3)) {
            return true
        }
    }

    function getTracks(localMediaStream) {
        var tracks

        if (localMediaStream && localMediaStream.getTracks)
            tracks = localMediaStream.getTracks()

        return tracks
    }

    function getVideoTracks(localMediaStream) {
        var videoTracks

        if (localMediaStream && localMediaStream.getVideoTracks)
            videoTracks = localMediaStream.getVideoTracks()

        return videoTracks
    }

    function getFirstVideoTrack(localMediaStream) {
        const videoTracks = getVideoTracks(localMediaStream)
        var videoTrack

        if (videoTracks && videoTracks[0])
            videoTrack = videoTracks[0]

        return videoTrack
    }

    this.init = function(localMediaStream, videoCallback, audioCallback, endedEarlyCallback) {

        this.stop(localMediaStream, true)

        var onPlayReached           = false,
            onLoadedMetaDataReached = false

        if (options && options.isAudioEnabled())
            audioRecorder = audioRecorder || new AudioRecorder(this, options)

        function audioRecord() {
            self.removeListener(Events.SENDING_FIRST_FRAME, audioRecord)
            audioRecorder && audioRecorder.record(audioCallback)
        }

        function fireCallbacks() {
            options.debug(
                'UserMedia: fireCallbacks(' +
                'onPlayReached=' + onPlayReached + ', ' +
                'onLoadedMetaDataReached=' + onLoadedMetaDataReached + ')'
            )

            if (onPlayReached && onLoadedMetaDataReached) {
                videoCallback()

                if (audioRecorder && audioCallback) {
                    try {
                        audioRecorder.init(localMediaStream)
                    } catch (exc) {
                        self.emit(Events.ERROR, exc)
                    }

                    self.on(Events.SENDING_FIRST_FRAME, audioRecord)
                }
            }
        }

        function onPlay() {
            try {
                options.debug('UserMedia: ... play', 'audio =', options.isAudioEnabled())

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

        // player modifications to perform that must wait until `loadedmetadata` has been triggered
        function onLoadedMetaData() {
            rawVisualUserMedia.removeEventListener &&
            rawVisualUserMedia.removeEventListener('loadedmetadata', onLoadedMetaData)

            if (!hasEnded() && !hasInvalidDimensions()) {
                options.debug('UserMedia: ... loadedmetadata')

                self.emit(Events.LOADED_META_DATA)

                // for android devices, we cannot call play() unless meta data has been loaded!
                rawVisualUserMedia.play()

                onLoadedMetaDataReached = true
                fireCallbacks()
            }
        }

        // not really needed, just an useful listener for debugging
        // function onCanPlayThrough() {
        //     rawVisualUserMedia.removeEventListener &&
        //     rawVisualUserMedia.removeEventListener('canplaythrough', onCanPlayThrough)
        //
        //     options.debug('UserMedia: onCanPlayThrough()')
        //
        //     if (hasInvalidDimensions()) {
        //         options.debug('UserMedia: still invalid')
        //     }
        // }

        try {
            const videoTrack = getFirstVideoTrack(localMediaStream)

            if (!videoTrack)
                options.debug('UserMedia: detected (but no video tracks exist')
            else {
                var description

                if (videoTrack.label && videoTrack.label.length > 0)
                    description = videoTrack.label
                else
                    description = videoTrack.kind

                options.debug('UserMedia: detected', description ? description : '')
            }

            // very useful i think, so leave this and just use options.debug()
            const heavyDebugging = true

            if (heavyDebugging) {
                // useful list of all available user media related events
                const EVENTS = [
                    'audioprocess',
                    'canplay',
                    'canplaythrough',
                    'dispose',
                    'durationchange',
                    'emptied',
                    'ended',
                    'loadeddata',
                    'pause',
                    'playing',
                    'ratechange',
                    'seeked',
                    'seeking',
                    'stalled',
                    'suspend',
                    // 'timeupdate', // commented out, happens too often
                    'volumechange',
                    'waiting',
                    'complete'
                ]

                const outputEvent = function(e) {
                    options.debug('UserMedia: ... event', e.type)

                    // remove myself
                    rawVisualUserMedia.removeEventListener &&
                    rawVisualUserMedia.removeEventListener(e.type, outputEvent)
                }

                EVENTS.forEach(function(eventName) {
                    rawVisualUserMedia.addEventListener(eventName, outputEvent, false)
                })
            }

            // rawVisualUserMedia.addEventListener('canplaythrough',  onCanPlayThrough)
            rawVisualUserMedia.addEventListener('loadedmetadata',  onLoadedMetaData)
            rawVisualUserMedia.addEventListener('play',            onPlay)

            // experimental, not sure if this is ever needed/called? since 2 apr 2017
            rawVisualUserMedia.addEventListener('error', function(err) {
                self.emit(Events.ERROR, VideomailError.create(
                    'User Media Error',
                    err.toString(),
                    options
                ))
            })

            setVisualStream(localMediaStream)

            rawVisualUserMedia.play()
        } catch (exc) {
            self.emit(Events.ERROR, exc)
        }
    }

    this.isReady = function() {
        return !!rawVisualUserMedia.src
    }

    this.stop = function(visualStream, aboutToInitialize) {
        try {
            // do not stop "too much" when going to initialize anyway
            if (!aboutToInitialize) {
                if (!visualStream)
                    visualStream = getVisualStream()

                const tracks = getTracks(visualStream)

                if (tracks)
                    tracks.forEach(function(track) {
                        track.stop()
                    })

                // will probably become obsolete in one year (after june 2017)
                visualStream && visualStream.stop && visualStream.stop()

                setVisualStream(null)

                audioRecorder && audioRecorder.stop()

                audioRecorder = null
            }

            paused = record = false

        } catch (exc) {
            self.emit(Events.ERROR, exc)
        }
    }

    this.createCanvas = function() {
        return h('canvas', {
            width:  this.getRawWidth(true),
            height: this.getRawHeight(true)
        })
    }

    this.getVideoHeight = function() {
        return rawVisualUserMedia.videoHeight
    }

    this.getVideoWidth = function() {
        return rawVisualUserMedia.videoWidth
    }

    this.getRawWidth = function(responsive) {
        var rawWidth = this.getVideoWidth()
        const widthDefined = options.hasDefinedWidth()

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
        var rawHeight

        if (options.hasDefinedDimension()) {
            rawHeight = recorder.calculateHeight(responsive)

            if (rawHeight < 1)
                throw VideomailError.create('Calculated raw height cannot be less than 1!')
        } else {
            rawHeight =  this.getVideoHeight()

            if (rawHeight < 1)
                throw VideomailError.create('Raw video height from DOM element cannot be less than 1!')
        }

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
