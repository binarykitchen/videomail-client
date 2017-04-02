const h           = require('hyperscript'),
      hidden      = require('hidden')

module.exports = function(visuals, recordNote, options) {

    var recordTimerElement,

        nearComputed    = false,
        endNighComputed = false,

        started,
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

    this.check = function(opts) {
        const intervalSum = opts.intervalSum // it is in ms

        countdown = getStartSeconds() - Math.floor(intervalSum / 1e3)

        update()

        if (countdown < 1) {
            visuals.stop(true)
        }
    }

    function update() {
        const mins = parseInt(countdown / 60, 10),
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
        return getStartSeconds() - countdown
    }

    function getStartSeconds() {
        return options.video.limitSeconds
    }

    this.start = function() {
        countdown    = getStartSeconds()
        nearComputed = endNighComputed = false
        started = true

        update()

        show()
    }

    this.pause = function() {
        recordNote.hide()
    }

    this.resume = function() {
        recordNote.show()
    }

    function isStopped() {
        return countdown === null
    }

    this.stop = function() {
        if (!isStopped() && started) {
            options.debug('Stopping record timer. Was recording for about ~' + getSecondsRecorded() + " seconds.")

            hide()
            recordNote.stop()

            countdown = null
            started = false
        }
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
