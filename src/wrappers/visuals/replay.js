import util from 'util'
import h from 'hyperscript'
import hidden from 'hidden'
import addEventListenerWithOptions from 'add-eventlistener-with-options'

import Events from './../../events'
import Browser from './../../util/browser'
import EventEmitter from './../../util/eventEmitter'
import VideomailError from './../../util/videomailError'

import enableInlineVideo from 'iphone-inline-video'

const Replay = function (parentElement, options) {
  EventEmitter.call(this, options, 'Replay')

  const self = this
  const browser = new Browser(options)
  const debug = options.debug

  var built
  var replayElement
  var videomail

  function buildElement () {
    debug('Replay: buildElement()')

    replayElement = h('video.' + options.selectors.replayClass)

    if (!replayElement.setAttribute) {
      throw VideomailError.create('Please upgrade browser', options)
    }

    parentElement.appendChild(replayElement)
  }

  function isStandalone () {
    return parentElement.constructor.name === 'HTMLDivElement'
  }

  function copyAttributes (newVideomail) {
    var attributeContainer

    Object.keys(newVideomail).forEach(function (attribute) {
      attributeContainer = parentElement.querySelector('.' + attribute)

      if (attributeContainer) {
        attributeContainer.innerHTML = newVideomail[attribute]
      }
    })
  }

  function correctDimensions (options) {
    var width, height

    if (videomail && videomail.playerWidth) {
      width = videomail.playerWidth
    } else if (parentElement.calculateWidth) {
      width = parentElement.calculateWidth(options)
    }

    if (videomail && videomail.playerHeight) {
      height = videomail.playerHeight
    } else if (parentElement.calculateHeight) {
      height = parentElement.calculateHeight(options)
    }

    if (width > 0) {
      replayElement.style.width = width + 'px'
    } else {
      replayElement.style.width = 'auto'
    }

    if (height > 0) {
      replayElement.style.height = height + 'px'
    } else {
      replayElement.style.height = 'auto'
    }
  }

  this.setVideomail = function (newVideomail) {
    videomail = newVideomail

    if (videomail) {
      if (videomail.webm) {
        this.setWebMSource(videomail.webm)
      }

      if (videomail.mp4) {
        this.setMp4Source(videomail.mp4)
      }

      if (videomail.poster) {
        replayElement.setAttribute('poster', videomail.poster)
      }

      copyAttributes(videomail)
    }

    const hasAudio = videomail && videomail.recordingStats && videomail.recordingStats.sampleRate > 0

    this.show(
      videomail && videomail.width,
      videomail && videomail.height,
      hasAudio
    )
  }

  this.show = function (recorderWidth, recorderHeight, hasAudio) {
    if (videomail) {
      correctDimensions({
        responsive: true,
        // beware that recorderWidth and recorderHeight can be null sometimes
        videoWidth: recorderWidth || replayElement.videoWidth,
        videoHeight: recorderHeight || replayElement.videoHeight
      })
    }

    hidden(replayElement, false)

    // parent element can be any object, be careful!
    if (parentElement) {
      if (parentElement.style) {
        hidden(parentElement, false)
      } else if (parentElement.show) {
        parentElement.show()
      }
    }

    if (hasAudio) {
      // https://github.com/binarykitchen/videomail-client/issues/115
      // do not set mute to false as this will mess up. just do not mention this attribute at all
      replayElement.setAttribute('volume', 1)
    } else if (!options.isAudioEnabled()) {
      replayElement.setAttribute('muted', true)
    }

    // this must be called after setting the sources and when becoming visible
    // see https://github.com/bfred-it/iphone-inline-video/issues/16
    enableInlineVideo && enableInlineVideo(replayElement, {
      iPad: true
    })

    // this forces to actually fetch the videos from the server
    replayElement.load()

    if (!videomail) {
      self.emit(Events.PREVIEW_SHOWN)
    } else {
      self.emit(Events.REPLAY_SHOWN)
    }
  }

  this.build = function () {
    debug('Replay: build()')

    replayElement = parentElement.querySelector('video.' + options.selectors.replayClass)

    if (!replayElement) {
      buildElement()
    }

    this.hide()

    replayElement.setAttribute('autoplay', true)
    replayElement.setAttribute('autostart', true)
    replayElement.setAttribute('autobuffer', true)
    replayElement.setAttribute('playsinline', true)
    replayElement.setAttribute('webkit-playsinline', 'webkit-playsinline')
    replayElement.setAttribute('controls', 'controls')
    replayElement.setAttribute('preload', 'auto')

    if (!built) {
      if (!isStandalone()) {
        this.on(Events.PREVIEW, function (key, recorderWidth, recorderHeight) {
          self.show(recorderWidth, recorderHeight)
        })
      }

      // makes use of passive option automatically for better performance
      // https://www.npmjs.com/package/add-eventlistener-with-options
      addEventListenerWithOptions(replayElement, 'touchstart', function (e) {
        e && e.preventDefault()

        if (this.paused) {
          play()
        } else {
          pause()
        }
      })

      replayElement.onclick = function (e) {
        e && e.preventDefault()

        if (this.paused) {
          play()
        } else {
          pause()
        }
      }
    }

    built = true

    debug('Replay: built.')
  }

  this.unload = function () {
    built = false
  }

  this.getVideoSource = function (type) {
    const sources = replayElement.getElementsByTagName('source')
    const l = sources.length
    const videoType = 'video/' + type

    var source

    if (l) {
      var i

      for (i = 0; i < l && !source; i++) {
        if (sources[i].getAttribute('type') === videoType) {
          source = sources[i]
        }
      }
    }

    return source
  }

  function setVideoSource (type, src, bustCache) {
    var source = self.getVideoSource(type)

    if (src && bustCache) {
      src += '?' + Date.now()
    }

    if (!source) {
      if (src) {
        source = h('source', {
          src: src,
          type: 'video/' + type
        })

        replayElement.appendChild(source)
      }
    } else {
      if (src) {
        source.setAttribute('src', src)
      } else {
        replayElement.removeChild(source)
      }
    }
  }

  this.setMp4Source = function (src, bustCache) {
    setVideoSource('mp4', src, bustCache)
  }

  this.setWebMSource = function (src, bustCache) {
    setVideoSource('webm', src, bustCache)
  }

  this.getVideoType = function () {
    return browser.getVideoType(replayElement)
  }

  function pause (cb) {
    // avoids race condition, inspired by
    // http://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error
    setTimeout(() => {
      try {
        replayElement.pause()
      } catch (exc) {
        // just ignore, see https://github.com/binarykitchen/videomail.io/issues/386
        options.logger.warn(exc)
      }

      cb && cb()
    }, 15)
  }

  function play () {
    if (replayElement && replayElement.play) {
      const p = replayElement.play()

      if (p && (typeof Promise !== 'undefined') && (p instanceof Promise)) {
        p.catch((reason) => {
          options.logger.warn('Caught pending play exception: %s', reason)
        })
      }
    }
  }

  this.reset = function (cb) {
    // pause video to make sure it won't consume any memory
    pause(() => {
      if (replayElement) {
        self.setMp4Source(null)
        self.setWebMSource(null)
      }

      cb && cb()
    })
  }

  this.hide = function () {
    if (isStandalone()) {
      hidden(parentElement, true)
    } else {
      replayElement && hidden(replayElement, true)
    }
  }

  this.isShown = function () {
    return replayElement && !hidden(replayElement)
  }

  this.getParentElement = function () {
    return parentElement
  }
}

util.inherits(Replay, EventEmitter)

export default Replay
