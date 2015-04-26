var h = require('hyperscript')

module.exports = function(visuals, options) {

    if (!options.text.paused) throw new Error('Paused text cannot be empty')

    var pausedElement

    this.build = function() {
        pausedElement = visuals.querySelector('.paused')

        if (!pausedElement) {
            pausedElement = h('p.paused')

            this.hide()

            pausedElement.innerHTML = options.text.paused

            visuals.appendChild(pausedElement)
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
