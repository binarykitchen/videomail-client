module.exports = function(recorder) {

    var recordTimerElement

    this.build = function() {
        recordTimerElement = recorder.querySelector('.recordTimer')

        if (!recordTimerElement) {
            recordTimerElement = document.createElement('p')
            recordTimerElement.classList.add('recordTimer')

            this.hide()

            recorder.appendChild(recordTimerElement)
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
