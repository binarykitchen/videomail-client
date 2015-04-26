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

        recorderElement,
        userMedia,

        lastAnimationTimestamp,
        userMediaTimeout,

        intervalSum,
        bytesSum,
        framesCount,

        frameProgress,
        sampleProgress,

        canvas,
        ctx,
        rafId,

        samplesCount,
        framesCount,
        avgFps,
        submitting,
        unloaded,
        stopTime,
        stream,
        connected,
        key

    function onAudioSample(audioSample) {
        samplesCount++
        stream.write(audioSample.toBuffer())
    }

    function onUserMediaReady() {
        debug('Recorder: onUserMediaReady()')

        samplesCount = framesCount = 0
        unloaded = submitting = false

        show()
        self.emit(Events.USER_MEDIA_READY)
    }

    function clearUserMediaTimeout() {
        userMediaTimeout && clearTimeout(userMediaTimeout)
        userMediaTimeout = null
    }

    function loadUserMedia() {
        debug('Recorder: loadUserMedia()')

        try {
            userMediaTimeout = setTimeout(function() {
                if (!self.isReady())
                    self.emit(Events.ERROR, browser.getNoAccessIssue())
            }, options.timeouts.userMedia)

            navigator.getUserMedia({
                video: true,
                audio: options.audio.enabled
            }, function(localStream) {

                clearUserMediaTimeout()

                userMedia.init(
                    localStream,
                    onUserMediaReady.bind(self),
                    onAudioSample.bind(self),
                    function(err) {
                        self.emit(Events.ERROR, err)
                    }
                )

            }, function(err) {
                clearUserMediaTimeout()

                var errorListeners = self.listeners(Events.ERROR)

                if (errorListeners.length) {
                    self.emit(Events.ERROR, err)

                    setTimeout(initSocket, options.timeouts.userMedia) // retry after a while
                } else {
                    debug('Recorder: no error listeners attached but throwing error', err)

                    // weird situation, throw it since there are no error listeners yet
                    throw err
                }
            })

        } catch (exc) {
            var errorListeners = self.listeners(Events.ERROR)

            if (errorListeners.length)
                self.emit(Events.ERROR, exc)
            else
                debug('Recorder: no error listeners attached but throwing exception', exc)
        }
    }

    function preview(args) {
        key = args.key

        if (args.mp4)
            replay.setMp4Source(args.mp4 + Constants.SITE_NAME_LABEL + '/' + options.siteName)

        if (args.webm)
            replay.setWebMSource(args.webm + Constants.SITE_NAME_LABEL + '/' + options.siteName)

        self.hide()
        self.emit(Events.PREVIEW, args.key)

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

        var command,
            result

        try {
            command = JSON.parse(data.toString())
        } catch(ex) {
            throw ex
        }

        debug('Server says: %s', command.command, command.args, result ? '= ' + result : result)

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
                    'Oh f**k, server error!',
                    command.args.err || '(No explanation given)',
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
    }

    function writeCommand(command, args) {
        if (!connected) {
            debug('Reconnecting for the command', command, '…')

            initSocket(function() {
                writeCommand(command, args)
            })
        } else if (stream) {
            debug('$ %s', command, args)

            var command = {
                command:    command,
                args:       args
            }

            stream.write(new Buffer(JSON.stringify(command)))
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

            /*
            // useful for debugging streams

            if (!stream.originalEmit)
                stream.originalEmit = stream.emit

            stream.emit = function(type) {
                debug(type)
                var args = [].splice.call(arguments, 0)
                return stream.originalEmit.apply(stream, args)
            }
            */

            stream.on('error', function(err) {
                // todo: workaround for bug https://github.com/maxogden/websocket-stream/issues/50

                if (stream && stream.destroyed) {

                    // Emit error first before unloading, because
                    // unloading will remove event listeners.
                    self.emit(Events.ERROR, VideomailError.create(
                        'Unable to connect',
                        'A websocket connection has been refused. Either the server is in trouble or you are already connected in another instance?',
                        options
                    ))
                } else {

                    // ignore error if there is no stream, see race condition at
                    // todo: https://github.com/maxogden/websocket-stream/issues/58#issuecomment-69711544

                    if (stream)
                        self.emit(Events.ERROR, err ? err : 'Unhandled websocket error')
                }
            })

            stream.on('end', function() {
                connected = false

                // only attempt to reconnect when recording
                if (visuals.isRecording())
                    options.reconnect && setTimeout(function() {
                        initSocket()
                    }, 2e3)
            })

            var checkConnection = function() {
                if (!connected) {
                    connected = true
                    unloaded  = false

                    self.emit(Events.CONNECTED)

                    cb && cb()
                }
            }

            stream.on('readable', checkConnection)
            stream.on('resume',   checkConnection)

            stream.on('data', function(data) {
                executeCommand.call(self, data)
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

    this.getAvgFps = function() {
        return avgFps
    }

    this.getKey = function() {
        return key
    }

    this.getAudioSampleRate = function() {
        return userMedia.getAudioSampleRate()
    }

    this.stop = function(limitReached) {
        debug('stop()')

        this.emit(Events.STOPPING, limitReached)

        this.reset()

        stopTime = Date.now()

        avgFps = 1000 / (intervalSum / framesCount)

        var args = {
            framesCount:  framesCount,
            videoType:    replay.getVideoType(),
            avgFps:       avgFps
        }

        if (options.audio.enabled) {
            args.samplesCount = samplesCount
            args.sampleRate   = userMedia.getAudioSampleRate()
        }

        writeCommand('stop', args)
    }

    this.back = function() {
        show()
        this.reset()

        writeCommand('back')
    }

    this.unload = function(e) {
        if (!unloaded) {
            var cause

            if (e)
                cause = e.name || e.statusText || e.toString()

            debug('Recorder: unload(), cause:', cause)

            this.reset()

            clearUserMediaTimeout()

            disconnect()

            unloaded = true
        }
    }

    this.reset = function() {
        // no need to reset when already unloaded
        if (!unloaded) {
            debug('Recorder: reset()')

            this.emit(Events.RESETTING)

            rafId && window.cancelAnimationFrame && window.cancelAnimationFrame(rafId)

            rafId = null

            replay.reset()

            // important to free memory
            userMedia && userMedia.stop()

            key = avgFps = canvas = ctx = sampleProgress = frameProgress = null
        }
    }

    this.validate = function() {
        return connected && framesCount > 0 && canvas === null
    }

    this.isReady = function() {
        return userMedia.isReady()
    }

    this.pause = function(e) {
        debug('pause()', e)

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

        debug('Recorder: record()')

        this.emit(Events.RECORDING)

        canvas = userMedia.createCanvas()
        ctx    = canvas.getContext('2d')

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

                    framesCount++

                    buffer = frame.toBuffer()

                    // stream might become null while unloading
                    stream && stream.write(buffer)

                    bytesSum += buffer.length

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
        }

        userMedia.recordAudio()

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

            userMedia = new UserMedia(recorderElement, options)

            initEvents()
            initSocket()
        }
    }

    this.isPaused = function() {
        return userMedia.isPaused()
    }

    this.isRecording = function() {
        return !!rafId && !this.isPaused() && !isNotifying()
    }

    this.hide = function() {
        recorderElement && recorderElement.classList.add('hide')
    }
}

util.inherits(Recorder, EventEmitter)

module.exports = Recorder
