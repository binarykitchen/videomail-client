var util = require('util')
var h = require('hyperscript')
var hidden = require('hidden')

var Replay = require('./visuals/replay')
var Recorder = require('./visuals/recorder')
var Notifier = require('./visuals/notifier')
var RecorderInsides = require('./visuals/inside/recorderInsides')

var EventEmitter = require('./../util/eventEmitter')
var Events = require('./../events')

var Visuals = function (container, options) {
  EventEmitter.call(this, options, 'Visuals')

  var self = this

  var replay = new Replay(this, options)
  var recorder = new Recorder(this, replay, options)
  var recorderInsides = new RecorderInsides(this, options)

  var notifier = new Notifier(this, options)

  var debug = options.debug

  var visualsElement
  var built

  function buildNoScriptTag () {
    var noScriptElement = container.querySelector('noscript')

    if (!noScriptElement) {
      noScriptElement = h('noscript')
      noScriptElement.innerHTML = 'Please enable Javascript'

      visualsElement.appendChild(noScriptElement)
    }
  }

  function buildChildren () {
    debug('Visuals: buildChildren()')

    buildNoScriptTag()
    notifier.build()
    recorderInsides.build()
    replay.build()
  }

  function initEvents () {
    self
      .on(Events.USER_MEDIA_READY, function () {
        built = true
        self.endWaiting()
        container.enableForm(false)
      })
      .on(Events.PREVIEW, function () {
        self.endWaiting()
      })
      .on(Events.BLOCKING, function (blockingOptions) {
        if (!blockingOptions.hideForm && !options.adjustFormOnBrowserError) {
          // do nothing, user still can enter form inputs
          // can be useful when you are on i.E. seeflow's contact page and
          // still want to tick off the webcam option
        } else {
          container.disableForm(true)
        }
      })
      .on(Events.PREVIEW_SHOWN, function () {
        container.validate(true)
      })
      .on(Events.LOADED_META_DATA, function () {
        correctDimensions()
      })
      .on(Events.ERROR, function (err) {
        if (err.removeDimensions && err.removeDimensions()) {
          removeDimensions()
        }
      })
  }

  function correctDimensions () {
    visualsElement.style.width = self.getRecorderWidth(true) + 'px'
    visualsElement.style.height = self.getRecorderHeight(true) + 'px'
  }

  function removeDimensions () {
    visualsElement.style.width = 'auto'
    visualsElement.style.height = 'auto'
  }

  function isRecordable () {
    return !self.isNotifying() && !replay.isShown() && !self.isCountingDown()
  }

  this.isCountingDown = function () {
    return recorderInsides.isCountingDown()
  }

  this.build = function () {
    visualsElement = container.querySelector('.' + options.selectors.visualsClass)

    if (!visualsElement) {
      visualsElement = h('div.' + options.selectors.visualsClass)

      var buttonsElement = container.querySelector('.' + options.selectors.buttonsClass)

      // make sure it's placed before the buttons
      if (buttonsElement) {
        container.insertBefore(visualsElement, buttonsElement)
      } else {
        container.appendChild(visualsElement)
      }
    }

    visualsElement.classList.add('visuals')
    hidden(visualsElement, true)

    correctDimensions()

    !built && initEvents()
    buildChildren()

        // needed for replay handling and container.isParentElementOf()
    self.parentNode = visualsElement.parentNode

    built = true
  }

  this.querySelector = function (selector) {
    return visualsElement && visualsElement.querySelector(selector)
  }

  this.appendChild = function (child) {
    visualsElement && visualsElement.appendChild(child)
  }

  this.removeChild = function (child) {
    visualsElement.removeChild(child)
  }

  this.reset = function () {
    this.endWaiting()
    recorder.reset()
  }

  this.beginWaiting = function () {
    container.beginWaiting()
  }

  this.endWaiting = function () {
    container.endWaiting()
  }

  this.stop = function (params) {
    recorder.stop(params)
    recorderInsides.hidePause()
  }

  this.back = function (cb) {
    replay.hide()
    notifier.hide()
    recorder.back(cb)
  }

  this.recordAgain = function () {
    this.back(function () {
      self.once(Events.USER_MEDIA_READY, function () {
        self.record()
      })
    })
  }

  this.unload = function (e) {
    try {
      recorder.unload(e)
      recorderInsides.unload(e)
      replay.unload(e)

      built = false
    } catch (exc) {
      this.emit(Events.ERROR, exc)
    }
  }

  this.isNotifying = function () {
    return notifier.isVisible()
  }

  this.isReplayShown = function () {
    return replay.isShown()
  }

  this.pause = function (params) {
    recorder.pause(params)
    recorderInsides.showPause()
  }

  this.resume = function () {
    if (recorderInsides.isCountingDown()) {
      recorderInsides.resumeCountdown()
    } else {
      recorder.resume()
    }

    recorderInsides.hidePause()
  }

  this.pauseOrResume = function () {
    if (isRecordable.call(this)) {
      if (this.isRecording()) {
        this.pause()
      } else if (recorder.isPaused()) {
        this.resume()
      } else if (recorder.isReady()) {
        this.record()
      }
    }
  }

  this.recordOrStop = function () {
    if (isRecordable()) {
      if (this.isRecording()) {
        this.stop()
      } else if (recorder.isReady()) {
        this.record()
      }
    }
  }

  this.record = function () {
    if (options.video.countdown) {
      this.emit(Events.COUNTDOWN)
      recorderInsides.startCountdown(recorder.record.bind(recorder))
    } else { recorder.record() }
  }

  this.getRecorder = function () {
    return recorder
  }

  this.getReplay = function () {
    return replay
  }

  this.validate = function () {
    return recorder.validate() && this.isReplayShown()
  }

  this.getRecordingStats = function () {
    return recorder.getRecordingStats()
  }

  this.getAudioSampleRate = function () {
    return recorder.getAudioSampleRate()
  }

  this.isPaused = function () {
    return recorder.isPaused()
  }

  this.error = function (err) {
    notifier.error(err)
  }

  this.hide = function () {
    if (visualsElement) {
      hidden(visualsElement, true)
      this.emit(Events.HIDE)
    }
  }

  this.isHidden = function () {
    if (!built) {
      return true
    } else if (visualsElement) {
      return hidden(visualsElement)
    }
  }

  this.show = function () {
    !this.isReplayShown() && recorder.build()

    visualsElement && hidden(visualsElement, false)
  }

  this.showReplayOnly = function () {
    !this.isReplayShown() && replay.show()

    self.show()
    recorder.hide()
    notifier.hide()
  }

  this.isRecorderUnloaded = function () {
    return recorder.isUnloaded()
  }

  this.isConnecting = function () {
    return recorder.isConnecting()
  }

  this.getRecorderWidth = function (responsive) {
    return recorder.getRecorderWidth(responsive)
  }

  this.getRecorderHeight = function (responsive) {
    return recorder.getRecorderHeight(responsive)
  }

  this.limitWidth = function (width) {
    return container.limitWidth(width)
  }

  this.limitHeight = function (height) {
    return container.limitHeight(height)
  }

  this.calculateWidth = function (options) {
    return container.calculateWidth(options)
  }

  this.calculateHeight = function (options) {
    return container.calculateHeight(options)
  }

  this.getReplay = function () {
    return replay
  }

  this.getBoundingClientRect = function () {
    return visualsElement.getBoundingClientRect()
  }

  this.checkTimer = function (intervalSum) {
    recorderInsides.checkTimer(intervalSum)
  }

  this.isReplayShown = replay.isShown.bind(replay)
  this.hideReplay = replay.hide.bind(replay)
  this.hideRecorder = recorder.hide.bind(recorder)
  this.isRecording = recorder.isRecording.bind(recorder)
  this.isUserMediaLoaded = recorder.isUserMediaLoaded.bind(recorder)
  this.isConnected = recorder.isConnected.bind(recorder)
}

util.inherits(Visuals, EventEmitter)

module.exports = Visuals
