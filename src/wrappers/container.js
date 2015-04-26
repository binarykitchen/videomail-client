var insertCss      = require('insert-css'),
    util           = require('util'),

    Visuals        = require('./visuals'),
    Buttons        = require('./buttons'),
    Form           = require('./form'),

    Resource       = require('./../resource'),
    Constants      = require('./../constants'),
    Events         = require('./../events'),

    VideomailError = require('./../util/videomailError'),
    EventEmitter   = require('./../util/eventEmitter'),
    css            = require('./../assets/css/main.min.css.js')

var Container = function(options) {

    EventEmitter.call(this, options, 'Container')

    var self  = this,

        visuals     = new Visuals(this, options),
        buttons     = new Buttons(this, options),
        resource    = new Resource(options),
        htmlElement = document.querySelector('html'),
        hasError    = false,

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

    function buildForm() {
        var formElement = getFormElement()

        if (formElement) {
            form = new Form(self, formElement, options)

            var submitButton = form.getSubmitButton()
            submitButton && buttons.setSubmitButton(submitButton)

            form.build()
        }
    }

    function buildChildren() {
        if (!containerElement.classList)
            self.emit(Events.ERROR, new Error('Sorry, your browser is too old!'))
        else {
            containerElement.classList.add('videomail')

            buttons.build()
            visuals.build()
        }
    }

    function processError(err) {
        hasError = true

        options.logger.error(err)

        if (options.displayErrors)
            visuals.block(err)
        else
            visuals.reset()
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

        // better to keep the one and only error listeners
        // at one spot, here, because unload() will do a removeAllListeners()
        self.on(Events.ERROR, function(err) {
            processError(err)
            unloadButKeepEventListeners(err)
        })
    }

    function unloadButKeepEventListeners(e) {
        visuals.unload(e)
        self.endWaiting()
    }

    this.build = function(containerId) {
        containerId      = containerId || Constants.DEFAULT_CONTAINER_ID
        containerElement = document.getElementById(containerId)

        if (!containerElement)
            this.emit(
                Events.ERROR,
                VideomailError.create(
                    'The container ID is invalid!',
                    'No tag with the ID ' + containerId + ' could be found.',
                    options
                ))
        else {
            options.insertCss && prependDefaultCss()

            initEvents()
            buildForm()
            buildChildren()
        }

        return !hasError
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
        unloadButKeepEventListeners(e)
        this.removeAllListeners()
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

    this.startOver = function() {
        visuals.back()
    }

    this.validate = function(force) {
        var valid

        if (force || !this.isNotifying()) {
            this.emit(Events.VALIDATING)

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
                this.emit(Events.VALID)
            else
                this.emit(Events.INVALID, whyInvalid)
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
        this.emit(Events.SUBMITTING)

        resource.post(videomailFormData, function(err, videomail, response) {

            self.endWaiting()

            if (err)
                self.emit(Events.ERROR, err)
            else
                self.emit(Events.SUBMITTED, videomail, response)
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
