var util         = require('util'),
    EventEmitter = require('events').EventEmitter

var Buttons = function(container, options) {

    var self = this,

        buttonsElement,

        recordButton,
        pauseButton,
        resumeButton,
        stopButton,
        backButton

    function hide(buttonElement) {
        buttonElement.classList.add('hide')
    }

    function show(buttonElement) {
        buttonElement.classList.remove('hide')
    }

    function adjustButton(buttonElement, show) {
        buttonElement.disabled = true
        buttonElement.type     = 'button'

        !show && hide(buttonElement)

        return buttonElement
    }

    function makeButton(buttonClass, text, show) {
        var buttonElement = buttonsElement.querySelector('.' + buttonClass)

        if (!buttonElement) {
            buttonElement = document.createElement('BUTTON')

            buttonElement.classList.add(buttonClass)
            buttonElement = adjustButton(buttonElement, show)

            buttonElement.innerHTML = text

            buttonsElement.appendChild(buttonElement)
        } else
            buttonElement = adjustButton(buttonElement, show)

        return buttonElement
    }

    function buildButtons() {
        recordButton = makeButton(options.selectors.recordButtonClass, 'Record', true)

        if (options.enablePause)
            pauseButton = makeButton(options.selectors.pauseButtonClass, 'Pause')

        resumeButton = makeButton(options.selectors.resumeButtonClass, 'Resume')

        // show stop only when pause is enabled - looks better that way otherwise button
        // move left and right between record and stop
        stopButton = makeButton(options.selectors.stopButtonClass, 'Stop', options.enablePause)

        backButton = makeButton(options.selectors.backButtonClass, 'Back')
    }

    function onReady() {
        stopButton.disabled = true

        if (options.enablePause)
            show(stopButton)

        hide(backButton)
        show(recordButton)

        recordButton.disabled = false
    }

    function onError() {
        self.reset()
    }

    function onPreview() {
        hide(recordButton)
        hide(stopButton)

        show(backButton)
        backButton.disabled = false
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
        hide(resumeButton)
    }

    function onCountdown() {
        recordButton.disabled = true
    }

    function back() {
        backButton.disabled = true

        container.beginWaiting()
        container.back()
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
        })

        // User actions
        recordButton.addEventListener('click', function() {
            container.record()
        })

        pauseButton && pauseButton.addEventListener('click', function() {
            container.pause()
        })

        resumeButton.addEventListener('click', function() {
            container.resume()
        })

        stopButton.addEventListener('click', function() {
            container.stop()
        })

        backButton.addEventListener('click', function() {
            back()
        })
    }

    this.reset = function() {
        if (pauseButton)
            pauseButton.disabled = true

        recordButton.disabled = resumeButton.disabled =
        stopButton.disabled = backButton.disabled = true
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
