var insertCss      = require('insert-css'),
    async          = require('async'),
    util           = require('util'),

    Visuals        = require('./visuals'),
    Buttons        = require('./buttons'),
    Form           = require('./form'),

    Controller     = require('./../controller'),
    Resource       = require('./../resource'),

    VideomailError = require('./../util/videomailError'),
    EventEmitter   = require('./../util/eventEmitter'),
    css            = require('./../assets/css/main.min.css.js')

var Container = function(options) {

    EventEmitter.call(this, options, 'Container')

    var self = this,

        controller  = new Controller(this, options),
        visuals     = new Visuals(this, options),
        buttons     = new Buttons(this, options),
        resource    = new Resource(options),
        htmlElement = document.querySelector('html'),

        containerElement,
        form

    function prependDefaultCss() {
        insertCss(css, {prepend: true})
    }

    function getFormElement() {
        var formElement

        if (containerElement.tagName === 'FORM')
            formElement = containerElement

        else if (options.selectors.formId)
            formElement = document.getElementById(options.selectors.formId)

        return formElement
    }

    function buildForm(cb) {
        var formElement = getFormElement()

        if (formElement) {
            form = new Form(self, formElement, options)

            var submitButton = form.getSubmitButton()
            submitButton && buttons.setSubmitButton(submitButton)

            form.build(cb)
        } else
            cb()
    }

    function buildChildren(cb) {
        if (!containerElement.classList)
            cb(new Error('Sorry, your browser is too old!'))
        else {
            containerElement.classList.add('videomail')

            async.series([
                buttons.build,
                visuals.build
            ], cb)
        }
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

            async.series([
                buildForm,
                buildChildren
            ], function(err) {
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

    this.isPaused = function() {
        return visuals.isPaused()
    }

    this.pause = function() {
        visuals.pause()
    }

    this.validate = function(force) {
        var valid

        if (force || !this.isNotifying()) {
            this.emit('validating')

            var visualsValid = visuals.validate() && buttons.isBackButtonEnabled(),
                whyInvalid

            if (form) {
                valid = form.validate()

                if (valid) {
                    if (!visualsValid) {

                        if (this.isReady() || this.isRecording() || this.isPaused())
                            valid = false

                        if (!valid)
                            whyInvalid = 'requiresRecord'
                    }
                } else
                    whyInvalid = 'badFormData'
            } else
                valid = visualsValid

            if (valid)
                this.emit('valid')
            else
                this.emit('invalid', whyInvalid)
        }

        return valid
    }

    this.disableForm = function(buttonsToo) {
        form && form.disable(buttonsToo)
    }

    this.enableForm = function(buttonsToo) {
        form && form.enable(buttonsToo)
    }

    this.hasForm = function() {
        return !!form
    }

    this.isReady = function() {
        return buttons.isRecordButtonEnabled()
    }

    this.submit = function(videomailFormData) {

        this.beginWaiting()

        videomailFormData.avgFps = visuals.getAvgFps()
        videomailFormData.key    = visuals.getVideomailKey()

        if (options.audio.enabled)
            videomailFormData.sampleRate = visuals.getAudioSampleRate()

        this.disableForm(true)
        this.emit('submitting')

        resource.post(videomailFormData, function(err, videomail, response) {

            self.endWaiting()

            if (err)
                self.emit('error', err)
            else
                self.emit('submitted', videomail, response)
        })
    }

    this.isRecording    = visuals.isRecording.bind(visuals)
    this.record         = visuals.record.bind(visuals)
    this.resume         = visuals.resume.bind(visuals)
    this.stop           = visuals.stop.bind(visuals)
    this.back           = visuals.back.bind(visuals)
}

util.inherits(Container, EventEmitter)

module.exports = Container
