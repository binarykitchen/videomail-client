var util         = require('util'),

    Events       = require('./../../../events'),
    EventEmitter = require('./../../../util/eventEmitter'),

    Countdown   = require('./recorder/countdown'),
    PausedNote  = require('./recorder/pausedNote'),
    RecordNote  = require('./recorder/recordNote'),
    RecordTimer = require('./recorder/recordTimer')

var RecorderInsides = function(visuals, options) {

    EventEmitter.call(this, options, 'RecorderInsides')

    var self = this,

        recordNote  = new RecordNote(visuals),
        recordTimer = new RecordTimer(visuals, recordNote, options),

        countdown,
        pausedNote,
        built

    if (options.video.countdown)
        countdown = new Countdown(visuals, options)

    if (options.enablePause)
        pausedNote = new PausedNote(visuals, options)

    function startRecording(cb) {
        recordTimer.start(cb)
    }

    function resumeRecording() {
        recordTimer.resume()
    }

    function stopRecording() {
        recordTimer.stop()
    }

    function pauseRecording() {
        recordTimer.pause()
    }

    function initEvents() {
        self
            .on(Events.RECORDING, function() {
                startRecording(function(limitReached) {
                    visuals.stop(limitReached)
                })
            })
            .on(Events.RESUMING, function() {
                resumeRecording()
            })
            .on(Events.STOPPING, function() {
                stopRecording()
            })
            .on(Events.PAUSED, function() {
                pauseRecording()
            })
            .on(Events.RESETTING, function() {
                self.hidePause()
                self.hideCountdown()
                recordTimer.stop()
            })
    }

    this.build = function() {
        countdown && countdown.build()
        pausedNote&& pausedNote.build()

        recordNote.build()
        recordTimer.build()

        !built && initEvents()

        built = true
    }

    this.showPause = function() {
        pausedNote && pausedNote.show()
    }

    this.hidePause = function() {
        pausedNote && pausedNote.hide()
    }

    this.hideCountdown = function() {
        countdown && countdown.hide()
    }

    this.startCountdown = function(cb) {
        countdown && countdown.start(cb)
    }

    this.isCountingDown = function() {
        return countdown && countdown.isCountingDown()
    }
}

util.inherits(RecorderInsides, EventEmitter)

module.exports = RecorderInsides
