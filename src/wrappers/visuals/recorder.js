var websocket    = require('websocket-stream'),
    Frame        = require('canvas-to-buffer'),
    util         = require('util'),
    h            = require('hyperscript'),

    UserMedia = require('./userMedia'),

    Events          = require('./../../events'),
    Constants       = require('./../../constants'),
    EventEmitter    = require('./../../util/eventEmitter'),
    Browser         = require('./../../util/browser'),
    Humanize        = require('./../../util/humanize'),
    VideomailError  = require('./../../util/videomailError')

var Recorder = function(visuals, replay, options) {

    EventEmitter.call(this, options, 'Recorder')

    // validate some options this class needs
    if (!options || !options.video || !options.video.fps)
        throw VideomailError.create('FPS must be defined', options)

    var self            = this,
        browser         = new Browser(options),

        wantedInterval  = 1e3 / options.video.fps,
        debug           = options.debug,

        samplesCount = 0,
        framesCount  = 0,

        confirmedFrameNumber = 0,
        confirmedSampleNumber = 0,

        recorderElement,
        userMedia,

        lastAnimationTimestamp,
        userMediaTimeout,
        retryTimeout,

        intervalSum,
        bytesSum,

        frameProgress,
        sampleProgress,

        canvas,
        ctx,
        rafId,

        userMediaLoaded,
        userMediaLoading,
        avgFps,
        submitting,
        unloaded,
        stopTime,
        stream,
        connected,
        reconnectAfterLongPause,
        blocking,
        built,
        key

    function onAudioSample(audioSample) {
        samplesCount++

        var audioBuffer = audioSample.toBuffer()

        // if (options.verbose) {
        //     debug(
        //         'Sample #' + samplesCount + ' (' + audioBuffer.length + ' bytes):'
        //     )
        // }

        writeStream(audioBuffer)
    }

    function onUserMediaReady() {
        try {
            debug('Recorder: onUserMediaReady()')

            blocking = unloaded = submitting = false
            userMediaLoaded = true

            show()
            self.emit(Events.USER_MEDIA_READY, {reconnectAfterLongPause: reconnectAfterLongPause})

            reconnectAfterLongPause = false
        } catch (exc) {
            self.emit(Events.ERROR, exc)
        }
    }

    function clearRetryTimeout() {
        debug('Recorder: clearRetryTimeout()')

        retryTimeout && clearTimeout(retryTimeout)
        retryTimeout = null
    }

    function clearUserMediaTimeout() {
        if (userMediaTimeout) {
            debug('Recorder: clearUserMediaTimeout()')

            userMediaTimeout && clearTimeout(userMediaTimeout)
            userMediaTimeout = null
        }
    }

    function userMediaErrorCallback(err) {
        userMediaLoading = false

        clearUserMediaTimeout()

        var errorListeners = self.listeners(Events.ERROR)

        if (errorListeners.length) {
            self.emit(Events.ERROR, err)

            // retry after a while
            retryTimeout = setTimeout(initSocket, options.timeouts.userMedia)
        } else {
            debug('Recorder: no error listeners attached but throwing error', err)

            // weird situation, throw it since there are no error listeners yet
            throw err
        }
    }

    function showUserMedia() {
        return !isHidden() || blocking
    }

    function loadGenuineUserMedia() {
        if (!navigator)
            throw new Error('Navigator is missing!')

        navigator.getUserMedia_({
            video: true,
            audio: options.isAudioEnabled()
        }, function(localStream) {

            userMediaLoading = false

            if (showUserMedia()) {
                try {
                    clearUserMediaTimeout()

                    userMedia.init(
                        localStream,
                        onUserMediaReady.bind(self),
                        onAudioSample.bind(self),
                        function(err) {
                            self.emit(Events.ERROR, err)
                        }
                    )
                } catch (exc) {
                    self.emit(Events.ERROR, exc)
                }
            }

        }, userMediaErrorCallback)
    }

    function loadUserMedia() {

        if (userMediaLoaded) {
            debug('Recorder: skipping loadUserMedia() because it is already loaded')
            onUserMediaReady()
            return false
        } else if (userMediaLoading) {
            debug('Recorder: skipping loadUserMedia() because it is already asking for permission')
            return false
        }

        debug('Recorder: loadUserMedia()')

        try {
            userMediaTimeout = setTimeout(function() {
                if (!self.isReady())
                    self.emit(Events.ERROR, browser.getNoAccessIssue())
            }, options.timeouts.userMedia)

            userMediaLoading = true

            loadGenuineUserMedia()

        } catch (exc) {
            userMediaLoading = false

            var errorListeners = self.listeners(Events.ERROR)

            if (errorListeners.length)
                self.emit(Events.ERROR, exc)
            else {
                debug('Recorder: no error listeners attached but throwing exception', exc)
                throw exc // throw it further
            }
        }
    }

    function isHidden() {
        return !recorderElement || recorderElement.classList.contains('hide')
    }

    function preview(args) {
        confirmedFrameNumber =
        confirmedSampleNumber =
        samplesCount =
        framesCount = 0

        sampleProgress =
        frameProgress = null

        key = args.key

        if (args.mp4)
            replay.setMp4Source(args.mp4 + Constants.SITE_NAME_LABEL + '/' + options.siteName)

        if (args.webm)
            replay.setWebMSource(args.webm + Constants.SITE_NAME_LABEL + '/' + options.siteName)

        self.hide()
        self.emit(Events.PREVIEW, key, self.getRecorderWidth(true), self.getRecorderHeight(true))

        if (options.debug) {
            var waitingTime = Date.now() - stopTime

            debug(
                'While recording, %s have been transferred and waiting time was %s',
                Humanize.filesize(bytesSum, 2),
                Humanize.toTime(waitingTime)
            )
        }
    }

    function calculateFrameProgress() {
        return (confirmedFrameNumber / (framesCount || 1) * 100).toFixed(2) + '%'
    }

    function calculateSampleProgress() {
        return (confirmedSampleNumber / (samplesCount || 1) * 100).toFixed(2) + '%'
    }

    function updateFrameProgress(args) {
        confirmedFrameNumber = args.frame ? args.frame : confirmedFrameNumber

        frameProgress = calculateFrameProgress()

        updateOverallProgress()
    }

    function updateSampleProgress(args) {
        confirmedSampleNumber = args.sample ? args.sample : confirmedSampleNumber

        sampleProgress = calculateSampleProgress()

        updateOverallProgress()
    }

    function updateOverallProgress() {
        // when progresses aren't initialized,
        // then do a first calculation to avoid `infinite` or `null` displays

        if (!frameProgress)
            frameProgress = calculateFrameProgress()

        if (!sampleProgress)
            sampleProgress = calculateSampleProgress()

        self.emit(
            Events.PROGRESS,
            frameProgress,
            sampleProgress
        )
    }

    function executeCommand(data) {
        try {
            var command = JSON.parse(data.toString()),
                result

            debug(
                'Server commanded: %s',
                command.command,
                command.args ? ', ' + JSON.stringify(command.args) : '',
                result       ? '= ' + result : ''
            )

            switch (command.command) {
                case 'ready':
                    if (!userMediaTimeout)
                        loadUserMedia()
                    break
                case 'preview':
                    preview(command.args)
                    break
                case 'error':
                    this.emit(Events.ERROR, VideomailError.create(
                        'Oh no, server error!',
                        command.args.err.toString() || '(No explanation given)',
                        options
                    ))
                    break
                case 'confirmFrame':
                    result = updateFrameProgress(command.args)
                    break
                case 'confirmSample':
                    result = updateSampleProgress(command.args)
                    break
                case 'beginAudioEncoding':
                    this.emit(Events.BEGIN_AUDIO_ENCODING)
                    break
                case 'beginVideoEncoding':
                    this.emit(Events.BEGIN_VIDEO_ENCODING)
                    break
                default:
                    this.emit(Events.ERROR, 'Unknown server command: ' + command.command)
                    break
            }
        } catch (exc) {
            self.emit(Events.ERROR, exc)
        }
    }

    function writeStream(buffer) {
        if (stream) {
            if (stream.destroyed)
                self.emit(Events.ERROR, VideomailError.create(
                    'Already disconnected.',
                    'Sorry, the connection to the server has been destroyed. Please reload.',
                    options
                ))
            else
                stream.write(buffer)
        }
    }

    function writeCommand(command, args, cb) {
        if (!cb && args && args.constructor === Function) {
            cb   = args
            args = null
        }

        if (!connected) {
            debug('Reconnecting for the command', command, '…')

            initSocket(function() {
                writeCommand(command, args)
                cb && cb()
            })
        } else if (stream) {
            debug('$ %s', command, args ? JSON.stringify(args) : '')

            var command = {
                command:    command,
                args:       args
            }

            writeStream(new Buffer(JSON.stringify(command)))

            cb && cb()
        }
    }

    function isNotifying() {
        return visuals.isNotifying()
    }

    function initSocket(subOptions, cb) {

        if (!cb && typeof subOptions === 'function') {
            cb = subOptions
            subOptions = {}
        } else if (!subOptions)
            subOptions = {}

        if (!connected) {

            debug('Recorder: initialising web socket to %s', options.socketUrl)

            // https://github.com/maxogden/websocket-stream#binary-sockets

            // we use query parameters here because we cannot set custom headers in web sockets,
            // see https://github.com/websockets/ws/issues/467

            try {
                stream = websocket(
                    options.socketUrl +
                    '?' +
                    encodeURIComponent(Constants.SITE_NAME_LABEL) +
                    '=' +
                    encodeURIComponent(options.siteName)
                )
            } catch (exc) {
                connected = false

                var err = VideomailError.create(
                    'Failed to create websocket',
                    exc.toString(),
                    options
                )

                self.emit(Events.ERROR, err)
            }

            // useful for debugging streams

            // if (!stream.originalEmit)
            //     stream.originalEmit = stream.emit

            // stream.emit = function(type) {
            //     if (stream) {
            //         debug('Websocket stream emitted:', type)
            //         var args = Array.prototype.slice.call(arguments, 0)
            //         return stream.originalEmit.apply(stream, args)
            //     }
            // }

            if (stream) {

                stream.on('close', function(err) {
                    debug('x Stream has closed')

                    connected = false

                    if (!err && self.isPaused()) {
                        initSocket({reconnectAfterLongPause: true})

                        // err = VideomailError.create(
                        //     'Pause was too long.',
                        //     'Sorry, please try again and do not pause too long otherwise connection closes.',
                        //     options
                        // )
                    }

                    if (err)
                        self.emit(Events.ERROR, err ? err : 'Unhandled websocket error')
                })

                stream.on('connect', function() {
                    if (!connected) {
                        connected = true
                        unloaded  = false

                        if (subOptions && subOptions.reconnectAfterLongPause)
                            reconnectAfterLongPause = true

                        self.emit(Events.CONNECTED)

                        debug('Asking for webcam permissons now.')

                        cb && cb()
                    }
                })

                stream.on('data', function(data) {
                    executeCommand.call(self, data)
                })

                stream.on('error', function(err) {
                    connected = false
                    self.emit(Events.ERROR, err)
                })
            }
        }
    }

    function disconnect() {
        if (connected) {
            debug('Recorder: disconnect()')

            if (submitting)
                // server will disconnect socket automatically after submitting
                connected = false

            else if (stream) {
                // force to disconnect socket right now to clean temp files on server
                stream.end()
                stream = undefined
            }
        }
    }

    function cancelAnimationFrame() {
        rafId && window.cancelAnimationFrame && window.cancelAnimationFrame(rafId)
        rafId = null
    }

    this.getAvgFps = function() {
        return avgFps
    }

    this.getAudioSampleRate = function() {
        return userMedia.getAudioSampleRate()
    }

    this.stop = function(limitReached) {
        debug('stop()')

        this.emit(Events.STOPPING, limitReached)

        stopTime = Date.now()

        avgFps = 1000 / (intervalSum / framesCount)

        var args = {
            framesCount:  framesCount,
            videoType:    replay.getVideoType(),
            avgFps:       avgFps,
            limitReached: limitReached
        }

        if (options.isAudioEnabled()) {
            args.samplesCount = samplesCount
            args.sampleRate   = userMedia.getAudioSampleRate()
        }

        writeCommand('stop', args)

        // beware, resetting will set framesCount to zero, so leave this here
        this.reset()
    }

    this.back = function(cb) {
        show()
        this.reset()

        writeCommand('back', cb)
    }

    function reInitialiseAudio() {
        clearUserMediaTimeout()

        // important to free memory
        userMedia && userMedia.stop()

        userMediaLoaded = key = canvas = ctx = null

        loadUserMedia()
    }

    this.unload = function(e) {
        if (!unloaded) {
            var cause

            if (e)
                cause = e.name || e.statusText || e.toString()

            debug('Recorder: unload()' + (cause ? ', cause: ' + cause : ''))

            this.reset()

            clearUserMediaTimeout()

            disconnect()

            unloaded = true

            built = false
        }
    }

    this.reset = function() {
        // no need to reset when already unloaded
        if (!unloaded) {
            debug('Recorder: reset()')

            this.emit(Events.RESETTING)

            cancelAnimationFrame()

            replay.reset()

            // important to free memory
            userMedia && userMedia.stop()

            userMediaLoaded = key = canvas = ctx = null
        }
    }

    this.validate = function() {
        return connected && framesCount > 0 && canvas === null
    }

    this.isReady = function() {
        return userMedia.isReady()
    }

    this.pause = function(e) {
        debug('pause()', e ? e : '<button press>')

        userMedia.pause()

        this.emit(Events.PAUSED)
    }

    this.isPaused = function() {
        return userMedia && userMedia.isPaused()
    }

    this.resume = function() {
        debug('Recorder: resume()')

        this.emit(Events.RESUMING)

        lastAnimationTimestamp = Date.now()
        userMedia.resume()
    }

    this.record = function() {
        if (unloaded)
            return false

        // reconnect when needed
        if (!connected) {
            debug('Recorder: reconnecting before recording ...')

            initSocket(function() {
                self.once(Events.USER_MEDIA_READY, self.record)
            })

            return false
        }

        canvas = userMedia.createCanvas()
        ctx    = canvas.getContext('2d')

        if (!canvas.width)
            throw VideomailError.create('Canvas has an invalid width.')

        if (!canvas.height)
            throw VideomailError.create('Canvas has an invalid height.')

        avgFps   = null
        bytesSum = intervalSum = 0
        lastAnimationTimestamp = Date.now()

        var intervalThreshold = wantedInterval * .86, // allow 15% below fps (can't be too strict)
            frame             = new Frame(canvas, options),

            interval,
            now,
            bufferLength,
            buffer

        function calcInterval(now) {
            return now - lastAnimationTimestamp
        }

        function draw() {
            try {
                rafId = window.requestAnimationFrame(draw)

                if (!self.isPaused()) {

                    now      = Date.now()
                    interval = calcInterval(now)

                    if (interval > intervalThreshold) {

                        // see: http://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/
                        lastAnimationTimestamp = now - (interval % intervalThreshold)

                        if (framesCount === 0 && stream)
                            self.emit(Events.SENDING_FIRST_FRAME)

                        // ctx might become null when unloading
                        ctx && ctx.drawImage(
                            userMedia.getRawVisuals(),
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        )

                        buffer       = frame.toBuffer()
                        bufferLength = buffer.length

                        if (bufferLength < 1)
                            throw VideomailError.create('Failed to extract webcam data.')

                        // stream might become null while unloading
                        if (stream) {
                            framesCount++

                            writeStream(buffer)

                            if (framesCount === 1)
                                self.emit(Events.FIRST_FRAME_SENT)

                            bytesSum += bufferLength
                        }

                        // if (options.verbose) {
                        //     debug(
                        //         'Frame #' + framesCount + ' (' + bufferLength + ' bytes):',
                        //         interval + '/' + intervalThreshold + '/' + wantedInterval
                        //     )
                        // }

                        intervalSum += interval
                    }
                }
            } catch (exc) {
                self.emit(Events.ERROR, exc)
            }
        }

        debug('Recorder: record()')

        userMedia.record()
        self.emit(Events.RECORDING, framesCount)

        draw()
    }

    function buildElement() {
        recorderElement =  h('video.' + options.selectors.userMediaClass)
        visuals.appendChild(recorderElement)
    }

    function show() {
        recorderElement.classList.remove('hide')
    }

    function correctDimensions() {
        if (options.hasDefinedWidth())
            recorderElement.width = self.getRecorderWidth(true)

        if (options.hasDefinedHeight())
            recorderElement.height = self.getRecorderHeight(true)
    }

    function initEvents() {
        self
            .on(Events.SUBMITTING, function() {
                submitting = true
            })
            .on(Events.SUBMITTED, function() {
                submitting = false
                self.unload()
            })
            .on(Events.BLOCKING, function() {
                blocking = true
                clearUserMediaTimeout()
            })
            .on(Events.HIDE, function() {
                self.hide()
            })
            .on(Events.LOADED_META_DATA, function() {
                correctDimensions()
            })
            .on(Events.DISABLING_AUDIO, function() {
                reInitialiseAudio()
            })
            .on(Events.ENABLING_AUDIO, function() {
                reInitialiseAudio()
            })
    }

    this.build = function() {
        var err = browser.checkRecordingCapabilities()

        if (!err)
            err = browser.checkBufferTypes()

        if (err)
            this.emit(Events.ERROR, err)

        else {
            recorderElement = visuals.querySelector('video.' + options.selectors.userMediaClass)

            if (!recorderElement)
                buildElement()

            correctDimensions()

            // prevent audio feedback, see
            // https://github.com/binarykitchen/videomail-client/issues/35
            recorderElement.muted = true

            userMedia = new UserMedia(this, options)

            show()

            if (!built) {
                initEvents()

                if (!connected)
                    initSocket()
                else
                    loadUserMedia()
            } else
                loadUserMedia()

            built = true
        }
    }

    this.isPaused = function() {
        return userMedia && userMedia.isPaused()
    }

    this.isRecording = function() {
        return !!rafId && !this.isPaused() && !isNotifying()
    }

    this.hide = function() {
        if (!isHidden()) {

            recorderElement && recorderElement.classList.add('hide')

            clearUserMediaTimeout()
            clearRetryTimeout()
        }
    }

    this.isUnloaded = function() {
        return unloaded
    }

    // these two return the true dimensions of the webcam area.
    // needed because on mobiles they might be different.

    this.getRecorderWidth = function(responsive) {
        if (userMedia)
            return userMedia.getRawWidth(responsive)

        else if (responsive && options.hasDefinedWidth())
            return this.limitWidth(options.video.width)
    }

    this.getRecorderHeight = function(responsive) {
        if (userMedia)
            return userMedia.getRawHeight(responsive)

        else if (responsive && options.hasDefinedHeight())
            return this.calculateHeight(responsive)
    }

    function getRatio() {
        var ratio

        if (userMedia)
            ratio = userMedia.getVideoHeight() / userMedia.getVideoWidth()
        else
            ratio = options.getRatio()

        return ratio
    }

    this.calculateWidth = function(responsive) {
        return visuals.calculateWidth({
            responsive:  responsive,
            ratio:       getRatio(),
            videoHeight: userMedia && userMedia.getVideoHeight()
        })
    }

    this.calculateHeight = function(responsive) {
        return visuals.calculateHeight({
            responsive: responsive,
            ratio:      getRatio(),
            videoWidth: userMedia && userMedia.getVideoWidth()
        })
    }

    this.getRawVisualUserMedia = function() {
        return recorderElement
    }

    this.isConnected = function() {
        return connected
    }

    this.limitWidth  = function(width) {
        return visuals.limitWidth(width)
    }

    this.limitHeight  = function(height) {
        return visuals.limitHeight(height)
    }
}

util.inherits(Recorder, EventEmitter)

module.exports = Recorder
