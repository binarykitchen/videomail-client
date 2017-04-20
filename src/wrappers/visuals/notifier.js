var util = require('util')
var h = require('hyperscript')
var hidden = require('hidden')

var EventEmitter = require('./../../util/eventEmitter')
var Events = require('./../../events')

var Notifier = function (visuals, options) {
  EventEmitter.call(this, options, 'Notifier')

  var self = this
  var debug = options && options.debug

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

  function onLoadingUserMedia () {
    self.notify('Loading webcam …')
  }

  function onProgress (frameProgress, sampleProgress) {
    var overallProgress

    if (options.isAudioEnabled()) {
      overallProgress = 'Video: ' + frameProgress

      if (sampleProgress) { overallProgress += ', Audio: ' + sampleProgress }
    } else { overallProgress = frameProgress }

    self.setExplanation(overallProgress)
  }

  function onBeginVideoEncoding () {
    visuals.beginWaiting()

    var lead = options.text.encoding + ' …'

    self.notify(lead, null, {
      stillWait: true,
      entertain: options.notifier.entertain
    })

    hideExplanation()
  }

  function initEvents () {
    debug('Notifier: initEvents()')

    self
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
        var randomBackgroundClass = Math.floor((Math.random() * options.notifier.entertainLimit) + 1)

        notifyElement.className = 'notifier entertain ' +
                options.notifier.entertainClass +
                randomBackgroundClass

        entertainTimeoutId = setTimeout(runEntertainment, options.notifier.entertainInterval)
        entertaining = true
      }
    } else { cancelEntertainment() }
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
    var problem = messageOptions.problem ? messageOptions.problem : false

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
    var message = err.message ? err.message.toString() : err.toString()
    var explanation = err.explanation ? err.explanation.toString() : null

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
    notifyElement = visuals.querySelector('.notifier')

    if (!notifyElement) {
      notifyElement = h('.notifier') // defaults to div

      this.hide()

      visuals.appendChild(notifyElement)
    } else { this.hide() }

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

    if (messageElement) { messageElement.innerHTML = null }

    hideExplanation()
  }

  this.isVisible = function () {
    if (!built) { return false } else { return notifyElement && !hidden(notifyElement) }
  }

  this.notify = function (message, explanation, notifyOptions) {
    if (!notifyOptions) {
      notifyOptions = {}
    }

    var stillWait = notifyOptions.stillWait ? notifyOptions.stillWait : false
    var entertain = notifyOptions.entertain ? notifyOptions.entertain : false
    var blocking = notifyOptions.blocking ? notifyOptions.blocking : false
    var hideForm = notifyOptions.hideForm ? notifyOptions.hideForm : false
    var classList = notifyOptions.classList ? notifyOptions.classList : false
    var removeDimensions = notifyOptions.removeDimensions ? notifyOptions.removeDimensions : false

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

    show()

    !stillWait && visuals.endWaiting()
  }
}

util.inherits(Notifier, EventEmitter)

module.exports = Notifier
