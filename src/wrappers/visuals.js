var Replay         = require('./visuals/replay'),
    Recorder       = require('./visuals/recorder'),
    Notifier       = require('./visuals/notifier'),

    VideomailError = require('./../util/videomailError')

module.exports = function(container, options) {

    var self = this,

        replay   = new Replay(this, options),
        recorder = new Recorder(this, replay, options),
        notifier = new Notifier(this),

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

        replay.build(function(err) {
            if (err)
                cb(err)
            else
                recorder.build(cb)
        })
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

        buildChildren(function(err) {
            if (err) {
                displayError(err)
                cb(err)
            } else {
                initEvents()
                cb()
            }
        })
    }

    this.reset = function() {
        this.endWaiting()
        recorder.reset()
    }

    this.querySelector = function(selector) {
        return visualsElement.querySelector(selector)
    }

    this.appendChild = function(child) {
        visualsElement.appendChild(child)
    }

    this.beginWaiting = function() {
        container.beginWaiting()
    }

    this.endWaiting = function() {
        container.endWaiting()
    }

    this.back = function() {
        replay.hide()
        notifier.hide()
        recorder.back()
    }

    this.stop = function() {
        this.beginWaiting()
        recorder.stop()
    }

    this.hideReplay     = replay.hide
    this.hideRecorder   = recorder.hide
    this.record         = recorder.record
    this.pause          = recorder.pause
    this.resume         = recorder.resume

    /*
    this.isReplayShown  = replay.isShown
    this.showReplay     = replay.show
    this.showRecorder   = recorder.show
    this.notify         = notifier.notify.bind(notifier)
    this.block          = notifier.block.bind(notifier)
    this.setExplanation = notifier.setExplanation
    this.hideNotifier   = notifier.hide
    this.showNotifier   = notifier.show
    this.unload         = recorder.unload.bind(recorder)
    this.isReady        = recorder.isReady
    this.isConnected    = recorder.isConnected
    this.isValid        = recorder.isValid
    this.isPaused       = recorder.isPaused
    */

    // todo: remove later because it exposes too much
    this.getRecorder = function() {
        return recorder
    }
}
