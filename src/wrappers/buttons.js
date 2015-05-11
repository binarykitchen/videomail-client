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
        backButton,
        submitButton,
        built

    function hide(buttonElement) {
        buttonElement.classList.add('hide')
    }

    function show(buttonElement) {
        buttonElement.classList.remove('hide')
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
            buttonElement = h('button.' + buttonClass)
            buttonElement = adjustButton(buttonElement, show, type)

            buttonElement.innerHTML = text

            buttonsElement.appendChild(buttonElement)
        } else
            buttonElement = adjustButton(buttonElement, show, type)

        if (clickHandler)
            replaceClickHandler(buttonElement, clickHandler)

        return buttonElement
    }

    function buildButtons() {
        recordButton = makeButton(
            options.selectors.recordButtonClass,
            'Record',
            container.record,
            true
        )

        if (options.enablePause)
            pauseButton = makeButton(
                options.selectors.pauseButtonClass,
                'Pause',
                container.pause
            )

        if (options.enablePause)
            resumeButton = makeButton(
                options.selectors.resumeButtonClass,
                'Resume',
                container.resume
            )

        // show stop only when pause is enabled - looks better that way otherwise button
        // move left and right between record and stop
        stopButton = makeButton(
            options.selectors.stopButtonClass,
            'Stop',
            container.stop,
            options.enablePause
        )

        backButton = makeButton(
            options.selectors.backButtonClass,
            'Back',
            back
        )

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
    }

    function onReady() {
        stopButton.disabled = true

        if (options.enablePause)
            show(stopButton)

        hide(backButton)
        show(recordButton)

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

        show(backButton)
        backButton.disabled = false
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
            recordButton.disabled = true
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
        submitButton.disabled = true
        backButton.disabled   = true
    }

    function onSubmitted() {
        stopButton.disabled = true

        if (options.enablePause)
            show(stopButton)

        hide(backButton)

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
        hide(backButton)
        hide(resumeButton)
    }

    function onFormReady() {
        show(recordButton)
        show(stopButton)
    }

    function back() {
        backButton.disabled = true

        container.beginWaiting()
        container.back()
    }

    function submit() {
        container.submit()
    }

    function initEvents() {

        self.on(Events.USER_MEDIA_READY, function() {
            onReady()
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
        })
    }

    this.reset = function() {
        options.debug('Buttons: reset()')

        if (pauseButton)
            pauseButton.disabled = true

        if (resumeButton)
            resumeButton.disabled = true

        recordButton.disabled = stopButton.disabled = backButton.disabled = true
    }

    this.isBackButtonEnabled = function() {
        return !backButton.disabled
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
}

util.inherits(Buttons, EventEmitter)

module.exports = Buttons
