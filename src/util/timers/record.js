var PausableTimer = require('./pausable')

module.exports = function(options) {

    var recordNote  = document.querySelector('#' + options.selectors.containerId + ' .recordNote'),
        recordTimer = document.querySelector('#' + options.selectors.containerId + ' .recordTimer'),
        paused      = document.querySelector('#' + options.selectors.containerId + ' .paused'),

        nearComputed    = false,
        endNighComputed = false,

        pausableTimer,
        countdown

    function pad(n) {
        return (n < 10 ? '0' + n : n)
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

    function update(cb) {
        // stop any existing ones first
        pausableTimer && pausableTimer.stop()

        var mins = parseInt(countdown / 60, 10),
            secs = countdown - mins * 60

        if (!nearComputed || !endNighComputed) {
            var remainingSeconds = options.video.limitSeconds - countdown

            if (isNear(remainingSeconds)) {

                recordNote.className = recordTimer.className = 'near'

                options.debug('End is near, ' + countdown + ' seconds to go')

            } else if (endIsNigh(remainingSeconds)) {

                recordNote.className = recordTimer.className = 'nigh'

                options.debug('End is nigh, ' + countdown + ' seconds to go')
            }
        }

        recordTimer.innerHTML = mins + ':' + pad(secs)

        // do not use 1000 but few milliseconds less due to CPU usage
        pausableTimer = new PausableTimer(980, function() {
            countdown--

            if (countdown < 0)
                cb()
            else
                update(cb)
        })
    }

    this.start = function(cb) {
        countdown     = options.video.limitSeconds
        nearComputed  = endNighComputed = false

        recordNote.classList.remove('hide')
        recordTimer.classList.remove('hide')

        update(cb)
    }

    this.clear = function() {
        pausableTimer && pausableTimer.stop()

        recordNote.classList.remove('near')
        recordTimer.classList.remove('near')

        recordNote.classList.remove('nigh')
        recordTimer.classList.remove('nigh')

        return this
    }

    this.hide = function() {
        recordNote.classList.add('hide')
        recordTimer.classList.add('hide')
        paused.classList.add('hide')
    }

    this.pause = function() {
        if (pausableTimer) {
            pausableTimer.pause()

            paused.classList.remove('hide')
            recordNote.classList.add('hide')
        }
    }

    this.resume = function() {
        if (pausableTimer) {
            pausableTimer.resume()

            paused.classList.add('hide')
            recordNote.classList.remove('hide')
        }
    }
}
