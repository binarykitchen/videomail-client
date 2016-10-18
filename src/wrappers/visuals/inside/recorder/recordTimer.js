var pauseable   = require('pauseable'),
    h           = require('hyperscript'),
    hidden      = require('hidden')

module.exports = function(visuals, recordNote, options) {

    var recordTimerElement,

        nearComputed    = false,
        endNighComputed = false,

        timer,
        countdown

    function pad(n) {
        return n < 10 ? '0' + n : n
    }

    function thresholdReached(secs, threshold) {
        return secs >= options.video.limitSeconds * threshold
    }

    function isNear(secs) {
        if (!nearComputed && thresholdReached(secs, .6)) {
            nearComputed = true
            return true
        } else
            return false
    }

    function endIsNigh(secs) {
        if (!endNighComputed && thresholdReached(secs, .8)) {
            endNighComputed = true
            return true
        } else
            return false
    }

    function setNear() {
        recordTimerElement.classList.add('near')
    }

    function setNigh() {
        recordTimerElement.classList.add('nigh')
    }

    function update(cb) {
        // stop any existing ones first
        timer && timer.clear()

        var mins = parseInt(countdown / 60, 10),
            secs = countdown - mins * 60

        if (!nearComputed || !endNighComputed) {
            var remainingSeconds = options.video.limitSeconds - countdown

            if (isNear(remainingSeconds)) {

                recordNote.setNear()
                setNear()

                options.debug('End is near, ' + countdown + ' seconds to go')

            } else if (endIsNigh(remainingSeconds)) {

                recordNote.setNigh()
                setNigh()

                options.debug('End is nigh, ' + countdown + ' seconds to go')
            }
        }

        recordTimerElement.innerHTML = mins + ':' + pad(secs)

        // do not use 1000 but few milliseconds less due to CPU usage
        timer = pauseable.setTimeout(function() {
            countdown--

            if (countdown < 0)
                cb(true)
            else
                update(cb)
        }, 990)
    }

    function hide() {
        hidden(recordTimerElement, true)
    }

    function show() {
        recordTimerElement.classList.remove('near')
        recordTimerElement.classList.remove('nigh')

        hidden(recordTimerElement, false)
    }

    function getSecondsRecorded() {
        return options.video.limitSeconds - countdown
    }

    this.start = function(cb) {
        countdown    = options.video.limitSeconds - 1
        nearComputed = endNighComputed = false

        show()
        recordNote.show()

        update(cb)
    }

    this.pause = function() {
        timer && timer.pause()
        recordNote.hide()
    }

    this.resume = function() {
        timer.resume()
        recordNote.show()
    }

    this.stop = function() {
        options.debug('Stopping record timer. Was recording for ' + getSecondsRecorded() + " seconds.")

        hide()
        timer && timer.clear()
        recordNote.stop()
    }

    this.build = function() {
        recordTimerElement = visuals.querySelector('.recordTimer')

        if (!recordTimerElement) {
            recordTimerElement = h('p.recordTimer')

            hide()

            visuals.appendChild(recordTimerElement)
        } else
            hide()
    }
}
