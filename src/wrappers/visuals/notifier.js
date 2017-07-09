import util from 'util'
import h from 'hyperscript'
import hidden from 'hidden'

import EventEmitter from './../../util/eventEmitter'
import Events from './../../events'

const Notifier = function (visuals, options) {
  EventEmitter.call(this, options, 'Notifier')

  const self = this
  const debug = options && options.debug

  var notifyElement
  var messageElement
  var explanationElement
  var entertainTimeoutId
  var entertaining
  var built

  function onStopping (limitReached) {
    var lead = ''

    visuals.beginWaiting()

    if (limitReached) {
      debug('Limit reached')
      lead += options.text.limitReached + '.<br/>'
    }

    lead += options.text.sending + ' …'

    self.notify(lead, null, {
      stillWait: true,
      entertain: options.notifier.entertain
    })
  }

  function onConnecting () {
    self.notify('Connecting …')
  }

  function onLoadingUserMedia () {
    self.notify('Loading webcam …')
  }

  function onProgress (frameProgress, sampleProgress) {
    var overallProgress

    if (options.isAudioEnabled()) {
      overallProgress = 'Video: ' + frameProgress

      if (sampleProgress) {
        overallProgress += ', Audio: ' + sampleProgress
      }
    } else {
      overallProgress = frameProgress
    }

    self.setExplanation(overallProgress)
  }

  function onBeginVideoEncoding () {
    visuals.beginWaiting()

    const lead = options.text.encoding + ' …'

    self.notify(lead, null, {
      stillWait: true,
      entertain: options.notifier.entertain
    })

    hideExplanation()
  }

  function initEvents () {
    debug('Notifier: initEvents()')

    self
      .on(Events.CONNECTING, function () {
        onConnecting()
      })
      .on(Events.LOADING_USER_MEDIA, function () {
        onLoadingUserMedia()
      })
      .on(Events.USER_MEDIA_READY, function () {
        self.hide()
      })
      .on(Events.LOADED_META_DATA, function () {
        correctDimensions()
      })
      .on(Events.PREVIEW, function () {
        self.hide()
      })
      .on(Events.STOPPING, function (limitReached) {
        onStopping(limitReached)
      })
      .on(Events.PROGRESS, function (frameProgress, sampleProgress) {
        onProgress(frameProgress, sampleProgress)
      })
      .on(Events.BEGIN_VIDEO_ENCODING, function () {
        onBeginVideoEncoding()
      })
  }

  function correctDimensions () {
    notifyElement.style.width = visuals.getRecorderWidth(true) + 'px'
    notifyElement.style.height = visuals.getRecorderHeight(true) + 'px'
  }

  function show () {
    notifyElement && hidden(notifyElement, false)
  }

  function runEntertainment () {
    if (options.notifier.entertain) {
      if (!entertaining) {
        const randomBackgroundClass = Math.floor((Math.random() * options.notifier.entertainLimit) + 1)

        notifyElement.className = 'notifier entertain ' +
                options.notifier.entertainClass +
                randomBackgroundClass

        entertainTimeoutId = setTimeout(runEntertainment, options.notifier.entertainInterval)
        entertaining = true
      }
    } else {
      cancelEntertainment()
    }
  }

  function cancelEntertainment () {
    if (notifyElement) {
      notifyElement.classList.remove('entertain')
    }

    clearTimeout(entertainTimeoutId)
    entertainTimeoutId = null
    entertaining = false
  }

  function setMessage (message, messageOptions) {
    const problem = messageOptions.problem ? messageOptions.problem : false

    if (messageElement) {
      messageElement.innerHTML = (problem ? '&#x2639; ' : '') + message
    } else {
      options.logger.warn(
        'Unable to show following because messageElement is empty:',
        message
      )
    }
  }

  this.error = function (err) {
    const message = err.message ? err.message.toString() : err.toString()
    const explanation = err.explanation ? err.explanation.toString() : null

    if (!message) {
      options.debug('Weird empty message generated for error', err)
    }

    self.notify(message, explanation, {
      blocking: true,
      problem: true,
      hideForm: err.hideForm && err.hideForm(),
      classList: err.getClassList && err.getClassList(),
      removeDimensions: err.removeDimensions && err.removeDimensions()
    })
  }

  this.setExplanation = function (explanation) {
    if (!explanationElement) {
      explanationElement = h('p')

      if (notifyElement) {
        notifyElement.appendChild(explanationElement)
      } else {
        options.logger.warn(
          'Unable to show explanation because notifyElement is empty:',
          explanation
        )
      }
    }

    explanationElement.innerHTML = explanation

    hidden(explanationElement, false)
  }

  this.build = function () {
    options.debug('Notifier: build()')

    notifyElement = visuals.querySelector('.notifier')

    if (!notifyElement) {
      notifyElement = h('.notifier') // defaults to div

      this.hide()

      visuals.appendChild(notifyElement)
    } else {
      this.hide()
    }

    !built && initEvents()

    built = true
  }

  function hideExplanation () {
    if (explanationElement) {
      explanationElement.innerHTML = null
      hidden(explanationElement, true)
    }
  }

  this.hide = function () {
    cancelEntertainment()

    if (notifyElement) {
      hidden(notifyElement, true)
      notifyElement.classList.remove('blocking')
    }

    if (messageElement) {
      messageElement.innerHTML = null
    }

    hideExplanation()
  }

  this.isVisible = function () {
    if (!built) {
      return false
    } else {
      return notifyElement && !hidden(notifyElement)
    }
  }

  this.isBuilt = function () {
    return built
  }

  this.notify = function (message, explanation, notifyOptions) {
    options.debug('Notifier: notify()')

    if (!notifyOptions) {
      notifyOptions = {}
    }

    const stillWait = notifyOptions.stillWait ? notifyOptions.stillWait : false
    const entertain = notifyOptions.entertain ? notifyOptions.entertain : false
    const blocking = notifyOptions.blocking ? notifyOptions.blocking : false
    const hideForm = notifyOptions.hideForm ? notifyOptions.hideForm : false
    const classList = notifyOptions.classList ? notifyOptions.classList : false
    const removeDimensions = notifyOptions.removeDimensions ? notifyOptions.removeDimensions : false

    if (!messageElement && notifyElement) {
      messageElement = h('h2')

      if (explanationElement) {
        notifyElement.insertBefore(messageElement, explanationElement)
      } else {
        notifyElement.appendChild(messageElement)
      }
    }

    if (notifyElement) {
      // reset
      if (!entertain) {
        notifyElement.className = 'notifier'
      }

      if (classList) {
        classList.forEach(function (className) {
          notifyElement.classList.add(className)
        })
      }

      if (removeDimensions) {
        notifyElement.style.width = 'auto'
        notifyElement.style.height = 'auto'
      }
    }

    if (blocking) {
      notifyElement && notifyElement.classList.add('blocking')
      this.emit(Events.BLOCKING, {hideForm: hideForm})
    } else {
      this.emit(Events.NOTIFYING)
    }

    visuals.hideReplay()
    visuals.hideRecorder()

    setMessage(message, notifyOptions)

    explanation && this.setExplanation(explanation)

    if (entertain) {
      runEntertainment()
    } else {
      cancelEntertainment()
    }

    // just as a safety in case if an error is thrown in the middle of the build process
    // and visuals aren't built/shown yet.
    visuals.showVisuals()

    show()

    !stillWait && visuals.endWaiting()
  }
}

util.inherits(Notifier, EventEmitter)

export default Notifier
