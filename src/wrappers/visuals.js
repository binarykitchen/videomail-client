var util = require('util'),
    h    = require('hyperscript'),

    Replay          = require('./visuals/replay'),
    Recorder        = require('./visuals/recorder'),
    Notifier        = require('./visuals/notifier'),
    RecorderInsides = require('./visuals/inside/recorderInsides'),

    EventEmitter    = require('./../util/eventEmitter'),
    Events          = require('./../events')

var Visuals = function(container, options) {

    EventEmitter.call(this, options, 'Visuals')

    var self  = this,

        replay          = new Replay(this, options),
        recorder        = new Recorder(this, replay, options),
        recorderInsides = new RecorderInsides(this, options),

        notifier        = new Notifier(this, options),

        debug           = options.debug,

        visualsElement,
        built

    function buildNoScriptTag() {
        var noScriptElement = container.querySelector('noscript')

        if (!noScriptElement) {
            noScriptElement = h('noscript')
            noScriptElement.innerHTML = 'Please enable Javascript'

            visualsElement.appendChild(noScriptElement)
        }
    }

    function buildChildren() {
        debug('Visuals: buildChildren()')

        buildNoScriptTag()
        notifier.build()
        recorderInsides.build()
        replay.build()
    }

    function initEvents() {
        self
            .on(Events.USER_MEDIA_READY, function() {
                built = true
                self.endWaiting()
                container.enableForm(false)
            })
            .on(Events.PREVIEW, function() {
                self.endWaiting()
            })
            .on(Events.BLOCKING, function() {
                container.disableForm(true)
            })
            .on(Events.PREVIEW_SHOWN, function() {
                container.validate(true)
            })
    }

    function isRecordable() {
        return !self.isNotifying() && !replay.isShown() && !this.isCountingDown()
    }

    this.isCountingDown = function() {
        return recorderInsides.isCountingDown()
    }

    this.build = function() {
        visualsElement = container.querySelector('.' + options.selectors.visualsClass)

        if (!visualsElement) {
            visualsElement = h('div.' + options.selectors.visualsClass)

            var buttonsElement = container.querySelector('.' + options.selectors.buttonsClass)

            // make sure it's placed before the buttons
            if (buttonsElement)
                container.insertBefore(visualsElement, buttonsElement)
            else
                container.appendChild(visualsElement)
        }

        visualsElement.classList.add('visuals')
        visualsElement.classList.add('hide')

        if (!visualsElement.style.width && options.video.width)
            visualsElement.style.width = options.video.width + 'px'

        if (!visualsElement.style.height && options.video.height)
            visualsElement.style.height = options.video.height + 'px'

        !built && initEvents()
        buildChildren()

        built = true
    }

    this.querySelector = function(selector) {
        return visualsElement.querySelector(selector)
    }

    this.appendChild = function(child) {
        visualsElement.appendChild(child)
    }

    this.removeChild = function(child) {
        visualsElement.removeChild(child)
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

    this.back = function(cb) {
        replay.hide()
        notifier.hide()
        recorder.back(cb)
    }

    this.unload = function(e) {
        recorder.unload(e)
        recorderInsides.unload(e)
        replay.unload(e)

        built = false
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
        if (isRecordable.call(this)) {
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
            this.emit(Events.COUNTDOWN)
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

    this.getAudioSampleRate = function() {
        return recorder.getAudioSampleRate()
    }

    this.isPaused = function() {
        return recorder.isPaused()
    }

    this.block = function(err) {
        notifier.block(err)
    }

    this.hide = function() {
        if (visualsElement) {
            visualsElement.classList.add('hide')
            this.emit(Events.HIDE)
        }
    }

    this.isHidden = function() {
        if (!built)
            return true
        else
            return visualsElement.classList.contains('hide')
    }

    this.show = function() {
        if (!this.isReplayShown())
            recorder.build()

        visualsElement.classList.remove('hide')
    }

    this.isRecorderUnloaded = function() {
        return recorder.isUnloaded()
    }

    this.isReplayShown = replay.isShown.bind(replay)
    this.hideReplay    = replay.hide.bind(replay)
    this.hideRecorder  = recorder.hide.bind(recorder)
    this.isRecording   = recorder.isRecording.bind(recorder)
}

util.inherits(Visuals, EventEmitter)

module.exports = Visuals
