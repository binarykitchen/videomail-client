var async        = require('async'),
    util         = require('util'),

    Replay          = require('./visuals/replay'),
    Recorder        = require('./visuals/recorder'),
    Notifier        = require('./visuals/notifier'),
    RecorderInsides = require('./visuals/inside/recorderInsides'),

    EventEmitter    = require('./../util/eventEmitter')

var Visuals = function(container, options) {

    EventEmitter.call(this, options, 'Visuals')

    var self = this,

        replay          = new Replay(this, options),
        recorder        = new Recorder(this, replay, options),
        recorderInsides = new RecorderInsides(this, options),

        notifier        = new Notifier(this, options),

        debug           = options.debug,

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
        debug('Visuals: buildChildren()')

        buildNoScriptTag()
        notifier.build()
        recorderInsides.build()
        replay.build()

        recorder.build(cb)
    }

    function processError(err) {
        options.logger.error(err)

        if (options.displayErrors)
            notifier.block(err)

        self.reset()
    }

    function initEvents() {
        self
            .on('error', processError)
            .on('ready', function() {
                self.endWaiting()
                container.enableForm(false)
            })
            .on('preview', function() {
                self.endWaiting()
            })
            .on('blocking', function() {
                container.disableForm(true)
            })
            .on('previewShown', function() {
                container.validate(true)
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

            var buttonsElement = container.querySelector('.' + options.selectors.buttonsClass)

            // make sure it's placed before the buttons
            if (buttonsElement)
                container.insertBefore(visualsElement, buttonsElement)
            else
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
                processError(err)
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

    this.beginWaiting = function() {
        container.beginWaiting()
    }

    this.endWaiting = function() {
        container.endWaiting()
    }

    this.stop = function(limitReached) {
        recorder.stop(limitReached)
        recorderInsides.hidePause()
    }

    this.back = function() {
        replay.hide()
        notifier.hide()
        recorder.back()
    }

    this.unload = function(e) {
        recorder.unload(e)
    }

    this.isNotifying = function() {
        return notifier.isVisible()
    }

    this.isReplayShown = function() {
        return replay.isShown()
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

    this.getRecorder = function() {
        return recorder
    }

    this.getReplay = function() {
        return replay
    }

    this.validate = function() {
        return recorder.validate() && this.isReplayShown()
    }

    this.getAvgFps = function() {
        return recorder.getAvgFps()
    }

    this.getVideomailKey = function() {
        return recorder.getKey()
    }

    this.getAudioSampleRate = function() {
        return recorder.getAudioSampleRate()
    }

    this.isPaused = function() {
        return recorder.isPaused()
    }

    this.hideReplay   = replay.hide.bind(replay)
    this.hideRecorder = recorder.hide.bind(recorder)
    this.isRecording  = recorder.isRecording.bind(recorder)
}

util.inherits(Visuals, EventEmitter)

module.exports = Visuals
