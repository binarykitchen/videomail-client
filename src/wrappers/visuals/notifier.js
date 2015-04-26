var util           = require('util'),
    h              = require('hyperscript'),

    EventEmitter   = require('./../../util/eventEmitter'),
    Events         = require('./../../events')

var Notifier = function(visuals, options) {

    EventEmitter.call(this, options, 'Notifier')

    var self    = this,
        debug   = options.debug,

        notifyElement,
        messageElement,
        explanationElement,
        entertainTimeoutId

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
        debug('Notifier: initEvents()')

        self
            .on(Events.USER_MEDIA_READY, function() {
                self.hide()
            })
            .on(Events.PREVIEW, function() {
                self.hide()
            })
            .on(Events.STOPPING, function(limitReached) {
                onStopping(limitReached)
            })
            .on(Events.PROGRESS, function(frameProgress, sampleProgress) {
                onProgress(frameProgress, sampleProgress)
            })
    }

    function show() {
        notifyElement.classList.remove('hide')
    }

    function runEntertainment() {
        if (options.notifier.entertain) {

            var randomBackgroundClass = Math.floor((Math.random() * options.notifier.entertainLimit) + 1)

            notifyElement.className =   'notifier entertain ' +
                                        options.notifier.entertainClass +
                                        randomBackgroundClass

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

    this.block = function(err) {
        var message     = err.message ? err.message.toString() : err.toString(),
            explanation = err.explanation ? err.explanation.toString() : null

        self.notify(message, explanation, {
            blocking: true
        })
    }

    this.setExplanation = function(explanation) {

        if (!explanationElement) {
            explanationElement = h('p')
            notifyElement.appendChild(explanationElement)
        }

        explanationElement.innerHTML = explanation
    }

    this.build = function() {
        notifyElement = visuals.querySelector('.notifier')

        if (!notifyElement) {
            notifyElement = h('.notifier') // defaults to div

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
            messageElement = h('h2')

            if (explanationElement)
                notifyElement.insertBefore(messageElement, explanationElement)
            else
                notifyElement.appendChild(messageElement)
        }

        if (blocking) {
            notifyElement.classList.add('blocking')
            this.emit(Events.BLOCKING, options)
        } else {
            this.emit(Events.NOTIFYING, options)
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
