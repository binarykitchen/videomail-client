var   h      = require('hyperscript'),
      hidden = require('hidden')

module.exports = function(visuals, options) {

    var   self = this

    var countdownElement,
        intervalId,
        countdown,
        paused

    function fire(cb) {
        self.unload()
        self.hide()

        // keep all callbacks async
        setTimeout(function() {
            cb()
        }, 0)
    }

    function countBackward(cb) {
        if (!paused) {
            countdown--

            if (countdown < 1)
                fire(cb)
            else
                countdownElement.innerHTML = countdown
        }
    }

    this.start = function(cb) {
        countdownElement.innerHTML = countdown = options.video.countdown

        this.show()

        intervalId = setInterval(countBackward.bind(this, cb), 1e3)
    }

    this.pause = function() {
        paused = true
    }

    this.resume = function() {
        paused = false
    }

    this.build = function() {
        countdownElement = visuals.querySelector('.countdown')

        if (!countdownElement) {
            countdownElement = h('p.countdown')

            this.hide()

            visuals.appendChild(countdownElement)
        } else
            this.hide()
    }

    this.show = function() {
        hidden(countdownElement, false)
    }

    this.isCountingDown = function() {
        return !!intervalId
    }

    this.unload = function() {
        clearInterval(intervalId)
        paused = false
        intervalId = null
    }

    this.hide = function() {
       hidden(countdownElement, true)
       this.unload()
    }
}
