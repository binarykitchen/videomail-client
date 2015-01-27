module.exports = function(visuals) {

    var notifyElement,
        messageElement,
        explanationElement

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
    }

    this.hide = function() {
        notifyElement.classList.add('hide')

        if (messageElement)
            messageElement.innerHTML = null

        if (explanationElement)
            explanationElement.innerHTML = null
    }

    this.show = function() {
        notifyElement.classList.remove('hide')
    }

    this.isVisible = function() {
        return !notifyElement.classList.contains('hide')
    }

    this.block = function(err) {
        var message     = err.message ? err.message : err.toString(),
            explanation = err.explanation ? err.explanation : null

        this.notify(message, explanation, {
            blocking: true
        })
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

        this.show()

        visuals.endWaiting()
    }
}
