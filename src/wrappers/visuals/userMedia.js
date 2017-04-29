var h = require('hyperscript')

var AudioRecorder = require('./../../util/audioRecorder')
var VideomailError = require('./../../util/videomailError')
var EventEmitter = require('./../../util/eventEmitter')
var MEDIA_EVENTS = require('./../../util/mediaEvents')
var pretty = require('./../../util/pretty')
var Events = require('./../../events')

var EVENT_ASCII = '|—O—|'

module.exports = function (recorder, options) {
  EventEmitter.call(this, options, 'UserMedia')

  var rawVisualUserMedia = recorder && recorder.getRawVisualUserMedia()
  var self = this

  var paused = false
  var record = false

  var audioRecorder
  var currentVisualStream

  function attachMediaStream (stream) {
    currentVisualStream = stream

    if (typeof rawVisualUserMedia.srcObject !== 'undefined') {
      rawVisualUserMedia.srcObject = stream
    } else if (typeof rawVisualUserMedia.src !== 'undefined') {
      var URL = window.URL || window.webkitURL
      rawVisualUserMedia.src = URL.createObjectURL(stream) || stream
    } else {
      throw VideomailError.create(
        'Error attaching stream to element.',
        'Contact the developer about this',
        options)
    }
  }

  function setVisualStream (localMediaStream) {
    if (localMediaStream) {
      attachMediaStream(localMediaStream)
    } else {
      rawVisualUserMedia.removeAttribute('srcObject')
      rawVisualUserMedia.removeAttribute('src')

      currentVisualStream = null
    }
  }

  function getVisualStream () {
    if (rawVisualUserMedia.mozSrcObject) {
      return rawVisualUserMedia.mozSrcObject
    } else if (rawVisualUserMedia.srcObject) {
      return rawVisualUserMedia.srcObject
    } else {
      return currentVisualStream
    }
  }

  function hasEnded () {
    if (rawVisualUserMedia.ended) {
      return rawVisualUserMedia.ended
    } else {
      var visualStream = getVisualStream()
      return visualStream && visualStream.ended
    }
  }

  function hasInvalidDimensions () {
    if ((rawVisualUserMedia.videoWidth && rawVisualUserMedia.videoWidth < 3) ||
        (rawVisualUserMedia.height && rawVisualUserMedia.height < 3)) {
      return true
    }
  }

  function getTracks (localMediaStream) {
    var tracks

    if (localMediaStream && localMediaStream.getTracks) {
      tracks = localMediaStream.getTracks()
    }

    return tracks
  }

  function getVideoTracks (localMediaStream) {
    var videoTracks

    if (localMediaStream && localMediaStream.getVideoTracks) {
      videoTracks = localMediaStream.getVideoTracks()
    }

    return videoTracks
  }

  function getFirstVideoTrack (localMediaStream) {
    var videoTracks = getVideoTracks(localMediaStream)
    var videoTrack

    if (videoTracks && videoTracks[0]) {
      videoTrack = videoTracks[0]
    }

    return videoTrack
  }

  function logEvent (event, params) {
    options.debug('UserMedia: ...', EVENT_ASCII, 'event', event, JSON.stringify(params))
  }

  function isPromise (anything) {
    return (anything && (typeof Promise !== 'undefined') && (anything instanceof Promise))
  }

  this.init = function (localMediaStream, videoCallback, audioCallback, endedEarlyCallback) {
    this.stop(localMediaStream, true)

    var onPlayReached = false
    var onLoadedMetaDataReached = false
    var playingPromiseReached = false

    if (options && options.isAudioEnabled()) {
      audioRecorder = audioRecorder || new AudioRecorder(this, options)
    }

    function audioRecord () {
      self.removeListener(Events.SENDING_FIRST_FRAME, audioRecord)
      audioRecorder && audioRecorder.record(audioCallback)
    }

    function unloadAllEventListeners () {
      options.debug('UserMedia: unloadAllEventListeners()')

      self.removeListener(Events.SENDING_FIRST_FRAME, audioRecord)

      rawVisualUserMedia.removeEventListener &&
      rawVisualUserMedia.removeEventListener('play', onPlay)

      rawVisualUserMedia.removeEventListener &&
      rawVisualUserMedia.removeEventListener('loadedmetadata', onLoadedMetaData)

      MEDIA_EVENTS.forEach(function (eventName) {
        rawVisualUserMedia.removeEventListener(eventName, outputEvent)
      })
    }

    function play () {
      // Resets the media element and restarts the media resource. Any pending events are discarded.
      // But do them in the next tick to ensure event queue is ready for a lot to come
      //
      // this also to have the abort and emptied event to be processed as early as possible before
      // all the other important events to come
      setTimeout(function () {
        try {
          // todo debug and fix that weird error
          // The play() request was interrupted by a new load request.
          options.debug(
            'UserMedia: play()',
            'media.readyState=' + rawVisualUserMedia.readyState,
            'media.paused=' + rawVisualUserMedia.paused,
            'media.ended=' + rawVisualUserMedia.ended,
            'media.played=' + pretty(rawVisualUserMedia.played)
          )

          rawVisualUserMedia.load()
          var p = rawVisualUserMedia.play()

          // using the promise here just experimental for now
          // and this to catch any weird errors early if possible
          if (isPromise(p)) {
            p.then(function () {
              if (!playingPromiseReached) {
                options.debug('UserMedia: ... play promise successful. Playing now.')
                playingPromiseReached = true
              }
            }).catch(function (reason) {
              // promise can be interrupted, i.E. when switching tabs
              // and promise can get resumed when switching back to tab, hence
              // do not treat this like an error
              options.debug('UserMedia:', reason.toString())
            })
          }
        } catch (exc) {
          unloadAllEventListeners()
          endedEarlyCallback(exc)
        }
      }, 0)
    }

    function fireCallbacks () {
      var readyState = rawVisualUserMedia.readyState

      // ready state, see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
      options.debug(
        'UserMedia: fireCallbacks(' +
        'readyState=' + readyState + ', ' +
        'onPlayReached=' + onPlayReached + ', ' +
        'onLoadedMetaDataReached=' + onLoadedMetaDataReached + ')'
      )

      if (onPlayReached && onLoadedMetaDataReached) {
        videoCallback()

        if (audioRecorder && audioCallback) {
          try {
            audioRecorder.init(localMediaStream)
            self.on(Events.SENDING_FIRST_FRAME, audioRecord)
          } catch (exc) {
            unloadAllEventListeners()
            endedEarlyCallback(exc)
          }
        }
      }
    }

    function onPlay () {
      try {
        logEvent('play', {
          readyState: rawVisualUserMedia.readyState,
          audio: options.isAudioEnabled(),
          width: rawVisualUserMedia.width,
          height: rawVisualUserMedia.height,
          videoWidth: rawVisualUserMedia.videoWidth,
          videoHeight: rawVisualUserMedia.videoHeight
        })

        rawVisualUserMedia.removeEventListener &&
        rawVisualUserMedia.removeEventListener('play', onPlay)

        if (hasEnded() || hasInvalidDimensions()) {
          endedEarlyCallback(
            VideomailError.create(
              'Already busy',
              'Probably another browser window is using your webcam?',
              options,
              true
            )
          )
        } else {
          onPlayReached = true
          fireCallbacks()
        }
      } catch (exc) {
        unloadAllEventListeners()
        endedEarlyCallback(exc)
      }
    }

    // player modifications to perform that must wait until `loadedmetadata` has been triggered
    function onLoadedMetaData () {
      logEvent('loadedmetadata', {
        readyState: rawVisualUserMedia.readyState,
        width: rawVisualUserMedia.width,
        height: rawVisualUserMedia.height,
        videoWidth: rawVisualUserMedia.videoWidth,
        videoHeight: rawVisualUserMedia.videoHeight
      })

      rawVisualUserMedia.removeEventListener &&
      rawVisualUserMedia.removeEventListener('loadedmetadata', onLoadedMetaData)

      if (!hasEnded() && !hasInvalidDimensions()) {
        self.emit(Events.LOADED_META_DATA)

        // for android devices, we cannot call play() unless meta data has been loaded!
        play()

        onLoadedMetaDataReached = true
        fireCallbacks()
      }
    }

    try {
      var videoTrack = getFirstVideoTrack(localMediaStream)

      if (!videoTrack) {
        options.debug('UserMedia: detected (but no video tracks exist')
      } else if (!videoTrack.enabled) {
        throw VideomailError.create(
          'Webcam is disabled',
          'The video track seems to be disabled. Enable it in your system.',
          options
        )
      } else {
        var description

        if (videoTrack.label && videoTrack.label.length > 0) {
          description = videoTrack.label
        }

        description += ' with enabled=' + videoTrack.enabled
        description += ', muted=' + videoTrack.muted
        description += ', remote=' + videoTrack.remote
        description += ', readyState=' + videoTrack.readyState
        description += ', error=' + videoTrack.error

        options.debug(
          'UserMedia: ' + videoTrack.kind + ' detected.',
          description || ''
        )
      }

      // very useful i think, so leave this and just use options.debug()
      var heavyDebugging = true

      if (heavyDebugging) {
        var outputEvent = function (e) {
          logEvent(e.type, {readyState: rawVisualUserMedia.readyState})

          // remove myself
          rawVisualUserMedia.removeEventListener &&
          rawVisualUserMedia.removeEventListener(e.type, outputEvent)
        }

        MEDIA_EVENTS.forEach(function (eventName) {
          rawVisualUserMedia.addEventListener(eventName, outputEvent, false)
        })
      }

      rawVisualUserMedia.addEventListener('loadedmetadata', onLoadedMetaData)
      rawVisualUserMedia.addEventListener('play', onPlay)

      // experimental, not sure if this is ever needed/called? since 2 apr 2017
      // An error occurs while fetching the media data.
      // Error is an object with the code MEDIA_ERR_NETWORK or higher.
      // networkState equals either NETWORK_EMPTY or NETWORK_IDLE, depending on when the download was aborted.
      rawVisualUserMedia.addEventListener('error', function (err) {
        self.emit(Events.ERROR, VideomailError.create(
          'Weird webcam error',
          // https://github.com/binarykitchen/videomail.io/issues/323
          JSON.stringify(err), // tried just with err but returns only "{}"
          options
        ))
      })

      setVisualStream(localMediaStream)

      play()
    } catch (exc) {
      self.emit(Events.ERROR, exc)
    }
  }

  this.isReady = function () {
    return !!rawVisualUserMedia.src
  }

  this.stop = function (visualStream, aboutToInitialize) {
    try {
      // do not stop "too much" when going to initialize anyway
      if (!aboutToInitialize) {
        if (!visualStream) {
          visualStream = getVisualStream()
        }

        var tracks = getTracks(visualStream)
        var newStopApiFound = false

        if (tracks) {
          tracks.forEach(function (track) {
            if (track.stop) {
              newStopApiFound = true
              track.stop()
            }
          })
        }

        // will probably become obsolete in one year (after june 2017)
        !newStopApiFound && visualStream && visualStream.stop && visualStream.stop()

        setVisualStream(null)

        audioRecorder && audioRecorder.stop()

        audioRecorder = null
      }

      paused = record = false
    } catch (exc) {
      self.emit(Events.ERROR, exc)
    }
  }

  this.createCanvas = function () {
    return h('canvas', {
      width: this.getRawWidth(true),
      height: this.getRawHeight(true)
    })
  }

  this.getVideoHeight = function () {
    return rawVisualUserMedia.videoHeight
  }

  this.getVideoWidth = function () {
    return rawVisualUserMedia.videoWidth
  }

  this.getRawWidth = function (responsive) {
    var rawWidth = this.getVideoWidth()
    var widthDefined = options.hasDefinedWidth()

    if (widthDefined || options.hasDefinedHeight()) {
      if (!responsive && widthDefined) {
        rawWidth = options.video.width
      } else {
        rawWidth = recorder.calculateWidth(responsive)
      }
    }

    if (responsive) {
      rawWidth = recorder.limitWidth(rawWidth)
    }

    return rawWidth
  }

  this.getRawHeight = function (responsive) {
    var rawHeight

    if (options.hasDefinedDimension()) {
      rawHeight = recorder.calculateHeight(responsive)

      if (rawHeight < 1) {
        throw VideomailError.create('Bad dimensions', 'Calculated raw height cannot be less than 1!', options)
      }
    } else {
      rawHeight = this.getVideoHeight()

      if (rawHeight < 1) {
        throw VideomailError.create('Bad dimensions', 'Raw video height from DOM element cannot be less than 1!', options)
      }
    }

    if (responsive) {
      rawHeight = recorder.limitHeight(rawHeight)
    }

    return rawHeight
  }

  this.getRawVisuals = function () {
    return rawVisualUserMedia
  }

  this.pause = function () {
    paused = true
  }

  this.isPaused = function () {
    return paused
  }

  this.resume = function () {
    paused = false
  }

  this.record = function () {
    record = true
  }

  this.isRecording = function () {
    return record
  }

  this.getAudioSampleRate = function () {
    if (audioRecorder) {
      return audioRecorder.getSampleRate()
    } else {
      return -1
    }
  }

  this.getCharacteristics = function () {
    return {
      audioSampleRate: this.getAudioSampleRate(),
      muted: rawVisualUserMedia && rawVisualUserMedia.muted,
      width: rawVisualUserMedia && rawVisualUserMedia.width,
      height: rawVisualUserMedia && rawVisualUserMedia.height,
      videoWidth: rawVisualUserMedia && rawVisualUserMedia.videoWidth,
      videoHeight: rawVisualUserMedia && rawVisualUserMedia.videoHeight
    }
  }
}
