var util = require('util')

var Events = require('./../../../events')
var EventEmitter = require('./../../../util/eventEmitter')

var Countdown = require('./recorder/countdown')
var PausedNote = require('./recorder/pausedNote')
var RecordNote = require('./recorder/recordNote')
var RecordTimer = require('./recorder/recordTimer')

var RecorderInsides = function (visuals, options) {
  EventEmitter.call(this, options, 'RecorderInsides')

  var self = this

  var recordNote = new RecordNote(visuals)
  var recordTimer = new RecordTimer(visuals, recordNote, options)

  var countdown,
    pausedNote,
    built

  if (options.video.countdown) { countdown = new Countdown(visuals, options) }

  if (options.enablePause) { pausedNote = new PausedNote(visuals, options) }

  function startRecording () {
    recordTimer.start()
  }

  function resumeRecording () {
    recordTimer.resume()
  }

  function stopRecording () {
    recordTimer.stop()
  }

  function pauseRecording () {
    if (self.isCountingDown()) {
      countdown.pause()
    } else {
      recordTimer.pause()
    }
  }

  function onResetting () {
    self.hidePause()
    self.hideCountdown()
    recordTimer.stop()
  }

  function initEvents () {
    self
            .on(Events.RECORDING, function () {
              startRecording()
            })
            .on(Events.RESUMING, function () {
              resumeRecording()
            })
            .on(Events.STOPPING, function () {
              stopRecording()
            })
            .on(Events.PAUSED, function () {
              pauseRecording()
            })
            .on(Events.RESETTING, onResetting)
            .on(Events.HIDE, function () {
              self.hideCountdown()
            })
  }

  this.build = function () {
    countdown && countdown.build()
    pausedNote && pausedNote.build()

    recordNote.build()
    recordTimer.build()

    !built && initEvents()

    built = true
  }

  this.unload = function () {
    countdown && countdown.unload()

    built = false
  }

  this.showPause = function () {
    pausedNote && pausedNote.show()
  }

  this.hidePause = function () {
    pausedNote && pausedNote.hide()
  }

  this.hideCountdown = function () {
    countdown && countdown.hide()
  }

  this.startCountdown = function (cb) {
    countdown && countdown.start(cb)
  }

  this.resumeCountdown = function () {
    countdown && countdown.resume()
  }

  this.isCountingDown = function () {
    return countdown && countdown.isCountingDown()
  }

  this.checkTimer = function (intervalSum) {
    recordTimer.check(intervalSum)
  }
}

util.inherits(RecorderInsides, EventEmitter)

module.exports = RecorderInsides
