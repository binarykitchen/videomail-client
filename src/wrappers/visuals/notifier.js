var util           = require('util'),
    EventEmitter   = require('./../../util/eventEmitter'),
    VideomailError = require('./../../util/videomailError')

var Notifier = function(visuals, options) {

    EventEmitter.call(this, options, 'Notifier')

    var self = this,

        notifyElement,
        messageElement,
        explanationElement,
        entertainTimeoutId

    function block(err) {
        var message     = err.message ? err.message : err.toString(),
            explanation = err.explanation ? err.explanation : null

        self.notify(message, explanation, {
            blocking: true
        })
    }

    function onStopping(limitReached) {
        var lead = ''

        visuals.beginWaiting()

        if (limitReached) {
            options.debug('Limit reached')
            lead += options.text.limitReached + '.<br/>'
        }

        lead += options.text.processing + ' …'

        self.notify(lead, null, {
            processing: true,
            entertain:  options.notifier.entertain
        })
    }

    function onProgress(frameProgress, sampleProgress) {
        var overallProgress

        if (options.audio.enabled) {
            overallProgress = 'Video: ' + frameProgress

            if (sampleProgress)
                 overallProgress += ', Audio: ' + sampleProgress
        } else
            overallProgress = frameProgress

        self.setExplanation(overallProgress)
    }

    function initEvents() {
        self
            .on('ready', function() {
                self.hide()
            })
            .on('preview', function() {
                self.hide()
            })
            .on('error', function(err) {
                block(VideomailError.create(err))
            })
            .on('stopping', function(limitReached) {
                onStopping(limitReached)
            })
            .on('progress', function(frameProgress, sampleProgress) {
                onProgress(frameProgress, sampleProgress)
            })
    }

    function show() {
        notifyElement.classList.remove('hide')
    }

    function runEntertainment() {
        if (options.notifier.entertain) {

            var randomBackgroundClass = Math.floor((Math.random() * options.notifier.entertainLimit) + 1)

            notifyElement.className = 'notifier entertain ' + options.notifier.entertainClass + randomBackgroundClass

            entertainTimeoutId = setTimeout(runEntertainment, options.notifier.entertainInterval)
        } else
            cancelEntertainment()
    }

    function cancelEntertainment() {
        notifyElement.className = 'notifier'
        clearInterval(entertainTimeoutId)
    }

    function setMessage(message, options) {
        var blocking = options.blocking ? options.blocking : false

        messageElement.innerHTML = (blocking ? '&#x2639; ' : '') + message
    }

    this.setExplanation = function(explanation) {

        if (!explanationElement) {
            explanationElement = document.createElement('P')
            notifyElement.appendChild(explanationElement)
        }

        explanationElement.innerHTML = explanation
    }

    this.build = function() {
        notifyElement = visuals.querySelector('.notifier')

        if (!notifyElement) {
            notifyElement = document.createElement('DIV')
            notifyElement.classList.add('notifier')

            this.hide()

            visuals.appendChild(notifyElement)
        } else
            this.hide()

        if (!notifyElement.width && options.video.width)
            notifyElement.width = options.video.width

        if (!notifyElement.height && options.video.height)
            notifyElement.height = options.video.height

        initEvents()
    }

    this.hide = function() {
        cancelEntertainment()

        notifyElement.classList.add('hide')
        notifyElement.classList.remove('blocking')

        if (messageElement)
            messageElement.innerHTML = null

        if (explanationElement)
            explanationElement.innerHTML = null
    }

    this.isVisible = function() {
        return !notifyElement.classList.contains('hide')
    }

    this.notify = function(message, explanation, options) {

        var processing = options.processing ? options.processing : false,
            entertain  = options.entertain  ? options.entertain  : false,
            blocking   = options.blocking   ? options.blocking  : false

        if (!messageElement) {
            messageElement = document.createElement('H2')

            if (explanationElement)
                notifyElement.insertBefore(messageElement, explanationElement)
            else
                notifyElement.appendChild(messageElement)
        }

        if (blocking) {
            notifyElement.classList.add('blocking')
            this.emit('blocking', options)
        } else {
            this.emit('notifying', options)
        }

        visuals.hideReplay()
        visuals.hideRecorder()

        setMessage(message, options)

        explanation && this.setExplanation(explanation)

        if (entertain)
            runEntertainment()
        else
            cancelEntertainment()

        show()

        !processing && visuals.endWaiting()
    }
}

util.inherits(Notifier, EventEmitter)

module.exports = Notifier
