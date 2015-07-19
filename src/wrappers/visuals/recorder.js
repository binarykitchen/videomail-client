var websocket    = require('websocket-stream'),
    Frame        = require('canvas-to-buffer'),
    util         = require('util'),
    h            = require('hyperscript'),

    Events          = require('./../../events'),
    Constants       = require('./../../constants'),
    EventEmitter    = require('./../../util/eventEmitter'),
    Browser         = require('./../../util/browser'),
    Humanize        = require('./../../util/humanize'),
    UserMedia       = require('./../../util/userMedia'),
    VideomailError  = require('./../../util/videomailError')

var Recorder = function(visuals, replay, options) {

    EventEmitter.call(this, options, 'Recorder')

    // validate some options this class needs
    if (!options.video.fps)     throw VideomailError.create('FPS must be defined', options)
    if (!options.video.width)   throw VideomailError.create('Video width is too small', options)
    if (!options.video.height)  throw VideomailError.create('Video height is too small', options)

    var self            = this,
        browser         = new Browser(options),

        wantedInterval  = 1e3 / options.video.fps,
        debug           = options.debug,

        samplesCount = 0,
        framesCount  = 0,

        recorderElement,
        userMedia,

        lastAnimationTimestamp,
        userMediaTimeout,
        retryTimeout,

        intervalSum,
        bytesSum,
        framesCount,

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
        blocking,
        built,
        key

    function onAudioSample(audioSample) {
        samplesCount++
        stream && stream.write(audioSample.toBuffer())
    }

    function onUserMediaReady() {
        try {
            debug('Recorder: onUserMediaReady()')

            blocking = unloaded = submitting = false
            userMediaLoaded = true

            show()
            self.emit(Events.USER_MEDIA_READY)
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
        debug('Recorder: clearUserMediaTimeout()')

        userMediaTimeout && clearTimeout(userMediaTimeout)
        userMediaTimeout = null
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
        navigator.getUserMedia_({
            video: true,
            audio: options.audio.enabled
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

    function loadFlashWebcam() {
        debug('Recorder: loadFlashWebcam()')

        visuals.removeChild(recorderElement)

        recorderElement = h('object.' + options.selectors.userMediaClass, {
            classid:   'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
            type:      'application/x-shockwave-flash',
            data:      'jscam_canvas_only.swf',
            width:     recorderElement.width,
            height:    recorderElement.height,
            classList: recorderElement.classList
        }, h('param', {
            name:  'movie',
            value: 'scam_canvas_only.swf'
        }), h('param', {
            name:  'FlashVars',
            value: "mode='callback'&amp;quality='" + options.image.quality + "'"
        }), h('param', {
            name:  'allowScriptAccess',
            value: 'always'
        }))

        visuals.appendChild(recorderElement)

        function register(run) {

            if (recorderElement.capture !== undefined) {

                userMediaLoading = false

                if (showUserMedia()) {
                    clearUserMediaTimeout()

                    // CONTINUE ISSUE #38 FROM HERE; more see:
                    // https://github.com/addyosmani/getUserMedia.js/blob/gh-pages/lib/getUserMedia.js#L86
                    // onUserMediaReady()
                }

            } else if (run < 1)
                // Flash movie not yet registered
                userMediaErrorCallback(new Error('Flash movie not yet registered'))
            else
                // Flash interface not ready yet
                setTimeout(register, 1e3 * (4 - run), --run)
        }

        register(3)
    }

    function useFlash() {
        return options.forceFlash || !navigator.getUserMedia_
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

            if (useFlash())
                loadFlashWebcam()
            else
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
        key = args.key

        if (args.mp4)
            replay.setMp4Source(args.mp4 + Constants.SITE_NAME_LABEL + '/' + options.siteName)

        if (args.webm)
            replay.setWebMSource(args.webm + Constants.SITE_NAME_LABEL + '/' + options.siteName)

        self.hide()
        self.emit(Events.PREVIEW, key)

        if (options.debug) {
            var waitingTime = Date.now() - stopTime

            debug(
                'While recording, %s have been transferred and waiting time was %s',
                Humanize.filesize(bytesSum, 2),
                Humanize.toTime(waitingTime)
            )
        }
    }

    function updateFrameProgress(args) {
        frameProgress = ((args.frame / framesCount) * 100).toFixed(2) + '%'
        updateOverallProgress()
    }

    function updateSampleProgress(args) {
        sampleProgress = ((args.sample / samplesCount) * 100).toFixed(2) + '%'
        updateOverallProgress()
    }

    function updateOverallProgress() {
        self.emit(Events.PROGRESS, frameProgress, sampleProgress)
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

    function writeCommand(command, args, cb) {
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

            stream.write(new Buffer(JSON.stringify(command)))

            cb && cb()
        }
    }

    function isNotifying() {
        return visuals.isNotifying()
    }

    function initSocket(cb) {
        if (!connected) {

            debug('Recorder: initialising web socket to %s', options.socketUrl)

            // https://github.com/maxogden/websocket-stream#binary-sockets

            // we use query parameters here because we cannot set custom headers in web sockets,
            // see https://github.com/websockets/ws/issues/467
            stream = websocket(
                options.socketUrl +
                '?' +
                encodeURIComponent(Constants.SITE_NAME_LABEL) +
                '=' +
                encodeURIComponent(options.siteName)
            )

            // useful for debugging streams

            // if (!stream.originalEmit)
            //     stream.originalEmit = stream.emit

            // stream.emit = function(type) {
            //     if (stream) {
            //         debug(type)
            //         var args = [].splice.call(arguments, 0)
            //         return stream.originalEmit.apply(stream, args)
            //     }
            // }

            stream.on('close', function(err) {
                debug('x Stream has closed')
                connected = false

                if (err)
                    self.emit(Events.ERROR, err ? err : 'Unhandled websocket error')
            })

            stream.on('connect', function() {
                if (!connected) {
                    connected = true
                    unloaded  = false

                    self.emit(Events.CONNECTED)

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

        if (options.audio.enabled) {
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

        writeCommand('back', null, cb)
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

            samplesCount = framesCount = 0

            userMediaLoaded =
            key =
            canvas =
            ctx =
            sampleProgress =
            frameProgress = null
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
        return userMedia.isPaused()
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

        debug('Recorder: record()')

        self.emit(Events.RECORDING, framesCount)

        canvas = userMedia.createCanvas()
        ctx    = canvas.getContext('2d')

        avgFps   = null
        bytesSum = intervalSum = 0
        lastAnimationTimestamp = Date.now()

        var intervalThreshold = wantedInterval * .85, // allow 15% below fps (can't be too strict)
            frame             = new Frame(canvas, options),

            interval,
            now,
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

                        intervalSum += interval

                        // ctx might become null when unloading
                        ctx && ctx.drawImage(userMedia.getRawVisuals(), 0, 0, canvas.width, canvas.height)

                        buffer = frame.toBuffer()

                        // stream might become null while unloading
                        if (stream) {
                            framesCount++

                            stream.write(buffer)

                            bytesSum += buffer.length

                            if (framesCount === 1)
                                self.emit(Events.FIRST_FRAME_SENT)
                        }

                        /*
                        if (options.debug) {
                            debug(
                                'Frame #' + framesCount + ' (' + buffer.length + ' bytes):',
                                interval + '/' + intervalThreshold + '/' + wantedInterval
                            )
                        }
                        */
                    }
                }
            } catch (exc) {
                self.emit(Events.ERROR, exc)
            }
        }

        userMedia.record()

        rafId = window.requestAnimationFrame(draw)
    }

    function buildElement() {
        recorderElement =  h('video.' + options.selectors.userMediaClass)
        visuals.appendChild(recorderElement)
    }

    function show() {
        recorderElement.classList.remove('hide')
    }

    function initEvents() {
        self.on(Events.SUBMITTING, function() {
            submitting = true
        })

        self.on(Events.SUBMITTED, function() {
            submitting = false
            self.unload()
        })

        self.on(Events.BLOCKING, function() {
            blocking = true
            clearUserMediaTimeout()
        })

        self.on(Events.HIDE, function() {
            self.hide()
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

            if (!recorderElement.width && options.video.width)
                recorderElement.width = options.video.width

            if (!recorderElement.height && options.video.height)
                recorderElement.height = options.video.height

            if (options.audio.enabled) {
                // prevent audio feedback, see
                // https://github.com/binarykitchen/videomail-client/issues/35
                recorderElement.muted = true
            }

            userMedia = new UserMedia(recorderElement, options)

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
        return userMedia.isPaused()
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
}

util.inherits(Recorder, EventEmitter)

module.exports = Recorder
