var insertCss = require('insert-css')
var merge = require('merge-recursive')
var hidden = require('hidden')
var util = require('util')
var Visibility = require('document-visibility')

var Dimension = require('./dimension')
var Visuals = require('./visuals')
var Buttons = require('./buttons')
var Form = require('./form')

var Resource = require('./../resource')
var Events = require('./../events')

var EventEmitter = require('./../util/eventEmitter')
var VideomailError = require('./../util/videomailError')
var css = require('./../styles/css/main.min.css.js')

var Container = function (options) {
  EventEmitter.call(this, options, 'Container')

  var self = this

  var visibility = Visibility()
  var visuals = new Visuals(this, options)
  var buttons = new Buttons(this, options)
  var resource = new Resource(options)
  var htmlElement = document && document.querySelector && document.querySelector('html')
  var debug = options.debug

  var hasError = false
  var submitted = false
  var lastValidation = false

  var containerElement
  var built
  var form

  function prependDefaultCss () {
    insertCss(css, {prepend: true})
  }

    // since https://github.com/binarykitchen/videomail-client/issues/87
  function findParentFormElement () {
    return containerElement.closest('form')
  }

  function getFormElement () {
    var formElement

    if (containerElement.tagName === 'FORM') { formElement = containerElement } else if (options.selectors.formId) { formElement = document.getElementById(options.selectors.formId) } else { formElement = findParentFormElement() }

    return formElement
  }

  function buildForm () {
    var formElement = getFormElement()

    if (formElement) {
      form = new Form(self, formElement, options)

      var submitButton = form.findSubmitButton()
      submitButton && buttons.setSubmitButton(submitButton)

      form.build()
    }
  }

  function buildChildren () {
    if (!containerElement.classList) {
      self.emit(Events.ERROR, VideomailError.create('Sorry, your browser is too old!'))
    } else {
      containerElement.classList.add('videomail')

      buttons.build()
      visuals.build()
    }
  }

  function processError (err) {
    hasError = true

    if (err.stack) { options.logger.error(err.stack) } else { options.logger.error(err) }

    if (options.displayErrors) { visuals.error(err) } else { visuals.reset() }
  }

  function initEvents () {
    window.addEventListener('beforeunload', function (e) {
      self.unload(e)
    })

    visibility.onChange(function (visible) {
      // built? see https://github.com/binarykitchen/videomail.io/issues/326
      if (built) {
        if (visible) {
          if (options.isAutoPauseEnabled() && self.isCountingDown()) {
            self.resume()
          }

          self.emit(Events.VISIBLE)
        } else {
          if (options.isAutoPauseEnabled() && (self.isCountingDown() || self.isRecording())) {
            self.pause('document invisible')
          }

          self.emit(Events.INVISIBLE)
        }
      }
    })

    if (options.enableSpace) {
      window.addEventListener('keypress', function (e) {
        var tagName = e.target.tagName

        if (tagName !== 'INPUT' && tagName !== 'TEXTAREA') {
          var code = e.keyCode ? e.keyCode : e.which

          if (code === 32) {
            e.preventDefault()

            if (options.enablePause) {
              visuals.pauseOrResume()
            } else {
              visuals.recordOrStop()
            }
          }
        }
      })
    }

    // better to keep the one and only error listeners
    // at one spot, here, because unload() will do a removeAllListeners()
    self
      .on(Events.ERROR, function (err) {
        processError(err)
        unloadChildren(err)

        if (err.removeDimensions && err.removeDimensions()) {
          removeDimensions()
        }
      })
      .on(Events.LOADED_META_DATA, function () {
        correctDimensions()
      })
  }

  function validateOptions () {
    if (options.hasDefinedWidth() && options.video.width % 2 !== 0) {
      throw VideomailError.create('Width must be divisible by two.')
    }

    if (options.hasDefinedHeight() && options.video.height % 2 !== 0) {
      throw VideomailError.create('Height must be divisible by two.')
    }
  }

    // this will just set the width but not the height because
    // it can be a form with more inputs elements
  function correctDimensions () {
    var width = visuals.getRecorderWidth(true)

    if (width < 1) {
      throw VideomailError.create('Recorder width cannot be less than 1!')
    } else {
      containerElement.style.width = width + 'px'
    }
  }

  function removeDimensions () {
    containerElement.style.width = 'auto'
  }

  function unloadChildren (e) {
    visuals.unload(e)
    buttons.unload()
    self.endWaiting()
  }

  function hideMySelf () {
    hidden(containerElement, true)
  }

    // fixes https://github.com/binarykitchen/videomail-client/issues/71
  function trimEmail (email) {
    return email.replace(/(^[,\s]+)|([,\s]+$)/g, '')
  }

  function submitVideomail (formData, method, cb) {
    var FORM_FIELDS = {
      'subject': options.selectors.subjectInputName,
      'from': options.selectors.fromInputName,
      'to': options.selectors.toInputName,
      'body': options.selectors.bodyInputName,
      'key': options.selectors.keyInputName,
      'parentKey': options.selectors.parentKeyInputName
    }
    var videomailFormData = {}

    Object.keys(FORM_FIELDS).forEach(function (key) {
      if (formData.hasOwnProperty(FORM_FIELDS[key])) { videomailFormData[key] = formData[FORM_FIELDS[key]] }
    })

    if (videomailFormData.from) {
      videomailFormData.from = trimEmail(videomailFormData.from)
    }

    if (videomailFormData.to) {
      videomailFormData.to = trimEmail(videomailFormData.to)
    }

        // when method is undefined, treat it as a post
    if (isPost(method) || !method) {
      videomailFormData.recordingStats = visuals.getRecordingStats()
      videomailFormData.width = visuals.getRecorderWidth(true)
      videomailFormData.height = visuals.getRecorderHeight(true)

      resource.post(videomailFormData, cb)
    } else if (isPut(method)) { resource.put(videomailFormData, cb) }
  }

  function submitForm (formData, videomailResponse, url, cb) {
    formData[options.selectors.aliasInputName] = videomailResponse.videomail.alias

    resource.form(formData, url, cb)
  }

  function finalizeSubmissions (err, method, videomail, response, formResponse) {
    self.endWaiting()

    if (err) {
      self.emit(Events.ERROR, err)
    } else {
      submitted = true

            // merge two json response bodies to fake as if it were only one request
      if (formResponse && formResponse.body) {
        Object.keys(formResponse.body).forEach(function (key) {
          response[key] = formResponse.body[key]
        })
      }

      self.emit(
        Events.SUBMITTED,
        videomail,
        response
      )

      if (formResponse && formResponse.type === 'text/html' && formResponse.text) {
        // server replied with HTML contents - display these
        document.body.innerHTML = formResponse.text

        // todo: figure out how to fire dom's onload event again
        // todo: or how to run all the scripts over again
      }
    }
  }

  this.addPlayerDimensions = function (videomail, element) {
    try {
      videomail.playerHeight = this.calculateHeight({
        responsive: true,
        videoWidth: videomail.width,
        ratio: videomail.height / videomail.width
      }, element)

      videomail.playerWidth = this.calculateWidth({
        responsive: true,
        videoHeight: videomail.playerHeight,
        ratio: videomail.height / videomail.width
      })

      return videomail
    } catch (exc) {
      self.emit(Events.ERROR, exc)
    }
  }

  this.limitWidth = function (width) {
    return Dimension.limitWidth(containerElement, width)
  }

  this.limitHeight = function (height) {
    return Dimension.limitHeight(height)
  }

  this.calculateWidth = function (fnOptions) {
    return Dimension.calculateWidth(merge.recursive(options, fnOptions))
  }

  this.calculateHeight = function (fnOptions, element) {
    if (!element) {
      if (containerElement) {
        element = containerElement
      } else {
        // better than nothing
        element = document.body
      }
    }

    return Dimension.calculateHeight(element, merge.recursive(options, fnOptions))
  }

  this.areVisualsHidden = function () {
    return visuals.isHidden()
  }

  this.hasElement = function () {
    return !!containerElement
  }

  this.build = function () {
    try {
      containerElement = document.getElementById(options.selectors.containerId)

      // only build when a container element hast been found, otherwise
      // be silent and do nothing
      if (containerElement) {
        options.insertCss && prependDefaultCss()

        !built && initEvents()
        validateOptions()
        correctDimensions()
        buildForm()
        buildChildren()

        if (!hasError) {
          built = true
          self.emit(Events.BUILT)
        }
      }
    } catch (exc) {
      if (built) {
        self.emit(Events.ERROR, exc)
      } else {
        throw exc
      }
    }
  }

  this.getSubmitButton = function () {
    return buttons.getSubmitButton()
  }

  this.querySelector = function (selector) {
    return containerElement.querySelector(selector)
  }

  this.beginWaiting = function () {
    htmlElement.classList && htmlElement.classList.add('wait')
  }

  this.endWaiting = function () {
    htmlElement.classList && htmlElement.classList.remove('wait')
  }

  this.appendChild = function (child) {
    containerElement.appendChild(child)
  }

  this.insertBefore = function (child, reference) {
    containerElement.insertBefore(child, reference)
  }

  this.unload = function (e) {
    debug('Container: unload()', e)

    try {
      unloadChildren(e)
      this.removeAllListeners()

      built = submitted = false
    } catch (exc) {
      self.emit(Events.ERROR, exc)
    }
  }

  this.show = function () {
    if (containerElement) {
      hidden(containerElement, false)

      visuals.show()

      if (!hasError) {
        var paused = self.isPaused()

        if (paused) {
          buttons.adjustButtonsForPause()
        }

        // since https://github.com/binarykitchen/videomail-client/issues/60
        // we hide areas to make it easier for the user
        buttons.show()

        if (self.isReplayShown()) { self.emit(Events.PREVIEW) } else {
          self.emit(Events.FORM_READY, {paused: paused})
          debug('Building stream connection to server ...')
        }
      }
    }
  }

  this.hide = function () {
    hasError = false

    this.isRecording() && this.pause()

    visuals.hide()

    if (submitted) {
      buttons.hide()
      hideMySelf()
    }
  }

  this.showReplayOnly = function () {
    hasError = false

    this.isRecording() && this.pause()

    visuals.showReplayOnly()

    submitted && buttons.hide()
  }

  this.isNotifying = function () {
    return visuals.isNotifying()
  }

  this.isPaused = function () {
    return visuals.isPaused()
  }

  this.pause = function (params) {
    visuals.pause(params)
  }

  this.startOver = function () {
    try {
      submitted = false
      form.show()
      visuals.back(this.show)
    } catch (exc) {
      self.emit(Events.ERROR, exc)
    }
  }

    // this code needs a good rewrite :(
  this.validate = function (force) {
    var runValidation = true
    var valid

    if (!options.enableAutoValidation) {
      runValidation = false
      lastValidation = true // needed so that it can be submitted anyway, see submit()
    } else if (force) {
      runValidation = force
    } else if (self.isNotifying()) {
      runValidation = false
    } else if (visuals.isConnected()) {
      runValidation = visuals.isUserMediaLoaded() || visuals.isReplayShown()
    } else if (visuals.isConnecting()) {
      runValidation = false
    }

    if (runValidation) {
      this.emit(Events.VALIDATING)

      var visualsValid = visuals.validate() && buttons.isRecordAgainButtonEnabled()
      var whyInvalid

      if (form) {
        valid = form.validate()

        if (valid) {
          if (!this.areVisualsHidden() && !visualsValid) {
            if (this.isReady() || this.isRecording() || this.isPaused() || this.isCountingDown()) { valid = false }

            if (!valid) { whyInvalid = 'Video is not recorded' }
          }
        } else {
          var invalidInput = form.getInvalidElement()

          if (invalidInput) {
            whyInvalid = 'Form input named ' + invalidInput.name + ' is invalid'
          } else {
            whyInvalid = 'Form input(s() are invalid'
          }
        }
      } else { valid = visualsValid }

      if (valid) { this.emit(Events.VALID) } else { this.emit(Events.INVALID, whyInvalid) }

      lastValidation = valid
    }

    return valid
  }

  this.disableForm = function (buttonsToo) {
    form && form.disable(buttonsToo)
  }

  this.enableForm = function (buttonsToo) {
    form && form.enable(buttonsToo)
  }

  this.hasForm = function () {
    return !!form
  }

  this.isReady = function () {
    return buttons.isRecordButtonEnabled()
  }

  function isPost (method) {
    return method && method.toUpperCase() === 'POST'
  }

  function isPut (method) {
    return method && method.toUpperCase() === 'PUT'
  }

  this.submitAll = function (formData, method, url) {
    this.beginWaiting()
    this.disableForm(true)
    this.emit(Events.SUBMITTING)

    var post = isPost(method)

        // a closure so that we can access method
    var submitVideomailCallback = function (err1, videomail, videomailResponse) {
      if (err1) {
        finalizeSubmissions(err1, method, videomail, videomailResponse)
      } else if (post) {
                // for now, accept POSTs only which have an URL unlike null and
                // treat all other submissions as direct submissions

        if (!url || url === '') { url = document.baseURI } // figure out URL automatically then

        submitForm(formData, videomailResponse, url, function (err2, formResponse) {
          finalizeSubmissions(err2, method, videomail, videomailResponse, formResponse)
        })
      } else {
                // it's a direct submission
        finalizeSubmissions(null, method, videomail, videomailResponse)
      }
    }

    submitVideomail(formData, method, submitVideomailCallback)
  }

  this.isBuilt = function () {
    return built
  }

  this.isReplayShown = function () {
    return visuals.isReplayShown()
  }

  this.isDirty = function () {
    var isDirty = false

    if (form) {
      if (visuals.isRecorderUnloaded()) { isDirty = false } else if (this.isReplayShown() || this.isPaused()) { isDirty = true }
    }

    return isDirty
  }

  this.getReplay = function () {
    return visuals.getReplay()
  }

  this.isOutsideElementOf = function (element) {
    return element.parentNode !== containerElement && element !== containerElement
  }

  this.hideForm = function () {
    form.hide()
  }

  this.loadForm = function (videomail) {
    form.loadVideomail(videomail)
    this.validate()
  }

  this.enableAudio = function () {
    options.setAudioEnabled(true)
    this.emit(Events.ENABLING_AUDIO)
  }

  this.disableAudio = function () {
    options.setAudioEnabled(false)
    this.emit(Events.DISABLING_AUDIO)
  }

  this.submit = function () {
    lastValidation && form && form.doTheSubmit()
  }

  this.isCountingDown = visuals.isCountingDown.bind(visuals)
  this.isRecording = visuals.isRecording.bind(visuals)
  this.record = visuals.record.bind(visuals)
  this.resume = visuals.resume.bind(visuals)
  this.stop = visuals.stop.bind(visuals)
  this.recordAgain = visuals.recordAgain.bind(visuals)
}

util.inherits(Container, EventEmitter)

module.exports = Container
