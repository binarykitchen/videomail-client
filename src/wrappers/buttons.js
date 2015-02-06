var util         = require('util'),
    EventEmitter = require('./../util/eventEmitter')

var Buttons = function(container, options) {

    var self = this,

        buttonsElement,

        recordButton,
        pauseButton,
        resumeButton,
        stopButton,
        backButton,
        submitButton

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

    function makeButton(buttonClass, text, show, id, type) {
        var buttonElement

        if (id)
            buttonElement = document.getElementById(id)
        else
            buttonElement = buttonsElement.querySelector('.' + buttonClass)

        if (!buttonElement) {
            buttonElement = document.createElement('BUTTON')

            buttonElement.classList.add(buttonClass)
            buttonElement = adjustButton(buttonElement, show, type)

            buttonElement.innerHTML = text

            buttonsElement.appendChild(buttonElement)
        } else
            buttonElement = adjustButton(buttonElement, show, type)

        return buttonElement
    }

    function buildButtons() {
        recordButton = makeButton(options.selectors.recordButtonClass, 'Record', true)

        if (options.enablePause)
            pauseButton = makeButton(options.selectors.pauseButtonClass, 'Pause')

        if (options.enablePause)
            resumeButton = makeButton(options.selectors.resumeButtonClass, 'Resume')

        // show stop only when pause is enabled - looks better that way otherwise button
        // move left and right between record and stop
        stopButton = makeButton(options.selectors.stopButtonClass, 'Stop', options.enablePause)

        backButton = makeButton(options.selectors.backButtonClass, 'Back')

        if (!options.disableSubmit)
            submitButton = makeButton(
                options.selectors.submitButtonClass,
                'Submit',
                true,
                options.selectors.submitButtonId,
                'submit'
            )
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

    function onError() {
        self.reset()
    }

    function onResetting() {
        if (submitButton)
            submitButton.disabled = true
    }

    function onPreview() {
        hide(recordButton)
        hide(stopButton)

        show(backButton)
        backButton.disabled = false

        if (submitButton && container.validate())
            submitButton.disabled = false
    }

    function onPaused() {
        pauseButton && hide(pauseButton)
        show(resumeButton)
        resumeButton.disabled = false
    }

    function onRecording() {
        hide(recordButton)

        if (pauseButton) {
            show(pauseButton)
            pauseButton.disabled = false
        }

        stopButton.disabled = false
        show(stopButton)
    }

    function onResuming() {
        hide(resumeButton)

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
        backButton.disabled = true
    }

    function onInvalid() {
        if (submitButton)
            submitButton.disabled = true
    }

    function onValid() {
        if (submitButton)
            submitButton.disabled = false
    }

    function back() {
        backButton.disabled = true

        container.beginWaiting()
        container.back()
    }

    function submit() {
        submitButton.disabled = true
        container.submit()
    }

    function initEvents() {

        self.on('ready', function() {
            onReady()
        }).on('preview', function() {
            onPreview()
        }).on('error', function() {
            onError()
        }).on('paused', function() {
            onPaused()
        }).on('recording', function() {
            onRecording()
        }).on('resuming', function() {
            onResuming()
        }).on('stopping', function() {
            onStopping()
        }).on('countdown', function() {
            onCountdown()
        }).on('submitting', function() {
            onSubmitting()
        }).on('resetting', function() {
            onResetting()
        }).on('invalid', function() {
            onInvalid()
        }).on('valid', function() {
            onValid()
        })

        // User actions
        recordButton.addEventListener('click', function() {
            container.record()
        })

        pauseButton && pauseButton.addEventListener('click', function() {
            container.pause()
        })

        resumeButton && resumeButton.addEventListener('click', function() {
            container.resume()
        })

        stopButton.addEventListener('click', function() {
            container.stop()
        })

        backButton.addEventListener('click', function() {
            back()
        })

        submitButton && submitButton.addEventListener('click', function() {
            submit()
        })
    }

    this.reset = function() {
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

    this.build = function(cb) {

        buttonsElement = container.querySelector('.' + options.selectors.buttonsClass)

        if (!buttonsElement) {
            buttonsElement = document.createElement('DIV')
            buttonsElement.classList.add(options.selectors.buttonsClass)

            container.appendChild(buttonsElement)
        }

        buildButtons()
        initEvents()

        cb()
    }
}

util.inherits(Buttons, EventEmitter)

module.exports = Buttons
