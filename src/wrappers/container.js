var insertCss      = require('insert-css'),
    forward        = require('forward-emitter'),
    async          = require('async'),

    Visuals        = require('./visuals'),
    Buttons        = require('./buttons'),

    Controller     = require('./../controller'),

    VideomailError = require('./../util/videomailError'),
    css            = require('./../assets/css/main.min.css.js')

module.exports = function(options) {

    var self = this,

        controller  = new Controller(this, options),
        visuals     = new Visuals(this, options),
        buttons     = new Buttons(this, options),
        htmlElement = document.querySelector('html'),

        containerElement

    function prependDefaultCss() {
        insertCss(css, {prepend: true})
    }

    function buildChildren(cb) {
        containerElement.classList.add('videomail')

        // https://github.com/STRML/forward-emitter
        forward(visuals.getRecorder(), controller) // todo: double check if this is really needed
        forward(visuals.getRecorder(), buttons)
        forward(visuals,               buttons)

        async.series([
            visuals.build,
            buttons.build
        ], cb)
    }

    function initEvents() {
        window.addEventListener('beforeunload', function(e) {
            self.unload(e)
        })

        if (options.enablePause && options.enableAutoPause)
            window.addEventListener('blur', function(e) {
                self.isRecording() && self.pause(e)
            })

        if (options.enableSpace)
            window.addEventListener('keypress', function(e) {
                var tagName = e.target.tagName

                if (tagName !== 'INPUT' && tagName !== 'TEXTAREA') {

                    var code = e.keyCode ? e.keyCode : e.which

                    if (code == 32) {
                        e.preventDefault()

                        if (options.enablePause)
                            visuals.pauseOrResume()
                        else
                            visuals.recordOrStop()
                    }
                }
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

            buildChildren(function(err) {
                if (err)
                    cb(err)
                else {
                    initEvents()
                    cb(null, controller)
                }
            })
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

    this.insertBefore = function(child, reference) {
        containerElement.insertBefore(child, reference)
    }

    this.unload = function(e) {
        visuals.unload(e)
        this.endWaiting()
    }

    this.isNotifying = function() {
        return visuals.isNotifying()
    }

    this.pause = function() {
        visuals.pause()
    }

    this.isValid = function() {
        return visuals.isValid() && buttons.isBackButtonEnabled()
    }

    this.isReady = function() {
        return buttons.isRecordButtonEnabled()
    }

    this.getAvgFps = function() {
        return visuals.getAvgFps()
    }

    this.getVideomailKey = function() {
        return visuals.getVideomailKey()
    }

    this.getAudioSampleRate = function() {
        return visuals.getAudioSampleRate()
    }

    // remove when this is fixed
    // https://github.com/STRML/forward-emitter/issues/1
    this.emit = function(event, anything) {
        visuals.emit(event, anything)
    }

    this.isRecording    = visuals.isRecording.bind(visuals)
    this.record         = visuals.record.bind(visuals)
    this.resume         = visuals.resume.bind(visuals)
    this.stop           = visuals.stop.bind(visuals)
    this.back           = visuals.back.bind(visuals)
    this.submit         = controller.submit.bind(controller)
}
