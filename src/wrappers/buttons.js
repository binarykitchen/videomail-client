var util         = require('util'),
    h            = require('hyperscript'),

    Events       = require('./../events'),
    EventEmitter = require('./../util/eventEmitter')

var Buttons = function(container, options) {

    EventEmitter.call(this, options, 'Buttons')

    var self = this,

        buttonsElement,

        recordButton,
        pauseButton,
        resumeButton,
        stopButton,
        recordAgainButton,
        submitButton,
        built

    function hide(element) {
        element.classList.add('hide')
    }

    function show(element) {
        element.classList.remove('hide')
    }

    function isShown(element) {
        return !element.classList.contains('hide')
    }

    function adjustButton(buttonElement, show, type) {
        buttonElement.disabled = true
        buttonElement.type     = type || 'button'

        !show && hide(buttonElement)

        return buttonElement
    }

    function replaceClickHandler(buttonElement, clickHandler) {

        var wrappedClickHandler = function(e) {
            e && e.preventDefault()
            clickHandler()
        }

        buttonElement.onclick = wrappedClickHandler
    }

    function makeButton(buttonClass, text, clickHandler, show, id, type) {
        var buttonElement

        if (id)
            buttonElement = document.getElementById(id)
        else
            buttonElement = buttonsElement.querySelector('.' + buttonClass)

        if (!buttonElement) {
            if (options.selectors.buttonClass)
                buttonClass += '.' + options.selectors.buttonClass

            buttonElement = h('button.' + buttonClass)
            buttonElement = adjustButton(buttonElement, show, type)

            buttonElement.innerHTML = text

            if (submitButton)
                buttonsElement.insertBefore(buttonElement, submitButton)
            else
                buttonsElement.appendChild(buttonElement)
        } else
            buttonElement = adjustButton(buttonElement, show, type)

        if (clickHandler)
            replaceClickHandler(buttonElement, clickHandler)

        return buttonElement
    }

    function buildButtons() {
        if (!options.disableSubmit) {
            if (!submitButton)
                submitButton = makeButton(
                    options.selectors.submitButtonClass,
                    'Submit',
                    null,
                    true,
                    options.selectors.submitButtonId,
                    'submit'
                )
            else
                submitButton.disabled = true

            // no need to listen to the submit event when it's already listened
            // within the form element class
            if (!container.hasForm() && submitButton)
                replaceClickHandler(submitButton, submit)
        }

        recordButton = makeButton(
            options.selectors.recordButtonClass,
            'Record video',
            record,
            false
        )

        if (options.enablePause)
            pauseButton = makeButton(
                options.selectors.pauseButtonClass,
                'Pause',
                container.pause,
                false
            )

        if (options.enablePause)
            resumeButton = makeButton(
                options.selectors.resumeButtonClass,
                'Resume',
                container.resume,
                false
            )

        // show stop only when pause is enabled - looks better that way otherwise button
        // move left and right between record and stop
        stopButton = makeButton(
            options.selectors.stopButtonClass,
            'Stop',
            container.stop,
            false
        )

        recordAgainButton = makeButton(
            options.selectors.recordAgainButtonClass,
            'Record again',
            recordAgain,
            false
        )
    }

    function onFormReady() {
        // no need to show record button when doing a record again
        if (!isShown(recordAgainButton))
            show(recordButton)

        stopButton.disabled = true
        hide(stopButton)
    }

    function onUserMediaReady() {
        onFormReady()

        if (isShown(recordButton))
            recordButton.disabled = false

        if (submitButton)
            submitButton.disabled = true
    }

    function onResetting() {
        if (submitButton)
            submitButton.disabled = true

        self.reset()
    }

    function onPreview() {
        hide(recordButton)
        hide(stopButton)

        show(recordAgainButton)
        recordAgainButton.disabled = false
    }

    this.enableSubmit = function() {
        if (submitButton)
            submitButton.disabled = false
    }

    function onPaused() {
        pauseButton && hide(pauseButton)
        show(resumeButton)
        resumeButton.disabled = false
        hide(recordButton)
        show(stopButton)
    }

    function onFirstFrameSent() {
        hide(recordButton)
        hide(recordAgainButton)

        if (pauseButton) {
            show(pauseButton)
            pauseButton.disabled = false
        }

        stopButton.disabled = false
        show(stopButton)
    }

    function onRecording(framesCount) {
        // it is possible to hide while recording, hence
        // check framesCount first (coming from recorder)
        if (framesCount > 1)
            onFirstFrameSent()
        else
            recordAgainButton.disabled = recordButton.disabled = true
    }

    function onResuming() {
        hide(resumeButton)
        hide(recordButton)

        if (pauseButton) {
            pauseButton.disabled = false
            show(pauseButton)
        }
    }

    function onStopping() {
        stopButton.disabled = true

        pauseButton && hide(pauseButton)
        resumeButton && hide(resumeButton)
    }

    function onCountdown() {
        recordButton.disabled = true
    }

    function onSubmitting() {
        submitButton.disabled = recordAgainButton.disabled = true
    }

    function onSubmitted() {
        stopButton.disabled = true

        if (options.enablePause)
            show(stopButton)

        hide(recordAgainButton)

        recordButton.disabled = true
        show(recordButton)

        submitButton.disabled = true
    }

    function onInvalid() {
        if (submitButton)
            submitButton.disabled = true
    }

    function onValid() {
        if (submitButton)
            submitButton.disabled = false
    }

    function onHidden() {
        hide(recordButton)
        hide(stopButton)
        hide(recordAgainButton)
        hide(resumeButton)
    }

    function recordAgain() {
        recordAgainButton.disabled = true

        container.beginWaiting()
        container.recordAgain()
    }

    function submit() {
        container.submit()
    }

    function record() {
        recordButton.disabled = true
        container.record()
    }

    function initEvents() {
        self.on(Events.USER_MEDIA_READY, function() {
            onUserMediaReady()
        }).on(Events.PREVIEW, function() {
            onPreview()
        }).on(Events.PAUSED, function() {
            onPaused()
        }).on(Events.RECORDING, function(framesCount) {
            onRecording(framesCount)
        }).on(Events.FIRST_FRAME_SENT, function() {
            onFirstFrameSent()
        }).on(Events.RESUMING, function() {
            onResuming()
        }).on(Events.STOPPING, function() {
            onStopping()
        }).on(Events.COUNTDOWN, function() {
            onCountdown()
        }).on(Events.SUBMITTING, function() {
            onSubmitting()
        }).on(Events.RESETTING, function() {
            onResetting()
        }).on(Events.INVALID, function() {
            onInvalid()
        }).on(Events.VALID, function() {
            onValid()
        }).on(Events.SUBMITTED, function() {
            onSubmitted()
        }).on(Events.HIDE, function() {
            onHidden()
        }).on(Events.FORM_READY, function() {
            onFormReady()
        }).on(Events.ERROR, function(err) {
            // since https://github.com/binarykitchen/videomail-client/issues/60
            // we hide areas to make it easier for the user
            if (err.isBrowserProblem && err.isBrowserProblem())
                self.hide()
        })
    }

    this.reset = function() {
        options.debug('Buttons: reset()')

        if (pauseButton)
            pauseButton.disabled = true

        if (resumeButton)
            resumeButton.disabled = true

        recordButton.disabled = stopButton.disabled = recordAgainButton.disabled = true
    }

    this.isRecordAgainButtonEnabled = function() {
        return !recordAgainButton.disabled
    }

    this.isRecordButtonEnabled = function() {
        return !recordButton.disabled
    }

    this.setSubmitButton = function(newSubmitButton) {
        submitButton = newSubmitButton
    }

    this.build = function() {
        buttonsElement = container.querySelector('.' + options.selectors.buttonsClass)

        if (!buttonsElement) {
            buttonsElement = h('div.' + options.selectors.buttonsClass)

            container.appendChild(buttonsElement)
        }

        buildButtons()

        !built && initEvents()

        built = true
    }

    this.unload = function() {
        built = false
    }

    this.hide = function() {
        hide(buttonsElement)
    }

    this.show = function() {
        show(buttonsElement)
    }
}

util.inherits(Buttons, EventEmitter)

module.exports = Buttons
