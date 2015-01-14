module.exports = function(container) {

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

    this.build = function(cb) {
        notifyElement = container.querySelector('.notifier')

        if (!notifyElement) {
            notifyElement = document.createElement('DIV')
            notifyElement.classList.add('notifier', 'hide')

            container.appendChild(notifyElement)
        }

        cb()
    }

    this.hide = function() {
        notifyElement.classList.add('hide')
        notifyElement.innerHTML = null
    }

    this.show = function() {
        notifyElement.classList.remove('hide')
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

        messageElement.innerHTML = (blocking ? '&#x2639; ' : '') + message
        explanation && this.setExplanation(explanation)

        container.hideReplay()
        container.hideRecorder()

        this.show()

        container.endWaiting()
    }
}
