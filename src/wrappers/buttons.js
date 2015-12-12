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
        previewButton,
        recordAgainButton,
        submitButton,

        audioOnRadioButton,
        audioOffRadioButton,

        built

    function hide(element) {
        if (element)
            element.classList.add('hide')
    }

    function show(element) {
        if (element)
            element.classList.remove('hide')
    }

    function isShown(element) {
        return element && !element.classList.contains('hide')
    }

    function disable(element) {
        if (element)
            element.disabled = true
    }

    function enable(element) {
        if (element)
            element.disabled = false
    }

    function adjustButton(buttonElement, show, type) {
        disable(buttonElement)

        buttonElement.type = type || 'button'

        !show && hide(buttonElement)

        return buttonElement
    }

    function replaceClickHandler(element, clickHandler) {

        var wrappedClickHandler = function(e) {
            e && e.preventDefault()
            clickHandler()
        }

        element.onclick = wrappedClickHandler
    }

    function makeRadioButton(options) {
        var radioButtonElement

        if (options.id)
            radioButtonElement = document.getElementById(options.id)

        if (!radioButtonElement) {

            radioButtonElement = h('input#' + options.id, {
                type:    'radio',
                name:    options.name,
                value:   options.value,
                checked: options.checked
            })

            var radioButtonGroup = h('p.radioGroup', radioButtonElement, h('label', {
                'htmlFor': options.id
            }, options.label))

            // double check that submit button is already in the buttonsElement container
            if (submitButton && buttonsElement.contains(submitButton))
                buttonsElement.insertBefore(radioButtonGroup, submitButton)
            else
                buttonsElement.appendChild(radioButtonGroup)
        }

        if (options.changeHandler)
            radioButtonElement.onchange = options.changeHandler

        disable(radioButtonElement)

        return radioButtonElement
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

            // double check that submit button is already in the buttonsElement container
            if (submitButton && buttonsElement.contains(submitButton))
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
                disable(submitButton)

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
        // move left and right between record and stop (preview)
        previewButton = makeButton(
            options.selectors.previewButtonClass,
            'Preview',
            container.stop,
            false
        )

        recordAgainButton = makeButton(
            options.selectors.recordAgainButtonClass,
            'Record again',
            recordAgain,
            false
        )

        if (options.audio && options.audio.switch) {
            audioOnRadioButton = makeRadioButton({
                id:            'audioOnOption',
                name:          'audio',
                value:         'on',
                label:         'Audio On (Beta)',
                checked:       options.isAudioEnabled(),
                changeHandler: function() {
                    container.enableAudio()
                }
            })

            audioOffRadioButton = makeRadioButton({
                id:            'audioOffOption',
                name:          'audio',
                value:         'off',
                label:         'Audio Off',
                checked:       !options.isAudioEnabled(),
                changeHandler: function() {
                    container.disableAudio()
                }
            })
        }
    }

    function onFormReady() {
        // no need to show record button when doing a record again
        if (!isShown(recordAgainButton))
            show(recordButton)

        disable(previewButton)
        hide(previewButton)
    }

    function onReplayShown() {
        self.hide()
    }

    function onUserMediaReady() {
        onFormReady()

        if (isShown(recordButton))
            enable(recordButton)

        if (isShown(audioOnRadioButton))
            enable(audioOnRadioButton)

        if (isShown(audioOffRadioButton))
            enable(audioOffRadioButton)

        disable(submitButton)
    }

    function onResetting() {
        disable(submitButton)

        self.reset()
    }

    function onPreview() {
        hide(recordButton)
        hide(previewButton)
        disable(audioOnRadioButton)
        disable(audioOffRadioButton)

        show(recordAgainButton)
        enable(recordAgainButton)
    }

    this.enableSubmit = function() {
        enable(submitButton)
    }

    function onPaused() {
        pauseButton && hide(pauseButton)
        show(resumeButton)
        enable(resumeButton)
        hide(recordButton)
        show(previewButton)
    }

    function onFirstFrameSent() {
        hide(recordButton)
        hide(recordAgainButton)

        if (pauseButton) {
            show(pauseButton)
            enable(pauseButton)
        }

        enable(previewButton)
        show(previewButton)
    }

    function onRecording(framesCount) {
        // it is possible to hide while recording, hence
        // check framesCount first (coming from recorder)
        if (framesCount > 1)
            onFirstFrameSent()
        else {
            disable(audioOffRadioButton)
            disable(audioOnRadioButton)
            disable(recordAgainButton)
            disable(recordButton)
        }
    }

    function onResuming() {
        hide(resumeButton)
        hide(recordButton)

        if (pauseButton) {
            enable(pauseButton)
            show(pauseButton)
        }
    }

    function onStopping() {
        disable(previewButton)
        hide(pauseButton)
        hide(resumeButton)
    }

    function onCountdown() {
        disable(recordButton)
        disable(audioOffRadioButton)
        disable(audioOnRadioButton)
    }

    function onSubmitting() {
        disable(submitButton)
        disable(recordAgainButton)
    }

    function onSubmitted() {
        disable(previewButton)

        if (options.enablePause)
            show(previewButton)

        hide(recordAgainButton)

        disable(recordButton)
        show(recordButton)
        disable(submitButton)
    }

    function onInvalid() {
        disable(submitButton)
    }

    function onValid() {
        enable(submitButton)
    }

    function onHidden() {
        hide(recordButton)
        hide(previewButton)
        hide(recordAgainButton)
        hide(resumeButton)
    }

    function recordAgain() {
        disable(recordAgainButton)
        container.beginWaiting()
        container.recordAgain()
    }

    function submit() {
        container.submit()
    }

    function record() {
        disable(recordButton)
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
        }).on(Events.REPLAY_SHOWN, function() {
            onReplayShown()
        }).on(Events.ERROR, function(err) {
            // since https://github.com/binarykitchen/videomail-client/issues/60
            // we hide areas to make it easier for the user
            if (err.isBrowserProblem && err.isBrowserProblem())
                self.hide()
        })
    }

    this.reset = function() {
        options.debug('Buttons: reset()')

        disable(pauseButton)
        disable(resumeButton)
        disable(recordButton)
        disable(previewButton)
        disable(recordAgainButton)
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
