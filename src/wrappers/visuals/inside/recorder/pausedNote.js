module.exports = function(recorder, options) {

    if (!options.text.paused) throw new Error('Paused text cannot be empty')

    var pausedElement

    this.build = function() {
        pausedElement = recorder.querySelector('.paused')

        if (!pausedElement) {
            pausedElement = document.createElement('p')
            pausedElement.classList.add('paused')

            this.hide()

            pausedElement.innerHTML = options.text.paused

            recorder.appendChild(pausedElement)
        } else {
            this.hide()
            pausedElement.innerHTML = options.text.paused
        }
    }

    this.hide = function() {
        pausedElement.classList.add('hide')
    }

    this.show = function() {
        pausedElement.classList.remove('hide')
    }
}
