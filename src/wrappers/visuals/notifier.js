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
        entertainTimeoutId,
        built

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
        if (notifyElement)
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
        if (notifyElement)
            notifyElement.className = 'notifier'

        clearInterval(entertainTimeoutId)
    }

    function setMessage(message, messageOptions) {
        var blocking = messageOptions.blocking ? messageOptions.blocking : false

        if (messageElement)
            messageElement.innerHTML = (blocking ? '&#x2639; ' : '') + message
        else
            options.logger.warn(
                'Unable to show following because messageElement is empty:',
                message
            )
    }

    this.block = function(err) {
        var message     = err.message ? err.message.toString() : err.toString(),
            explanation = err.explanation ? err.explanation.toString() : null

        if (!message)
            options.debug('Weird empty message generated for error', err)

        self.notify(message, explanation, {
            blocking: true
        })
    }

    this.setExplanation = function(explanation) {

        if (!explanationElement) {
            explanationElement = h('p')

            if (notifyElement)
                notifyElement.appendChild(explanationElement)
            else
                options.logger.warn(
                    'Unable to show explanation because notifyElement is empty:',
                    explanation
                )
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

        !built && initEvents()

        built = true
    }

    this.hide = function() {
        cancelEntertainment()

        if (notifyElement) {
            notifyElement.classList.add('hide')
            notifyElement.classList.remove('blocking')
        }

        if (messageElement)
            messageElement.innerHTML = null

        if (explanationElement)
            explanationElement.innerHTML = null
    }

    this.isVisible = function() {
        if (!built)
            return false
        else
            return notifyElement && !notifyElement.classList.contains('hide')
    }

    this.notify = function(message, explanation, notifyOptions) {

        var processing = notifyOptions.processing ? notifyOptions.processing : false,
            entertain  = notifyOptions.entertain  ? notifyOptions.entertain  : false,
            blocking   = notifyOptions.blocking   ? notifyOptions.blocking  : false

        if (!messageElement && notifyElement) {
            messageElement = h('h2')

            if (explanationElement)
                notifyElement.insertBefore(messageElement, explanationElement)
            else
                notifyElement.appendChild(messageElement)
        }

        if (blocking) {
            notifyElement && notifyElement.classList.add('blocking')
            this.emit(Events.BLOCKING, notifyOptions)
        } else
            this.emit(Events.NOTIFYING, notifyOptions)

        visuals.hideReplay()
        visuals.hideRecorder()

        setMessage(message, notifyOptions)

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
