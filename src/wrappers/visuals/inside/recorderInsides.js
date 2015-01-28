var Countdown   = require('./recorder/countdown'),
    PausedNote  = require('./recorder/pausedNote'),
    RecordNote  = require('./recorder/recordNote'),
    RecordTimer = require('./recorder/recordTimer')

module.exports = function(visuals, options) {

    var recordNote  = new RecordNote(visuals),
        recordTimer = new RecordTimer(visuals),

        countdown,
        pausedNote

    if (options.video.countdown)
        countdown = new Countdown(visuals, options)

    if (options.enablePause)
        pausedNote = new PausedNote(visuals, options)

    this.build = function() {
        countdown && countdown.build()
        pausedNote&& pausedNote.build()

        recordNote.build()
        recordTimer.build()
    }

    this.showPause = function() {
        pausedNote && pausedNote.show()
    }

    this.hidePause = function() {
        pausedNote && pausedNote.hide()
    }

    this.startCountdown = function(cb) {
        countdown && countdown.start(cb)
    }

    this.isCountingDown = function() {
        return countdown && countdown.isCountingDown()
    }

    this.showRecordNote = function() {
        recordNote.show()
    }

    this.hideRecordNote = function() {
        recordNote.hide()
    }
}
