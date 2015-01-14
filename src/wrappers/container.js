var insertCss       = require('insert-css'),

    VideomailError = require('./../util/videomailError'),

    css            = require('./../assets/css/main.min.css.js'),

    Replay         = require('./replay'),
    Recorder       = require('./recorder'),
    Notifier       = require('./notifier')

module.exports = function(options) {

    var self     = this,

        replay   = new Replay(this, options),
        recorder = new Recorder(this, replay, options),
        notifier = new Notifier(this),

        htmlElement = document.querySelector('html'),

        containerElement

    function prependDefaultCss() {
        insertCss(css, {prepend: true})
    }

    function buildChildren(cb) {
        containerElement.classList.add('videomail')

        var noScriptElement = self.querySelector('noscript')

        if (!noScriptElement) {
            noScriptElement = document.createElement('NOSCRIPT')
            noScriptElement.innerHTML = 'Please enable Javascript'

            containerElement.appendChild(noScriptElement)
        }

        notifier.build(function(err) {
            if (err)
                cb(err)
            else
                replay.build(function(err) {
                    if (err)
                        cb(err)
                    else
                        recorder.build(cb)
                })
        })
    }

    this.build = function(cb) {

        containerElement = document.getElementById(options.selectors.containerId)

        if (!containerElement)
            cb(new VideomailError('The container ID is invalid!', {
                explanation: 'No tag with the ID ' + options.selectors.containerId + ' could be found.'
            }))
        else {
            options.insertCss && prependDefaultCss()

            buildChildren(cb)
        }
    }

    this.querySelector = function(selector) {
        return containerElement.querySelector(selector)
    }

    this.beginWaiting = function() {
        htmlElement.classList && htmlElement.classList.add('wait')
    }

    this.endWaiting = function() {
        htmlElement.classList && htmlElement.classList.remove('wait')
    }

    this.appendChild = function(child) {
        containerElement.appendChild(child)
    }

    this.isReplayShown  = replay.isShown
    this.hideReplay     = replay.hide
    this.showReplay     = replay.show
    this.hideRecorder   = recorder.hide
    this.showRecorder   = recorder.show
    this.notify         = notifier.notify.bind(notifier)
    this.block          = notifier.block.bind(notifier)
    this.stopRecording  = recorder.stop.bind(recorder)
    this.setExplanation = notifier.setExplanation
    this.resetRecorder  = recorder.reset
    this.pause          = recorder.pause
    this.resume         = recorder.resume
    this.record         = recorder.record
    this.hideNotifier   = notifier.hide
    this.showNotifier   = notifier.show
    this.unload         = recorder.unload.bind(recorder)
    this.back           = recorder.back.bind(recorder)
    this.isReady        = recorder.isReady
    this.isConnected    = recorder.isConnected
    this.isValid        = recorder.isValid
    this.isPaused       = recorder.isPaused

    // todo: remove later because it exposes too much
    this.getRecorder = function() {
        return recorder
    }
}
