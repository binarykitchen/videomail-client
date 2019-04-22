import util from 'util'

import Events from './../../../events'
import EventEmitter from './../../../util/eventEmitter'

import Countdown from './recorder/countdown'
import PausedNote from './recorder/pausedNote'
import RecordNote from './recorder/recordNote'
import RecordTimer from './recorder/recordTimer'
import FacingMode from './recorder/facingMode'

const RecorderInsides = function (visuals, options) {
  EventEmitter.call(this, options, 'RecorderInsides')

  const self = this
  const debug = options.debug

  const recordNote = new RecordNote(visuals)
  const recordTimer = new RecordTimer(visuals, recordNote, options)

  var countdown
  var pausedNote
  var built
  var facingMode

  if (options.video.countdown) {
    countdown = new Countdown(visuals, options)
  }

  if (options.video.facingModeButton) {
    facingMode = new FacingMode(visuals, options)
  }

  if (options.enablePause) {
    pausedNote = new PausedNote(visuals, options)
  }

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
    facingMode && facingMode.hide()
  }

  function initEvents () {
    debug('RecorderInsides: initEvents()')

    self
      .on(Events.USER_MEDIA_READY, function () {
        facingMode && facingMode.show()
      })
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
    debug('RecorderInsides: build()')

    countdown && countdown.build()
    pausedNote && pausedNote.build()
    facingMode && facingMode.build()

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

export default RecorderInsides
