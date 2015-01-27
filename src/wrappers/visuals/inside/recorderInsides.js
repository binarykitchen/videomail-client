var Countdown   = require('./recorder/countdown'),
    PausedNote  = require('./recorder/pausedNote'),
    RecordNote  = require('./recorder/recordNote'),
    RecordTimer = require('./recorder/recordTimer')

module.exports = function(visuals, options) {

    var countdown   = new Countdown(visuals, options),
        pausedNote  = new PausedNote(visuals, options),
        recordNote  = new RecordNote(visuals),
        recordTimer = new RecordTimer(visuals)

    this.build = function() {
        countdown.build()
        pausedNote.build()
        recordNote.build()
        recordTimer.build()
    }

    this.showPause = function() {
        pausedNote.show()
    }

    this.hidePause = function() {
        pausedNote.hide()
    }

    this.startCountdown = function(cb) {
        countdown.start(cb)
    }

    this.isCountingDown = function() {
        return countdown.isCountingDown()
    }
}
