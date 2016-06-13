var insertCss      = require('insert-css'),
    merge          = require('merge-recursive'),
    util           = require('util'),

    Dimension      = require('./dimension'),
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
        htmlElement = document && document.querySelector && document.querySelector('html'),
        debug       = options.debug,
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
            visuals.error(err)
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
        self
            .on(Events.ERROR, function(err) {
                processError(err)
                unloadButKeepEventListeners(err)

                if (err.isBrowserProblem && err.isBrowserProblem())
                    removeDimensions()
            })
            .on(Events.LOADED_META_DATA, function() {
                correctDimensions()
            })
    }

    // this will just set the width but not the height because
    // it can be a form with more inputs elements
    function correctDimensions() {
        var width = visuals.getRecorderWidth(true);

        if (width < 1)
            throw new Eror('Recorder width cannot be less than 1!')
        else
            containerElement.style.width = width + 'px'
    }

    function removeDimensions() {
        containerElement.style.width  = 'auto'
    }

    function unloadButKeepEventListeners(e) {
        visuals.unload(e)
        buttons.unload()
        self.endWaiting()
    }

    function hideMySelf() {
        containerElement.classList.add('hide')
    }

    // fixes https://github.com/binarykitchen/videomail-client/issues/71
    function trimEmail(email) {
        return email.replace(/(^[,\s]+)|([,\s]+$)/g, '')
    }

    function submitVideomail(formData, method, cb) {
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

        if (videomailFormData['from'])
            videomailFormData['from'] = trimEmail(videomailFormData['from'])

        if (videomailFormData['to'])
            videomailFormData['to'] = trimEmail(videomailFormData['to'])

        // when method is undefined, treat it as a post
        if (isPost(method) || !method) {
            videomailFormData.avgFps = visuals.getAvgFps()
            videomailFormData.width  = visuals.getRecorderWidth()
            videomailFormData.height = visuals.getRecorderHeight()

            if (options.isAudioEnabled())
                videomailFormData.sampleRate = visuals.getAudioSampleRate()

            resource.post(videomailFormData, cb)
        } else if (isPut(method))
            resource.put(videomailFormData, cb)
    }

    function submitForm(formData, videomailResponse, url, cb) {
        // avgFps is only for the videomail server
        delete formData.avgFps

        formData[options.selectors.aliasInputName] = videomailResponse.videomail.alias

        resource.form(formData, url, cb)
    }

    function finalizeSubmissions(err, method, videomail, response, formResponse) {
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

    this.addPlayerDimensions = function(videomail, element) {
        videomail.playerHeight = this.calculateHeight({
            responsive: true,
            videoWidth: videomail.width,
            ratio:      videomail.height / videomail.width
        }, element)

        videomail.playerWidth  = this.calculateWidth({
            responsive:  true,
            videoHeight: videomail.playerHeight,
            ratio:       videomail.height / videomail.width
        })

        return videomail
    }

    this.limitWidth = function(width) {
        return Dimension.limitWidth(containerElement, width)
    }

    this.limitHeight = function(height) {
        return Dimension.limitHeight(height)
    }

    this.calculateWidth = function(fnOptions) {
        return Dimension.calculateWidth(merge.recursive(options, fnOptions))
    }

    this.calculateHeight = function(fnOptions, element) {
        if (!element) {
            if (containerElement)
                element = containerElement
            else
                // better than nothing
                element = document.body
        }

        return Dimension.calculateHeight(element, merge.recursive(options, fnOptions))
    }

    this.areVisualsHidden = function() {
        return visuals.isHidden()
    }

    this.hasElement = function() {
        return !!containerElement
    }

    this.build = function() {
        try {
            containerElement = document.getElementById(options.selectors.containerId)

            // only build when a container element hast been found, otherwise
            // be silent and do nothing
            if (containerElement) {
                options.insertCss && prependDefaultCss()

                !built && initEvents()
                correctDimensions()
                buildForm()
                buildChildren()

                if (!hasError) {
                    built = true
                    self.emit(Events.BUILT)
                }
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

            if (!hasError) {

                var paused = self.isPaused()

                if (paused) {
                    buttons.adjustButtonsForPause()
                }

                // since https://github.com/binarykitchen/videomail-client/issues/60
                // we hide areas to make it easier for the user
                buttons.show()

                if (self.isReplayShown())
                    self.emit(Events.PREVIEW)
                else {
                    self.emit(Events.FORM_READY, {paused: paused})
                    debug('Building stream connection to server ...')
                }
            }
        }
    }

    this.hide = function() {
        hasError = false

        this.isRecording() && this.pause()

        visuals.hide()

        if (submitted) {
            buttons.hide()
            hideMySelf()
        }
    }

    this.showReplayOnly = function() {
        hasError = false

        this.isRecording() && this.pause()

        visuals.showReplayOnly()

        submitted && buttons.hide()
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

    // this code needs a good rewrite :(
    this.validate = function(force) {
        var runValidation = true,
            valid

        if (force) {
            runValidation = force
        } else if (self.isNotifying()) {
            runValidation = false
        } else if (visuals.isConnected()) {
            runValidation = visuals.isUserMediaLoaded() || visuals.isReplayShown()
        } else if (visuals.isConnecting()) {
            runValidation = false
        }

        if (runValidation) {
            this.emit(Events.VALIDATING)

            var visualsValid = visuals.validate() && buttons.isRecordAgainButtonEnabled(),
                whyInvalid

            if (form) {
                valid = form.validate()

                if (valid) {
                    if (!this.areVisualsHidden() && !visualsValid) {

                        if (this.isReady() || this.isRecording() || this.isPaused() || this.isCountingDown())
                            valid = false

                        if (!valid)
                            whyInvalid = 'Video is not recorded'
                    }
                } else {
                    var invalidInput = form.getInvalidElement()

                    if (invalidInput) {
                        whyInvalid = 'Form input named ' + invalidInput.name + ' is invalid'
                    } else {
                        whyInvalid = 'Form input(s() are invalid'
                    }
                }
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

    function isPost(method) {
        return method && method.toUpperCase() == 'POST'
    }

    function isPut(method) {
        return method && method.toUpperCase() == 'PUT'
    }

    this.submitAll = function(formData, method, url) {
        this.beginWaiting()
        this.disableForm(true)
        this.emit(Events.SUBMITTING)

        submitVideomail(formData, method, function(err, videomail, videomailResponse) {
            // for now, accept POSTs only which have an URL unlike null and
            // treat all other submissions as direct submissions

            if (!err && isPost(method)) {

                if (!url || url === '')
                    url = document.baseURI // figure out URL automatically then

                submitForm(formData, videomailResponse, url, function(err, formResponse) {
                    finalizeSubmissions(err, method, videomail, videomailResponse, formResponse)
                })
            } else
                finalizeSubmissions(err, method, videomail, videomailResponse)
        })
    }

    this.isBuilt = function() {
        return built
    }

    this.isReplayShown = function() {
        return visuals.isReplayShown()
    }

    this.isDirty = function() {
        var isDirty = false

        if (!!form) {
            if (visuals.isRecorderUnloaded())
                isDirty = false
            else if (this.isReplayShown() || this.isPaused())
                isDirty = true
        }

        return isDirty
    }

    this.getReplay = function() {
        return visuals.getReplay()
    }

    this.isOutsideElementOf = function(element) {
        return element.parentNode != containerElement && element != containerElement
    }

    this.hideForm = function() {
        form.hide()
    }

    this.loadForm = function(videomail) {
        form.loadVideomail(videomail)
        this.validate()
    }

    this.enableAudio = function() {
        options.setAudioEnabled(true)
        this.emit(Events.ENABLING_AUDIO)
    }

    this.disableAudio = function() {
        options.setAudioEnabled(false)
        this.emit(Events.DISABLING_AUDIO)
    }

    this.setSubmitButtonAttribute = function(name, value) {
        var submitButton = form.getSubmitButton()
        submitButton && submitButton.setAttribute(name, value)
    }

    this.isCountingDown = visuals.isCountingDown.bind(visuals)
    this.isRecording    = visuals.isRecording.bind(visuals)
    this.record         = visuals.record.bind(visuals)
    this.resume         = visuals.resume.bind(visuals)
    this.stop           = visuals.stop.bind(visuals)
    this.recordAgain    = visuals.recordAgain.bind(visuals)
}

util.inherits(Container, EventEmitter)

module.exports = Container
