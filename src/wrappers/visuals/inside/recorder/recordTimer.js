module.exports = function(visuals) {

    var recordTimerElement

    this.build = function() {
        recordTimerElement = visuals.querySelector('.recordTimer')

        if (!recordTimerElement) {
            recordTimerElement = document.createElement('p')
            recordTimerElement.classList.add('recordTimer')

            this.hide()

            visuals.appendChild(recordTimerElement)
        } else
            this.hide()
    }

    this.hide = function() {
        recordTimerElement.classList.add('hide')
    }

    this.show = function() {
        recordTimerElement.classList.remove('hide')
    }
}
