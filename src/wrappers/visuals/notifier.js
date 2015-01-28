var util           = require('util'),
    EventEmitter   = require('./../../util/eventEmitter'),
    VideomailError = require('./../../util/videomailError')

var Notifier = function(visuals, options) {

    EventEmitter.call(this, options, 'Notifier')

    var self = this,

        notifyElement,
        messageElement,
        explanationElement

    function block(err) {
        var message     = err.message ? err.message : err.toString(),
            explanation = err.explanation ? err.explanation : null

        self.notify(message, explanation, {
            blocking: true
        })
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
    }

    function show() {
        notifyElement.classList.remove('hide')
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

        initEvents()
    }

    this.hide = function() {
        notifyElement.classList.add('hide')

        if (messageElement)
            messageElement.innerHTML = null

        if (explanationElement)
            explanationElement.innerHTML = null
    }

    this.isVisible = function() {
        return !notifyElement.classList.contains('hide')
    }

    this.notify = function(message, explanation, options) {

        var blocking = options.blocking ? options.blocking : false

        if (!messageElement) {
            messageElement = document.createElement('H2')
            notifyElement.appendChild(messageElement)
        }

        visuals.hideReplay()
        visuals.hideRecorder()

        messageElement.innerHTML = (blocking ? '&#x2639; ' : '') + message
        explanation && this.setExplanation(explanation)

        show()

        visuals.endWaiting()
    }
}

util.inherits(Notifier, EventEmitter)

module.exports = Notifier
