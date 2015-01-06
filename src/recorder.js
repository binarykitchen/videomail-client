var websocket    = require('websocket-stream'),
    util         = require('util'),
    EventEmitter = require('events').EventEmitter,

    Browser      = require('./util/browser'),
    Humanize     = require('./util/humanize'),
    UserMedia    = require('./util/userMedia'),
    Frame        = require('./util/items/frame')

var Recorder = function(recorderElement, replayElement, options) {

    var self      = this,
        userMedia = new UserMedia(recorderElement, options),
        browser   = new Browser(),

        wantedInterval  = 1e3 / options.video.fps,

        paused,

        lastAnimationTimestamp,

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
        debug

    if (options.debug)
        debug = options.logger.debug.bind(options.logger)
    else
        debug = function() {}

    function onAudioSample(audioSample) {
        samplesCount++
        stream.write(audioSample.toBuffer())
    }

    function onUserMediaReady() {
        debug('onUserMediaReady()')

        samplesCount = framesCount = 0
        submitting   = false

        this.emit('ready')
    }

    function loadUserMedia() {
        try {
            var userMediaTimeout = setTimeout(function() {
                if (!self.isReady())
                    self.emit('error', browser.getNoAccessIssue())
            }, 5e3)

            navigator.getUserMedia({
                video: true,
                audio: options.audio.enabled
            }, function(localStream) {

                clearTimeout(userMediaTimeout)

                userMedia.init(
                    localStream,
                    onUserMediaReady.bind(self),
                    onAudioSample.bind(self)
                )

            }, function(err) {
                clearTimeout(userMediaTimeout)
                self.emit('error', err)
            })

        } catch (exc) {
            this.emit('error', exc)
        }
    }

    function preview(args) {
        setMp4Source(args.mp4)
        setWebMSource(args.webm)

        self.emit('preview', args.key)

        if (options.debug) {
            var waitingTime = Date.now() - stopTime

            debug(
                'While recording, %s have been transferred and waiting time was %s',
                Humanize.filesize(bytesSum, 2),
                Humanize.toTime(waitingTime)
            )
        }

        setTimeout(function() {
            replayElement.load()
        }, 100)
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
        self.emit('progress', frameProgress, sampleProgress)
    }

    function executeCommand(data) {

        var command,
            result

        try {
            command = JSON.parse(data.toString())
        } catch(ex) {
            throw ex
        }

        switch (command.command) {
            case 'ready':
                loadUserMedia()
                break
            case 'preview':
                preview(command.args)
                break
            case 'error':
                this.emit('error', new VideomailError('Oh f**k! Server error', {
                    explanation: command.args.err
                }))
                break
            case 'confirmFrame':
                result = updateFrameProgress(command.args)
                break
            case 'confirmSample':
                result = updateSampleProgress(command.args)
                break
            case 'beginAudioEncoding':
                this.emit('beginAudioEncoding')
                break
            case 'beginVideoEncoding':
                this.emit('beginVideoEncoding')
                break
            default:
                this.emit('error', 'Unknown server command: ' + command.command)
                break
        }

        debug('$ %s', command.command, command.args, result ? '= ' + result : result)
    }

    function writeCommand(command, args) {
        if (!connected) {
            debug('Trying to reconnect …')

            initSocket(function() {
                debug('Reconnected')
                writeCommand(command, args)
            })
        } else {
            debug('$ %s', command, args)

            var command = {
                command:    command,
                args:       args
            }

            stream.write(new Buffer(JSON.stringify(command)))
        }
    }

    function initSocket(cb) {
        if (!connected && !unloaded) {

            debug('initSocket()')

            // https://github.com/maxogden/websocket-stream#binary-sockets
            stream = websocket(options.socketUrl)

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
                // workaround for bug https://github.com/maxogden/websocket-stream/issues/50

                if (stream.destroyed) {
                    self.emit('error', new VideomailError('Unable to connect', {
                        explanation: 'Looks like the videomail server is down.'
                    }))
                } else {
                    self.emit('error', err ? err : 'Unhandled websocket error')
                }
            })

            stream.on('end', function() {
                connected = false

                debug('Stream ended')

                self.emit('end')

                // try to reconnect
                options.reconnect && setTimeout(function() {
                    initSocket(function() {
                        debug('Reconnected')

                        self.emit('reconnect')
                    })
                }, 2e3)
            })

            var checkConnection = function () {
                if (!connected) {
                    connected = true

                    debug('Connected')

                    self.emit('connect')

                    cb && cb()
                }
            }

            stream.on('readable', checkConnection)
            stream.on('resume',   checkConnection)

            stream.on('data', function(data) {
                executeCommand.call(self, data)
            })

            window.addEventListener('beforeunload', function(e) {
                self.unload(e)
            })
        }
    }

    function getVideoSource(type) {
        var sources = replayElement.getElementsByTagName('source'),
            l       = sources.length,
            type    = 'video/' + type,
            source

        if (sources.length) {
            var i

            for(i = 0; i < l && !source; i++) {
                if (sources[i].getAttribute('type') === type)
                    source = sources[i]
            }
        }

        return source
    }

    function setVideoSource(type, src) {
        var source = getVideoSource(type)

        if (!source) {
            if (src) {
                var source = document.createElement('source')

                source.setAttribute('src', src)
                source.setAttribute('type', 'video/' + type)

                replayElement.appendChild(source)
            }
        } else {
            if (src)
                source.setAttribute('src', src)
            else
                replayElement.removeChild(source)
        }
    }

    function setMp4Source(src) {
        setVideoSource('mp4', src)
    }

    function setWebMSource(src) {
        setVideoSource('webm', src)
    }

    this.stop = function() {
        this.reset()

        stopTime = Date.now()

        avgFps = 1000 / (intervalSum / framesCount)

        var args = {
            framesCount:  framesCount,
            videoType:    browser.getVideoType(replayElement),
            avgFps:       avgFps
        }

        if (options.audio.enabled) {
            args.samplesCount = samplesCount
            args.sampleRate   = userMedia.getAudioSampleRate()
        }

        writeCommand('stop', args)
    }

    this.back = function() {
        this.reset()

        writeCommand('back')
    }

    this.pause = function() {
        userMedia.pause()
    }

    this.unload = function(e) {
        var cause

        if (e)
            cause = e.name || e.statusText || e.toString()

        debug('unload()', cause)

        this.reset()

        if (submitting)
            // server will disconnect socket automatically after submitting
            connected = false

        else if (stream) {
            // force to disconnect socket right now to clean temp files on server
            stream.end()
            stream = undefined
        }

        unloaded = true
    }

    this.reset = function() {
        rafId && window.cancelAnimationFrame && window.cancelAnimationFrame(rafId)

        // pause video to make sure it won't consume any memory
        replayElement.pause()

        // important to free memory
        userMedia.stop()

        setMp4Source(null)
        setWebMSource(null)

        canvas = ctx = sampleProgress = frameProgress = null

        paused = false
    }

    this.isConnected = function() {
        return connected
    }

    this.isValid = function() {
        return framesCount > 0 && canvas === null
    }

    this.isReady = function() {
        return userMedia.isReady()
    }

    this.pause = function() {
        debug('pause()')

        userMedia.pause()
    }

    this.isPaused = function() {
        return userMedia.isPaused()
    }

    this.resume = function() {
        debug('resume()')

        lastAnimationTimestamp = Date.now()
        userMedia.resume()
    }

    this.record = function() {

        if (unloaded) return false

        debug('record()')

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

                    ctx.drawImage(userMedia.getRawVisuals(), 0, 0, canvas.width, canvas.height)

                    framesCount++

                    buffer = frame.toBuffer()

                    stream.write(buffer)

                    if (options.debug) {
                        bytesSum += buffer.length

                        /*
                        debug(
                            'Frame #' + framesCount + ' (' + buffer.length + ' bytes):',
                            interval + '/' + intervalThreshold + '/' + wantedInterval
                        )
                        */
                    }
                }
            }
        }

        userMedia.recordAudio()

        rafId = window.requestAnimationFrame(draw)
    }

    this.submit = function(data, cb) {
        submitting = true

        var videomail = {
            avgFps:  avgFps,
            from:    data.from,
            key:     data.key,
            alias:   data.alias,
            to:      data.to,
            subject: data.subject,
            body:    data.body
        }

        if (options.audio.enabled)
            videomail.sampleRate = userMedia.getAudioSampleRate()

        Videomail.post(videomail, options, function(err, response) {
            submitting = false

            if (err) {
                self.unload(err)
                cb(err)
            } else
                cb(null, response)
        })
    }

    initSocket()
}

util.inherits(Recorder, EventEmitter)

module.exports = Recorder
