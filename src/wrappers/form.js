var h            = require('hyperscript'),
    util         = require('util'),
    hidden       = require('hidden'),

    Events         = require('./../events'),
    EventEmitter   = require('./../util/eventEmitter'),
    VideomailError = require('./../util/videomailError')

var Form = function(container, formElement, options) {

    EventEmitter.call(this, options, 'Form')

    var self = this,

        disableContainerValidation,
        keyInput

    function getData() {
        var limit = formElement.elements.length,
            data  = {}

        for (var i = 0; i < limit; i++) {
            if (formElement.elements[i].name)
                data[formElement.elements[i].name] = formElement.elements[i].value
        }

        return data
    }

    this.loadVideomail = function(videomail) {
        var limit = formElement.elements.length,
            input,
            name

        for (var i = 0; i < limit; i++) {
            input = formElement.elements[i]
            name  = input.name

            if (videomail[name])
                input.value = videomail[name]

            if (name == options.selectors.subjectInputName ||
                name == options.selectors.fromInputName ||
                name == options.selectors.bodyInputName)
                input.disabled = true
        }

        formElement.setAttribute('method', 'put')
    }

    function isNotButton(element) {
        return element.tagName !== 'BUTTON' && element.type !== 'submit'
    }

    function setDisabled(disabled, buttonsToo) {
        var limit = formElement.elements.length

        for (var i = 0; i < limit; i++) {
            if (buttonsToo || (!buttonsToo && isNotButton(formElement.elements[i])))
                formElement.elements[i].disabled = disabled
        }
    }

    function hideAllInputs() {
        var limit = formElement.elements.length

        for (var i = 0; i < limit; i++) {
            hidden(formElement.elements[i], true)
        }
    }

    function getTextElements() {
        return formElement.querySelectorAll('input, textarea')
    }

    function getSelectElements() {
        return formElement.querySelectorAll('select')
    }

    this.disable = function(buttonsToo) {
        setDisabled(true, buttonsToo)
    }

    this.enable = function(buttonsToo) {
        setDisabled(false, buttonsToo)
    }

    this.build = function() {
        if (options.enableAutoValidation) {
            var textElements = getTextElements()

            for (var i = 0, len = textElements.length; i < len; i++) {
                textElements[i].addEventListener('input', function() {
                    container.validate()
                })

                // because of angular's digest cycle, validate again when it became invalid
                textElements[i].addEventListener('invalid', function() {
                    if (!disableContainerValidation)
                        container.validate()
                })
            }

            var selectElements = getSelectElements()

            for (var i = 0, len = selectElements.length; i < len; i++) {
                selectElements[i].addEventListener('change', function() {
                    container.validate()
                })
            }
        }

        keyInput = formElement.querySelector('input[name="' + options.selectors.keyInputName + '"]')

        if (!keyInput) {
            keyInput = h('input', {
                name: options.selectors.keyInputName,
                type: 'hidden'
            })

            formElement.appendChild(keyInput)
        }

        this.on(Events.PREVIEW, function(videomailKey) {
            // beware that preview doesn't always come with a key, i.E.
            // container.show() can emit PREVIEW without a key when a replay already exists
            // (can happen when showing - hiding - showing videomail over again)

            // only emit error if key is missing AND the input has no key (value) yet
            if (!videomailKey && !keyInput.value)
                self.emit(Events.ERROR, VideomailError.create(
                    'Videomail key for preview is missing!'
                ))
            else if (videomailKey)
                keyInput.value = videomailKey
            // else
            // leave as it and use existing keyInput.value
        })

        // fixes https://github.com/binarykitchen/videomail-client/issues/91
        this.on(Events.GOING_BACK, function() {
            keyInput.value = null
        })

        this.on(Events.ERROR, function(err) {
            // since https://github.com/binarykitchen/videomail-client/issues/60
            // we hide areas to make it easier for the user to process an error
            // (= less distractions)
            if (err.isBrowserProblem && err.isBrowserProblem() &&
                options.hideFormOnBrowserError) {
                hideAllInputs()
            }
        })

        this.on(Events.BUILT, function() {
            startListeningToSubmitEvents()
        })
    }

    function startListeningToSubmitEvents() {
        var submitButton = container.getSubmitButton()
        submitButton.addEventListener('click', self.doTheSubmit.bind(self))
    }

    this.doTheSubmit = function(e) {
        // when videomail-client is hidden, leave the form handling as it and
        // do not mess with it at all
        if (!container.areVisualsHidden()) {
            e && e.preventDefault()

            // only adjust submission when there is a container, otherwise
            // do nothing and leave as it for robustness
            if (container.hasElement()) {
                container.submitAll(
                    getData(),
                    formElement.getAttribute('method'),
                    formElement.getAttribute('action')
                )
            }

            return false // important to stop submission
        }
    }

    this.getInvalidElement = function() {
        var textElements = getTextElements()

        for (var i = 0, len = textElements.length; i < len; i++) {
            if (!textElements[i].validity.valid)
                return textElements[i]
        }

        var selectElements = getSelectElements()

        for (var i = 0, len = selectElements.length; i < len; i++) {
            if (!selectElements[i].validity.valid)
                return selectElements[i]
        }

        return null
    }

    this.validate = function() {
        // prevents endless validation loop
        disableContainerValidation = true

        var formIsValid = formElement.checkValidity()

        disableContainerValidation = false

        return formIsValid
    }

    this.findSubmitButton = function() {
        return formElement.querySelector("[type='submit']")
    }

    this.hide = function() {
        formElement && hidden(formElement, true)
    }

    this.show = function() {
        formElement && hidden(formElement, false)
    }
}

util.inherits(Form, EventEmitter)

module.exports = Form
