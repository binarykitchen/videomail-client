module.exports = function(container, options) {

    var self = this,

        buttonsElement,

        recordButton,
        pauseButton,
        resumeButton,
        stopButton,
        backButton

    function adjustButton(buttonElement, show) {
        buttonElement.disabled = true
        buttonElement.type     = 'button'

        !show && buttonElement.classList.add('hide')

        return buttonElement
    }

    function makeButton(buttonClass, text, show) {
        var buttonElement = buttonsElement.querySelector('button.' + buttonClass)

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
        recordButton = makeButton(options.selectors.recordButtonClass,   'Record', true)
        pauseButton  = makeButton(options.selectors.pauseButtonClass,    'Pause')
        stopButton   = makeButton(options.selectors.stopButtonClass,     'Stop', true)
        resumeButton = makeButton(options.selectors.resumeButtonClass,   'Resume')
        backButton   = makeButton(options.selectors.backButtonClass,     'Back')
    }

    function onReady() {
        stopButton.disabled = true

        backButton.classList.add('hide')
        recordButton.classList.remove('hide')
        stopButton.classList.remove('hide')

        recordButton.disabled = false
    }

    function onStopped() {
        backButton.classList.add('hide')
        resumeButton.classList.add('hide')
        stopButton.classList.remove('hide')
    }

    function onError() {
        self.reset()
    }

    function onPreview() {
        recordButton.classList.add('hide')
        stopButton.classList.add('hide')

        backButton.classList.remove('hide')
        backButton.disabled = false
    }

    function record() {
        recordButton.classList.add('hide')

        pauseButton.classList.remove('hide')
        pauseButton.disabled = false

        stopButton.disabled = false

        container.record()
    }

    function pause() {
        pauseButton.classList.add('hide')

        resumeButton.classList.remove('hide')
        resumeButton.disabled = false

        container.pause()
    }

    function resume() {
        container.resume()

        resumeButton.classList.add('hide')

        pauseButton.disabled = false
        pauseButton.classList.remove('hide')
    }

    function stop() {
        container.stop()

        stopButton.disabled = true

        pauseButton.classList.add('hide')
        resumeButton.classList.add('hide')
    }

    function back() {
        backButton.disabled = true

        container.beginWaiting()
        container.back()
    }

    function initEvents() {

        // Events from other actions such as server commands
        var recorder = container.getRecorder()

        recorder.on('ready', function() {
            onReady()
        })

        recorder.on('stopped', function() {
            onStopped()
        })

        recorder.on('preview', function() {
            onPreview()
        })

        recorder.on('error', function() {
            onError()
        })

        // User actions
        recordButton.addEventListener('click', function() {
            record()
        })

        pauseButton.addEventListener('click', function() {
            pause()
        })

        resumeButton.addEventListener('click', function() {
            resume()
        })

        stopButton.addEventListener('click', function() {
            stop()
        })

        backButton.addEventListener('click', function() {
            back()
        })
    }

    this.reset = function() {
        recordButton.disabled = pauseButton.disabled =
        resumeButton.disabled = stopButton.disabled =
        backButton.disabled   = true
    }

    this.build = function() {

        buttonsElement = container.querySelector('.' + options.selectors.buttonsClass)

        if (!buttonsElement) {
            buttonsElement = document.createElement('DIV')
            buttonsElement.classList.add(options.selectors.buttonsClass)

            container.appendChild(buttonsElement)
        }

        buildButtons()
        initEvents()
    }
}
