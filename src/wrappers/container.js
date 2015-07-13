var insertCss      = require('insert-css'),
    util           = require('util'),

    Visuals        = require('./visuals'),
    Buttons        = require('./buttons'),
    Form           = require('./form'),

    Resource       = require('./../resource'),
    Events         = require('./../events'),

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
        submitted   = false,

        containerElement,
        built,
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

        if (err.stack)
            options.logger.error(err.stack)
        else
            options.logger.error(err)

        if (options.displayErrors)
            visuals.block(err)
        else
            visuals.reset()
    }

    function initEvents() {
        window.addEventListener('beforeunload', function(e) {
            if (!e.defaultPrevented)
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
        buttons.unload()
        self.endWaiting()
    }

    function hideMySelf() {
        containerElement.classList.add('hide')
    }

    function submitVideomail(formData, cb) {
        var FORM_FIELDS = {
                'subject':      options.selectors.subjectInputName,
                'from':         options.selectors.fromInputName,
                'to':           options.selectors.toInputName,
                'body':         options.selectors.bodyInputName,
                'key':          options.selectors.keyInputName,
                'parentKey':    options.selectors.parentKeyInputName
            },
            videomailFormData = {}

        Object.keys(FORM_FIELDS).forEach(function(key) {
            if (formData.hasOwnProperty(FORM_FIELDS[key]))
                videomailFormData[key] = formData[FORM_FIELDS[key]]
        })

        videomailFormData.avgFps = visuals.getAvgFps()

        if (options.audio.enabled)
            videomailFormData.sampleRate = visuals.getAudioSampleRate()

        resource.post(videomailFormData, cb)
    }

    function submitForm(formData, videomailResponse, url, cb) {
        // avgFps is only for the videomail server
        delete formData.avgFps

        formData[options.selectors.aliasInputName] = videomailResponse.videomail.alias

        resource.form(formData, url, cb)
    }

    function finalizeSubmissions(err, videomail, response, formResponse) {
        self.endWaiting()

        if (err)
            self.emit(Events.ERROR, err)
        else {
            submitted = true

            // merge two json response bodies to fake as if it were only one request
            if (formResponse && formResponse.body)
                Object.keys(formResponse.body).forEach(function(key) {
                    response[key] = formResponse.body[key]
                })

            self.emit(
                Events.SUBMITTED,
                videomail,
                response
            )

            if (formResponse && formResponse.type === "text/html" && formResponse.text) {
                // server replied with HTML contents - display these
                document.body.innerHTML = formResponse.text

                // todo: figure out how to fire dom's onload event again
                // todo: or how to run all the scripts over again
            }
        }
    }

    this.areVisualsHidden = function() {
        return visuals.isHidden()
    }

    this.hasElement = function() {
        return !!containerElement
    }

    this.build = function(containerId) {
        try {
            containerId      = containerId || options.selectors.containerId
            containerElement = document.getElementById(containerId)

            // only build when a container element hast been found, otherwise
            // be silent and do nothing
            if (containerElement) {
                options.insertCss && prependDefaultCss()

                !built && initEvents()
                buildForm()
                buildChildren()

                if (!hasError)
                    built = true
            }

        } catch (exc) {
            self.emit(Events.ERROR, exc)
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
        try {
            unloadButKeepEventListeners(e)
            this.removeAllListeners()

            built = submitted = false
        } catch (exc) {
            self.emit(Events.ERROR, exc)
        }
    }

    this.show = function() {
        if (containerElement) {
            containerElement.classList.remove('hide')

            visuals.show()
            buttons.show()

            if (!hasError) {
                if (self.isReplayShown())
                    self.emit(Events.PREVIEW)
                else
                    self.emit(Events.FORM_READY)
            }
        }
    }

    this.hide = function() {
        hasError = false

        if (this.isRecording())
            this.pause()

        visuals.hide()

        if (submitted) {
            buttons.hide()
            hideMySelf()
        }
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
        try {
            submitted = false
            visuals.back(this.show)
        } catch (exc) {
            self.emit(Events.ERROR, exc)
        }
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
                    if (!this.areVisualsHidden() && !visualsValid) {

                        if (this.isReady() || this.isRecording() || this.isPaused() || this.isCountingDown())
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

    this.submitAll = function(formData, method, url) {
        this.beginWaiting()
        this.disableForm(true)
        this.emit(Events.SUBMITTING)

        submitVideomail(formData, function(err, videomail, videomailResponse) {
            // for now, accept POSTs only which have an URL unlike null and
            // treat all other submissions as direct submissions

            if (!err && method && method.toUpperCase() == 'POST') {

                if (!url || url === '')
                    url = document.baseURI // figure out URL automatically then

                submitForm(formData, videomailResponse, url, function(err, formResponse) {
                    finalizeSubmissions(err, videomail, videomailResponse, formResponse)
                })
            } else
                finalizeSubmissions(err, videomail, videomailResponse)
        })
    }

    this.isBuilt = function() {
        return built
    }

    this.isReplayShown = function() {
        return visuals.isReplayShown()
    }

    this.isDirty = function() {
        return form && this.isReplayShown()
    }

    this.isCountingDown = visuals.isCountingDown.bind(visuals)
    this.isRecording    = visuals.isRecording.bind(visuals)
    this.record         = visuals.record.bind(visuals)
    this.resume         = visuals.resume.bind(visuals)
    this.stop           = visuals.stop.bind(visuals)
    this.back           = visuals.back.bind(visuals)
}

util.inherits(Container, EventEmitter)

module.exports = Container
