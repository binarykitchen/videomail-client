module.exports = function(recorder) {

    var countdownElement

    this.build = function() {
        countdownElement = recorder.querySelector('.countdown')

        if (!countdownElement) {
            countdownElement = document.createElement('p')
            countdownElement.classList.add('countdown')

            this.hide()

            recorder.appendChild(countdownElement)
        } else
            this.hide()
    }

    this.hide = function() {
        countdownElement.classList.add('hide')
    }

    this.show = function() {
        countdownElement.classList.remove('hide')
    }
}
