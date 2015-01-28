var async        = require('async'),
    util         = require('util'),

    Replay          = require('./visuals/replay'),
    Recorder        = require('./visuals/recorder'),
    Notifier        = require('./visuals/notifier'),
    RecorderInsides = require('./visuals/inside/recorderInsides'),

    EventEmitter    = require('./../util/eventEmitter'),
    VideomailError  = require('./../util/videomailError')

var Visuals = function(container, options) {

    EventEmitter.call(this, options, 'Visuals')

    var self = this,

        replay          = new Replay(this, options),
        recorder        = new Recorder(this, replay, options),
        recorderInsides = new RecorderInsides(this, options),

        notifier        = new Notifier(this),

        visualsElement

    function buildNoScriptTag() {
        var noScriptElement = container.querySelector('noscript')

        if (!noScriptElement) {
            noScriptElement = document.createElement('NOSCRIPT')
            noScriptElement.innerHTML = 'Please enable Javascript'

            visualsElement.appendChild(noScriptElement)
        }
    }

    function buildChildren(cb) {
        buildNoScriptTag()
        notifier.build()
        recorderInsides.build()

        async.parallel([
            replay.build.bind(replay),
            recorder.build
        ], cb)
    }

    function displayError(err) {
        options.logger.error(err)

        self.reset()
        notifier.block(VideomailError.create(err))
    }

    function initEvents() {
        recorder.on('error', displayError)

        recorder.on('ready', function() {
            notifier.hide()
            recorder.show()
            self.endWaiting()
        })

        recorder.on('preview', function() {
            notifier.hide()
            recorder.hide()
            replay.show()
            self.endWaiting()
        })

        recorder.on('recording', function() {
            recorderInsides.showRecordNote()
        })

        recorder.on('resuming', function() {
            recorderInsides.showRecordNote()
        })

        recorder.on('stopping', function() {
            recorderInsides.hideRecordNote()
        })

        recorder.on('paused', function() {
            recorderInsides.hideRecordNote()
        })
    }

    function isRecordable() {
        return !self.isNotifying() && !replay.isShown() && !recorderInsides.isCountingDown()
    }

    this.build = function(cb) {

        visualsElement = container.querySelector('.' + options.selectors.visualsClass)

        if (!visualsElement) {
            visualsElement = document.createElement('DIV')
            visualsElement.classList.add(options.selectors.visualsClass)

            container.appendChild(visualsElement)
        }

        visualsElement.classList.add('visuals')

        if (!visualsElement.style.width && options.video.width)
            visualsElement.style.width = options.video.width + 'px'

        if (!visualsElement.style.height && options.video.height)
            visualsElement.style.height = options.video.height + 'px'

        initEvents()

        buildChildren(function(err) {
            if (err) {
                displayError(err)
                cb(err)
            } else
                cb()
        })
    }

    this.querySelector = function(selector) {
        return visualsElement.querySelector(selector)
    }

    this.appendChild = function(child) {
        visualsElement.appendChild(child)
    }

    this.reset = function() {
        this.endWaiting()
        recorder.reset()
    }

    this.endWaiting = function() {
        container.endWaiting()
    }

    this.stop = function() {
        container.beginWaiting()
        recorder.stop()
        recorderInsides.hidePause()
    }

    this.back = function() {
        replay.hide()
        notifier.hide()
        recorder.back()
    }

    this.unload = function() {
        recorder.unload()
    }

    this.isNotifying = function() {
        return notifier.isVisible()
    }

    this.pause = function() {
        recorder.pause()
        recorderInsides.showPause()
    }

    this.resume = function() {
        recorder.resume()
        recorderInsides.hidePause()
    }

    this.pauseOrResume = function() {
        if (isRecordable()) {
            if (this.isRecording())
                this.pause()

            else if (recorder.isPaused())
                this.resume()

            else if (recorder.isReady())
                this.record()
        }
    }

    this.recordOrStop = function() {
        if (isRecordable()) {
            if (this.isRecording())
                this.stop()

            else if (recorder.isReady())
                this.record()
        }
    }

    this.record = function() {
        if (options.video.countdown) {
            this.emit('countdown')
            recorderInsides.startCountdown(recorder.record.bind(recorder))
        } else
            recorder.record()
    }

    this.hideReplay     = replay.hide.bind(replay)
    this.hideRecorder   = recorder.hide.bind(recorder)
    this.isRecording    = recorder.isRecording.bind(recorder)

    // todo: remove later because it exposes too much
    this.getRecorder = function() {
        return recorder
    }
}

util.inherits(Visuals, EventEmitter)

module.exports = Visuals
