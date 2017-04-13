var websocket = require('websocket-stream')
var Frame = require('canvas-to-buffer')
var util = require('util')
var h = require('hyperscript')
var hidden = require('hidden')
var animitter = require('animitter')

var UserMedia = require('./userMedia')

var Events = require('./../../events')
var Constants = require('./../../constants')
var EventEmitter = require('./../../util/eventEmitter')
var Browser = require('./../../util/browser')
var Humanize = require('./../../util/humanize')
var VideomailError = require('./../../util/videomailError')

var Recorder = function (visuals, replay, options) {
  EventEmitter.call(this, options, 'Recorder')

    // validate some options this class needs
  if (!options || !options.video || !options.video.fps) { throw VideomailError.create('FPS must be defined', options) }

  var self = this
  var browser = new Browser(options)
  var debug = options.debug

  var loop = null

  var originalAnimationFrameObject

  var samplesCount = 0
  var framesCount = 0

  var recordingStats = {}

  var confirmedFrameNumber = 0
  var confirmedSampleNumber = 0

  var recorderElement
  var userMedia

  var userMediaTimeout
  var retryTimeout

  var bytesSum

  var frameProgress
  var sampleProgress

  var canvas
  var ctx

  var userMediaLoaded
  var userMediaLoading
  var submitting
  var unloaded
  var stopTime
  var stream
  var connecting
  var connected
  var blocking
  var built
  var key
  var waitingTime

  var pingInterval

  var frame

  var recordingBufferLength
  var recordingBuffer

  function writeStream (buffer, opts) {
    if (stream) {
      if (stream.destroyed) {
        self.emit(Events.ERROR, VideomailError.create(
          'Already disconnected',
          'Sorry, the connection to the server has been destroyed. Please reload.',
          options
        ))
      } else {
        var onFlushedCallback = opts && opts.onFlushedCallback

        stream.write(buffer, function () {
          onFlushedCallback && onFlushedCallback(opts)
        })
      }
    }
  }

  function sendPings () {
    pingInterval = window.setInterval(function () {
      debug('Recorder: pinging...')
      writeStream(Buffer.from(''))
    }, options.timeouts.pingInterval)
  }

  function stopPings () {
    clearInterval(pingInterval)
  }

  function onAudioSample (audioSample) {
    samplesCount++

    var audioBuffer = audioSample.toBuffer()

    // if (options.verbose) {
    //     debug(
    //         'Sample #' + samplesCount + ' (' + audioBuffer.length + ' bytes):'
    //     )
    // }

    writeStream(audioBuffer)
  }

  function show () {
    recorderElement && hidden(recorderElement, false)
  }

  function onUserMediaReady () {
    try {
      debug('Recorder: onUserMediaReady()')

      userMediaLoading = blocking = unloaded = submitting = false
      userMediaLoaded = true

      loop = createLoop()

      show()
      self.emit(Events.USER_MEDIA_READY, {paused: self.isPaused()})
    } catch (exc) {
      self.emit(Events.ERROR, exc)
    }
  }

  function clearRetryTimeout () {
    debug('Recorder: clearRetryTimeout()')

    retryTimeout && clearTimeout(retryTimeout)
    retryTimeout = null
  }

  function clearUserMediaTimeout () {
    if (userMediaTimeout) {
      debug('Recorder: clearUserMediaTimeout()')

      userMediaTimeout && clearTimeout(userMediaTimeout)
      userMediaTimeout = null
    }
  }

  function calculateFrameProgress () {
    return (confirmedFrameNumber / (framesCount || 1) * 100).toFixed(2) + '%'
  }

  function calculateSampleProgress () {
    return (confirmedSampleNumber / (samplesCount || 1) * 100).toFixed(2) + '%'
  }

  function updateOverallProgress () {
        // when progresses aren't initialized,
        // then do a first calculation to avoid `infinite` or `null` displays

    if (!frameProgress) { frameProgress = calculateFrameProgress() }

    if (!sampleProgress) { sampleProgress = calculateSampleProgress() }

    self.emit(
            Events.PROGRESS,
            frameProgress,
            sampleProgress
        )
  }

  function updateFrameProgress (args) {
    confirmedFrameNumber = args.frame ? args.frame : confirmedFrameNumber

    frameProgress = calculateFrameProgress()

    updateOverallProgress()
  }

  function updateSampleProgress (args) {
    confirmedSampleNumber = args.sample ? args.sample : confirmedSampleNumber

    sampleProgress = calculateSampleProgress()

    updateOverallProgress()
  }

  function preview (args) {
    confirmedFrameNumber =
        confirmedSampleNumber =
        samplesCount =
        framesCount = 0

    sampleProgress =
        frameProgress = null

    key = args.key

    if (args.mp4) {
      replay.setMp4Source(
        args.mp4 + Constants.SITE_NAME_LABEL + '/' + options.siteName + '/videomail.mp4',
        true
      )
    }

    if (args.webm) {
      replay.setWebMSource(
        args.webm + Constants.SITE_NAME_LABEL + '/' + options.siteName + '/videomail.webm',
        true
      )
    }

    self.hide()
    self.emit(Events.PREVIEW, key, self.getRecorderWidth(true), self.getRecorderHeight(true))

        // keep it for recording stats
    waitingTime = Date.now() - stopTime

    recordingStats.waitingTime = waitingTime

    if (options.debug) {
      debug(
                'While recording, %s have been transferred and waiting time was %s',
                Humanize.filesize(bytesSum, 2),
                Humanize.toTime(waitingTime)
            )
    }
  }

  function initSocket (cb) {
    if (!connected) {
      connecting = true

      debug('Recorder: initialising web socket to %s', options.socketUrl)

            // https://github.com/maxogden/websocket-stream#binary-sockets

            // we use query parameters here because we cannot set custom headers in web sockets,
            // see https://github.com/websockets/ws/issues/467

      var url2Connect =
                 options.socketUrl +
                 '?' +
                 encodeURIComponent(Constants.SITE_NAME_LABEL) +
                 '=' +
                 encodeURIComponent(options.siteName)

      try {
        stream = websocket(url2Connect, {
          // see https://github.com/maxogden/websocket-stream/issues/116#issuecomment-292704362
          perMessageDeflate: false
        })
      } catch (exc) {
        connecting = connected = false

        var err = VideomailError.create(
          'Failed to create websocket',
          'Cause: ' + exc.toString() + ', URL: ' + url2Connect,
          options
        )

        self.emit(Events.ERROR, err)
      }

            // useful for debugging streams

            // if (!stream.originalEmit)
            //     stream.originalEmit = stream.emit

            // stream.emit = function(type) {
            //     if (stream) {
            //         debug('Websocket stream emitted:', type)
            //         var   args = Array.prototype.slice.call(arguments, 0)
            //         return stream.originalEmit.apply(stream, args)
            //     }
            // }

      if (stream) {
        stream.on('close', function (err) {
          debug('x Stream has closed')

          connecting = connected = false

          if (err) {
            self.emit(Events.ERROR, err || 'Unhandled websocket error')
          } else {
            self.emit(Events.DISCONNECTED)

            // prevents from https://github.com/binarykitchen/videomail.io/issues/297 happening i think
            cancelAnimationFrame()
          }
        })

        stream.on('connect', function () {
          if (!connected) {
            connected = true
            connecting = unloaded = false

            self.emit(Events.CONNECTED)

            debug('Asking for webcam permissons now.')

            cb && cb()
          }
        })

        stream.on('data', function (data) {
          executeCommand.call(self, data)
        })

        stream.on('error', function (err) {
          connecting = connected = false
          self.emit(Events.ERROR, err)
        })

        stream.on('drain', function () {
          debug('Stream drain eveng emitted (should not happen!)')
        })
      }
    }
  }

  function showUserMedia () {
    return isNotifying() || !isHidden() || blocking
  }

  function userMediaErrorCallback (err) {
    userMediaLoading = false

    clearUserMediaTimeout()

    var errorListeners = self.listeners(Events.ERROR)

    if (errorListeners.length) {
      self.emit(Events.ERROR, err)

      // retry after a while
      retryTimeout = setTimeout(initSocket, options.timeouts.userMedia)
    } else {
      debug('Recorder: no error listeners attached but throwing error', err)

      // weird situation, throw it since there are no error listeners
      throw VideomailError.create(err)
    }
  }

  function getUserMediaCallback (localStream) {
    debug('Recorder: getUserMediaCallback()')

    if (showUserMedia()) {
      try {
        clearUserMediaTimeout()

        userMedia.init(
          localStream,
          onUserMediaReady.bind(self),
          onAudioSample.bind(self),
          function (err) {
            self.emit(Events.ERROR, err)
          }
        )
      } catch (exc) {
        self.emit(Events.ERROR, exc)
      }
    }
  }

  function loadGenuineUserMedia () {
    if (!navigator) {
      throw new Error('Navigator is missing!')
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // prefer the front camera (if one is available) over the rear one
      var constraints = {
        video: {
          facingMode: 'user',
          frameRate: {ideal: options.video.fps}
        },
        audio: options.isAudioEnabled()
      }

      if (options.hasDefinedWidth()) {
        constraints.video.width = {ideal: options.video.width}
      }

      if (options.hasDefinedHeight()) {
        constraints.video.height = {ideal: options.video.height}
      }

      debug('Recorder: navigator.mediaDevices.getUserMedia()')

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(getUserMediaCallback)
        .catch(userMediaErrorCallback)
    } else {
      debug('Recorder: navigator.getUserMedia()')

      navigator.getUserMedia_({
        video: true,
        audio: options.isAudioEnabled()
      }, getUserMediaCallback, userMediaErrorCallback)
    }
  }

  function loadUserMedia () {
    if (userMediaLoaded) {
      debug('Recorder: skipping loadUserMedia() because it is already loaded')
      onUserMediaReady()
      return false
    } else if (userMediaLoading) {
      debug('Recorder: skipping loadUserMedia() because it is already asking for permission')
      return false
    }

    debug('Recorder: loadUserMedia()')

    self.emit(Events.LOADING_USER_MEDIA)

    try {
      userMediaTimeout = setTimeout(function () {
        if (!self.isReady()) {
          self.emit(Events.ERROR, browser.getNoAccessIssue())
        }
      }, options.timeouts.userMedia)

      userMediaLoading = true

      loadGenuineUserMedia()
    } catch (exc) {
      userMediaLoading = false

      var errorListeners = self.listeners(Events.ERROR)

      if (errorListeners.length) {
        self.emit(Events.ERROR, exc)
      } else {
        debug('Recorder: no error listeners attached but throwing exception', exc)
        throw exc // throw it further
      }
    }
  }

  function executeCommand (data) {
    try {
      var command

      try {
        command = JSON.parse(data.toString())
      } catch (excInner) {
        debug('Failed to parse command:', excInner)

        self.emit(Events.ERROR, VideomailError.create(
          'Failed to parse command.',
          // toString() since https://github.com/binarykitchen/videomail.io/issues/288
          data.toString(),
          options
        ))
      }

      var result

      debug(
        'Server commanded: %s',
        command.command,
        command.args ? ', ' + JSON.stringify(command.args) : '',
        result ? '= ' + result : ''
      )

      switch (command.command) {
        case 'ready':
          if (!userMediaTimeout) { loadUserMedia() }
          break
        case 'preview':
          preview(command.args)
          break
        case 'error':
          this.emit(Events.ERROR, VideomailError.create(
            'Oh no, server error!',
            command.args.err.toString() || '(No explanation given)',
            options
          ))
          break
        case 'confirmFrame':
          result = updateFrameProgress(command.args)
          break
        case 'confirmSample':
          result = updateSampleProgress(command.args)
          break
        case 'beginAudioEncoding':
          this.emit(Events.BEGIN_AUDIO_ENCODING)
          break
        case 'beginVideoEncoding':
          this.emit(Events.BEGIN_VIDEO_ENCODING)
          break
        default:
          this.emit(Events.ERROR, 'Unknown server command: ' + command.command)
          break
      }
    } catch (exc) {
      self.emit(Events.ERROR, exc)
    }
  }

  function isNotifying () {
    return visuals.isNotifying()
  }

  function isHidden () {
    return !recorderElement || hidden(recorderElement)
  }

  function writeCommand (command, args, cb) {
    if (!cb && args && args.constructor === Function) {
      cb = args
      args = null
    }

    if (!connected) {
      debug('Reconnecting for the command', command, '…')

      initSocket(function () {
        writeCommand(command, args)
        cb && cb()
      })
    } else if (stream) {
      debug('$ %s', command, args ? JSON.stringify(args) : '')

      var commandObj = {
        command: command,
        args: args
      }

      writeStream(Buffer.from(JSON.stringify(commandObj)))

      if (cb) {
        // keep all callbacks async
        setTimeout(function () {
          cb()
        }, 0)
      }
    }
  }

  function disconnect () {
    if (connected) {
      debug('Recorder: disconnect()')

      if (submitting) {
        // server will disconnect socket automatically after submitting
        connecting = connected = false
      } else if (stream) {
        // force to disconnect socket right now to clean temp files on server
        stream.end()
        stream = undefined
      }
    }
  }

  function cancelAnimationFrame () {
    loop && loop.dispose()
  }

  function getIntervalSum () {
    return loop.getElapsedTime()
  }

  function getAvgInterval () {
    return (getIntervalSum() / framesCount)
  }

  this.getRecordingStats = function () {
    return recordingStats
  }

  this.getAudioSampleRate = function () {
    return userMedia.getAudioSampleRate()
  }

  this.stop = function (limitReached) {
    debug('stop()')

    this.emit(Events.STOPPING, limitReached)

    loop.complete()

    stopTime = Date.now()

    recordingStats = {
      avgFps: loop.getFPS(),
      wantedFps: options.video.fps,
      avgInterval: getAvgInterval(),
      wantedInterval: 1e3 / options.video.fps,

      intervalSum: getIntervalSum(),
      framesCount: framesCount,
      videoType: replay.getVideoType()
    }

    if (options.isAudioEnabled()) {
      recordingStats.samplesCount = samplesCount
      recordingStats.sampleRate = userMedia.getAudioSampleRate()
    }

    writeCommand('stop', recordingStats)

        // beware, resetting will set framesCount to zero, so leave this here
    this.reset()
  }

  this.back = function (cb) {
    this.emit(Events.GOING_BACK)

    show()
    this.reset()

    writeCommand('back', cb)
  }

  function reInitialiseAudio () {
    debug('Recorder: reInitialiseAudio()')

    clearUserMediaTimeout()

        // important to free memory
    userMedia && userMedia.stop()

    userMediaLoaded = key = canvas = ctx = null

    loadUserMedia()
  }

  this.unload = function (e) {
    if (!unloaded) {
      var cause

      if (e) { cause = e.name || e.statusText || e.toString() }

      debug('Recorder: unload()' + (cause ? ', cause: ' + cause : ''))

      this.reset()

      clearUserMediaTimeout()

      disconnect()

      unloaded = true

      built = false
    }
  }

  this.reset = function () {
        // no need to reset when already unloaded
    if (!unloaded) {
      debug('Recorder: reset()')

      this.emit(Events.RESETTING)

      cancelAnimationFrame()

      // important to free memory
      userMedia && userMedia.stop()

      replay.reset()

      userMediaLoaded = key = canvas = ctx = waitingTime = null
    }
  }

  this.validate = function () {
    return connected && framesCount > 0 && canvas === null
  }

  this.isReady = function () {
    return userMedia.isReady()
  }

  this.pause = function (e) {
    var details

    if (e instanceof window.Event) {
      details = e.type
    } else if (e) {
      details = e.toString()
    }

    debug('pause()', details)

    userMedia.pause()
    loop.stop()

    this.emit(Events.PAUSED)

    sendPings()
  }

  this.isPaused = function () {
    return userMedia && userMedia.isPaused()
  }

  this.resume = function () {
    debug('Recorder: resume()')

    stopPings()

    this.emit(Events.RESUMING)

    userMedia.resume()
    loop.start()
  }

  function onFlushed (opts) {
    var frameNumber = opts && opts.frameNumber

    if (frameNumber === 1) {
      self.emit(Events.FIRST_FRAME_SENT)
    }
  }

  function createLoop () {
    var newLoop = animitter({fps: options.video.fps}, draw)

    // remember it first
    originalAnimationFrameObject = newLoop.getRequestAnimationFrameObject()

    return newLoop
  }

  function draw (deltaTime, elapsedTime) {
    try {
      // ctx and stream might become null while unloading
      if (!self.isPaused() && stream && ctx) {
        if (framesCount === 0) {
          self.emit(Events.SENDING_FIRST_FRAME)
        }

        framesCount++

        ctx.drawImage(
          userMedia.getRawVisuals(),
          0,
          0,
          canvas.width,
          canvas.height
        )

        recordingBuffer = frame.toBuffer()
        recordingBufferLength = recordingBuffer.length

        if (recordingBufferLength < 1) {
          throw VideomailError.create('Failed to extract webcam data.', options)
        }

        bytesSum += recordingBufferLength

        writeStream(recordingBuffer, {
          frameNumber: framesCount,
          onFlushedCallback: onFlushed
        })

        // if (options.verbose) {
        //   debug(
        //     'Frame #' + framesCount + ' (' + recordingBufferLength + ' bytes):',
        //     ' delta=' + deltaTime + 'ms, ' +
        //     ' elapsed=' + elapsedTime + 'ms'
        //   )
        // }

        visuals.checkTimer({intervalSum: elapsedTime})
      }
    } catch (exc) {
      self.emit(Events.ERROR, exc)
    }
  }

  this.record = function () {
    if (unloaded) {
      return false
    }

    // reconnect when needed
    if (!connected) {
      debug('Recorder: reconnecting before recording ...')

      initSocket(function () {
        self.once(Events.USER_MEDIA_READY, self.record)
      })

      return false
    }

    try {
      canvas = userMedia.createCanvas()
    } catch (exc) {
      self.emit(
        Events.ERROR,
        VideomailError.create('Failed to create canvas.', exc.toString(), options)
      )
      return false
    }

    ctx = canvas.getContext('2d')

    if (!canvas.width) {
      self.emit(
        Events.ERROR,
        VideomailError.create('Canvas has an invalid width.', options)
      )
      return false
    }

    if (!canvas.height) {
      self.emit(
        Events.ERROR,
        VideomailError.create('Canvas has an invalid height.', options)
      )
      return false
    }

    bytesSum = 0

    frame = new Frame(canvas, options)

    debug('Recorder: record()')
    userMedia.record()

    self.emit(Events.RECORDING, framesCount)

    loop.start()
  }

  function setAnimationFrameObject (newObj) {
    // must stop and then start to make it become effective, see
    // https://github.com/hapticdata/animitter/issues/5#issuecomment-292019168
    if (loop) {
      var isRecording = self.isRecording()

      loop.stop()
      loop.setRequestAnimationFrameObject(newObj)

      if (isRecording) {
        loop.start()
      }
    }
  }

  function restoreAnimationFrameObject () {
    debug('Recorder: restoreAnimationFrameObject()')

    setAnimationFrameObject(originalAnimationFrameObject)
  }

  function loopWithTimeouts () {
    debug('Recorder: loopWithTimeouts()')

    const wantedInterval = 1e3 / options.video.fps

    var processingTime = 0
    var start

    function raf (fn) {
      return setTimeout(
        function () {
          start = Date.now()
          fn()
          processingTime = Date.now() - start
        },
        // reducing wanted interval by respecting the time it takes to
        // compute internally since this is not multi-threaded like
        // requestAnimationFrame
        wantedInterval - processingTime
      )
    }

    function cancel (id) {
      clearTimeout(id)
    }

    setAnimationFrameObject({
      requestAnimationFrame: raf,
      cancelAnimationFrame: cancel
    })
  }

  function buildElement () {
    recorderElement = h('video.' + options.selectors.userMediaClass)
    visuals.appendChild(recorderElement)
  }

  function correctDimensions () {
    if (options.hasDefinedWidth()) { recorderElement.width = self.getRecorderWidth(true) }

    if (options.hasDefinedHeight()) { recorderElement.height = self.getRecorderHeight(true) }
  }

  function initEvents () {
    self
      .on(Events.SUBMITTING, function () {
        submitting = true
      })
      .on(Events.SUBMITTED, function () {
        submitting = false
        self.unload()
      })
      .on(Events.BLOCKING, function () {
        blocking = true
        clearUserMediaTimeout()
      })
      .on(Events.HIDE, function () {
        self.hide()
      })
      .on(Events.LOADED_META_DATA, function () {
        correctDimensions()
      })
      .on(Events.DISABLING_AUDIO, function () {
        reInitialiseAudio()
      })
      .on(Events.ENABLING_AUDIO, function () {
        reInitialiseAudio()
      })
      .on(Events.INVISIBLE, function () {
        loopWithTimeouts()
      })
      .on(Events.VISIBLE, function () {
        restoreAnimationFrameObject()
      })
  }

  this.build = function () {
    var err = browser.checkRecordingCapabilities()

    if (!err) { err = browser.checkBufferTypes() }

    if (err) { this.emit(Events.ERROR, err) } else {
      recorderElement = visuals.querySelector('video.' + options.selectors.userMediaClass)

      if (!recorderElement) { buildElement() }

      correctDimensions()

      // prevent audio feedback, see
      // https://github.com/binarykitchen/videomail-client/issues/35
      recorderElement.muted = true

      if (!userMedia) { userMedia = new UserMedia(this, options) }

      show()

      if (!built) {
        initEvents()

        if (!connected) { initSocket() } else { loadUserMedia() }
      } else { loadUserMedia() }

      built = true
    }
  }

  this.isPaused = function () {
    return userMedia && userMedia.isPaused() && !loop.isRunning()
  }

  this.isRecording = function () {
    // checking for stream.destroyed needed since
    // https://github.com/binarykitchen/videomail.io/issues/296
    return loop && loop.isRunning() && !this.isPaused() && !isNotifying() && stream && !stream.destroyed
  }

  this.hide = function () {
    if (!isHidden()) {
      recorderElement && hidden(recorderElement, true)

      clearUserMediaTimeout()
      clearRetryTimeout()
    }
  }

  this.isUnloaded = function () {
    return unloaded
  }

    // these two return the true dimensions of the webcam area.
    // needed because on mobiles they might be different.

  this.getRecorderWidth = function (responsive) {
    if (userMedia) { return userMedia.getRawWidth(responsive) } else if (responsive && options.hasDefinedWidth()) { return this.limitWidth(options.video.width) }
  }

  this.getRecorderHeight = function (responsive) {
    if (userMedia) { return userMedia.getRawHeight(responsive) } else if (responsive && options.hasDefinedHeight()) { return this.calculateHeight(responsive) }
  }

  function getRatio () {
    var ratio

    if (userMedia) { ratio = userMedia.getVideoHeight() / userMedia.getVideoWidth() } else { ratio = options.getRatio() }

    return ratio
  }

  this.calculateWidth = function (responsive) {
    var videoHeight

    if (userMedia) { videoHeight = userMedia.getVideoHeight() } else if (recorderElement) { videoHeight = recorderElement.videoHeight }

    return visuals.calculateWidth({
      responsive: responsive,
      ratio: getRatio(),
      videoHeight: videoHeight
    })
  }

  this.calculateHeight = function (responsive) {
    var videoWidth

    if (userMedia) { videoWidth = userMedia.getVideoWidth() } else if (recorderElement) { videoWidth = recorderElement.videoWidth }

    return visuals.calculateHeight({
      responsive: responsive,
      ratio: getRatio(),
      videoWidth: videoWidth
    })
  }

  this.getRawVisualUserMedia = function () {
    return recorderElement
  }

  this.isConnected = function () {
    return connected
  }

  this.isConnecting = function () {
    return connecting
  }

  this.limitWidth = function (width) {
    return visuals.limitWidth(width)
  }

  this.limitHeight = function (height) {
    return visuals.limitHeight(height)
  }

  this.isUserMediaLoaded = function () {
    return userMediaLoaded
  }
}

util.inherits(Recorder, EventEmitter)

module.exports = Recorder
