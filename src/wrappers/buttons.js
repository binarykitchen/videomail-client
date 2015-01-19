module.exports = function(container, options) {

    var buttonsElement,

        recordButton,
        pauseButton,
        resumeButton,
        stopButton,
        backButton

    function makeButton(buttonClass, text) {
        var buttonElement = buttonsElement.querySelector('button.' + buttonClass)

        if (!buttonElement) {
            buttonElement = document.createElement('BUTTON')

            buttonElement.classList.add(buttonClass)
            buttonElement.classList.add('hide')

            buttonElement.innerHTML = text
            buttonElement.disabled  = true

            buttonsElement.appendChild(buttonElement)
        } else {
            buttonElement.disabled = true
            buttonElement.classList.add('hide')
        }

        return buttonElement
    }

    function buildButtons() {
        recordButton = makeButton(options.selectors.recordButtonClass,   'Record')
        pauseButton  = makeButton(options.selectors.pauseButtonClass,    'Pause')
        resumeButton = makeButton(options.selectors.resumeButtonClass,   'Resume')
        stopButton   = makeButton(options.selectors.stopButtonClass,     'Stop')
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
