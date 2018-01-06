import insertCss from 'insert-css'
import hidden from 'hidden'
import util from 'util'
import Visibility from 'document-visibility'

import Dimension from './dimension'
import Visuals from './visuals'
import Buttons from './buttons'
import Form from './form'
import OptionsWrapper from './optionsWrapper'

import Resource from './../resource'
import Events from './../events'

import EventEmitter from './../util/eventEmitter'
import VideomailError from './../util/videomailError'
import css from './../styles/css/main.min.css.js'

var Container = function (options) {
  EventEmitter.call(this, options, 'Container')

  const self = this

  const visibility = Visibility()
  const visuals = new Visuals(this, options)
  const buttons = new Buttons(this, options)
  const resource = new Resource(options)
  const htmlElement = document && document.querySelector && document.querySelector('html')
  const debug = options.debug

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

    if (containerElement.tagName === 'FORM') {
      formElement = containerElement
    } else if (options.selectors.formId) {
      formElement = document.getElementById(options.selectors.formId)
    } else {
      formElement = findParentFormElement()
    }

    return formElement
  }

  function buildForm () {
    const formElement = getFormElement()

    if (formElement) {
      debug('Container: buildForm()')
      form = new Form(self, formElement, options)

      const submitButton = form.findSubmitButton()
      submitButton && buttons.setSubmitButton(submitButton)

      form.build()
    }
  }

  function buildChildren () {
    debug('Container: buildChildren()')

    if (!containerElement.classList) {
      self.emit(Events.ERROR, VideomailError.create('Sorry, your browser is too old!', options))
    } else {
      containerElement.classList.add('videomail')

      if (!options.playerOnly) {
        buttons.build()
      }

      visuals.build()
    }
  }

  function processError (err) {
    hasError = true

    if (err.stack) {
      options.logger.error(err.stack)
    } else {
      options.logger.error(err)
    }

    if (options.displayErrors) {
      visuals.error(err)
    } else {
      visuals.reset()
    }
  }

  function initEvents () {
    debug('Container: initEvents()')

    window.addEventListener('beforeunload', (e) => {
      self.unload(e)
    })

    if (!options.playerOnly) {
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
    }

    if (options.enableSpace) {
      if (!options.playerOnly) {
        window.addEventListener('keypress', function (e) {
          const tagName = e.target.tagName
          const isEditable = e.target.isContentEditable ||
                             e.target.contentEditable === 'true' ||
                             e.target.contentEditable === true

          // beware of rich text editors, hence the isEditable check (wordpress plugin issue)
          if (!isEditable && tagName !== 'INPUT' && tagName !== 'TEXTAREA') {
            const code = e.keyCode ? e.keyCode : e.which

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
    }

    // better to keep the one and only error listeners
    // at one spot, here, because unload() will do a removeAllListeners()
    self.on(Events.ERROR, function (err) {
      processError(err)
      unloadChildren(err)

      if (err.removeDimensions && err.removeDimensions()) {
        removeDimensions()
      }
    })

    if (!options.playerOnly) {
      self.on(Events.LOADED_META_DATA, function () {
        correctDimensions()
      })
    }
  }

  function validateOptions () {
    if (options.hasDefinedWidth() && options.video.width % 2 !== 0) {
      throw VideomailError.create('Width must be divisible by two.', options)
    }

    if (options.hasDefinedHeight() && options.video.height % 2 !== 0) {
      throw VideomailError.create('Height must be divisible by two.', options)
    }
  }

  // this will just set the width but not the height because
  // it can be a form with more inputs elements
  function correctDimensions () {
    const width = visuals.getRecorderWidth(true)

    if (width < 1) {
      throw VideomailError.create('Recorder width cannot be less than 1!', options)
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
    const FORM_FIELDS = {
      'subject': options.selectors.subjectInputName,
      'from': options.selectors.fromInputName,
      'to': options.selectors.toInputName,
      'body': options.selectors.bodyInputName,
      'key': options.selectors.keyInputName,
      'parentKey': options.selectors.parentKeyInputName,
      'sendCopy': options.selectors.sendCopyInputName
    }

    const videomailFormData = {}

    Object.keys(FORM_FIELDS).forEach(function (key) {
      if (formData.hasOwnProperty(FORM_FIELDS[key])) {
        videomailFormData[key] = formData[FORM_FIELDS[key]]
      }
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
    } else if (isPut(method)) {
      resource.put(videomailFormData, cb)
    }
  }

  function submitForm (formData, videomailResponse, url, cb) {
    // for now, accept POSTs only which have an URL unlike null and
    // treat all other submissions as direct submissions

    if (!url || url === '') {
      // figure out URL automatically then
      url = document.baseURI
    }

    // can be missing when no videomail was recorded and is not required
    if (videomailResponse) {
      formData[options.selectors.aliasInputName] = videomailResponse.videomail.alias
    }

    resource.form(formData, url, cb)
  }

  function finalizeSubmissions (err, method, videomail, response, formResponse) {
    self.endWaiting()

    if (err) {
      self.emit(Events.ERROR, err)
    } else {
      submitted = true

      // merge two json response bodies to fake as if it were only one request
      if (response && formResponse && formResponse.body) {
        Object.keys(formResponse.body).forEach(function (key) {
          response[key] = formResponse.body[key]
        })
      }

      self.emit(
        Events.SUBMITTED,
        videomail,
        response || formResponse
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
    return Dimension.limitWidth(containerElement, width, options)
  }

  this.limitHeight = function (height) {
    return Dimension.limitHeight(height, options)
  }

  this.calculateWidth = function (fnOptions) {
    return Dimension.calculateWidth(
      OptionsWrapper.merge(options, fnOptions, true)
    )
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

    return Dimension.calculateHeight(
      element,
      OptionsWrapper.merge(options, fnOptions, true)
    )
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

        if (!options.playerOnly) {
          buildForm()
        }

        buildChildren()

        if (!hasError) {
          debug('Container: built.')
          built = true
          self.emit(Events.BUILT)
        } else {
          debug('Container: building failed due to an error.')
        }
      } else {
        // commented out since it does too much noise on videomail's view page which is fine
        // debug('Container: no container element with ID ' + options.selectors.containerId + ' found. Do nothing.')
      }
    } catch (exc) {
      if (visuals.isNotifierBuilt()) {
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
        const paused = self.isPaused()

        if (paused) {
          buttons.adjustButtonsForPause()
        }

        // since https://github.com/binarykitchen/videomail-client/issues/60
        // we hide areas to make it easier for the user
        buttons.show()

        if (self.isReplayShown()) {
          self.emit(Events.PREVIEW)
        } else {
          self.emit(Events.FORM_READY, {paused: paused})
        }
      }
    }
  }

  this.hide = function () {
    debug('Container: hide()')

    hasError = false

    this.isRecording() && this.pause()

    visuals.hide()

    if (submitted) {
      buttons.hide()
      hideMySelf()
    }
  }

  this.startOver = function (params) {
    try {
      self.emit(Events.STARTING_OVER)

      submitted = false
      form.show()
      visuals.back(params, function () {
        if (params.keepHidden) {
          // just enable form, do nothing else.
          // see example contact_form.html when you submit without videomil
          // and go back
          self.enableForm()
        } else {
          self.show(params)
        }
      })
    } catch (exc) {
      self.emit(Events.ERROR, exc)
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

      const visualsValid = visuals.validate() && buttons.isRecordAgainButtonEnabled()
      var whyInvalid

      if (form) {
        valid = form.validate()

        if (valid) {
          if (!this.areVisualsHidden() && !visualsValid) {
            if (submitted || this.isReady() || this.isRecording() || this.isPaused() || this.isCountingDown()) {
              valid = false
            }

            if (!valid) {
              whyInvalid = 'Video is not recorded'
            }
          }
        } else {
          const invalidInput = form.getInvalidElement()

          if (invalidInput) {
            whyInvalid = 'Form input named ' + invalidInput.name + ' is invalid'
          } else {
            whyInvalid = 'Form input(s() are invalid'
          }
        }
      } else {
        valid = visualsValid
      }

      if (valid) {
        this.emit(Events.VALID)
      } else {
        this.emit(Events.INVALID, whyInvalid)
      }

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
    const post = isPost(method)
    const hasVideomailKey = !!formData[options.selectors.keyInputName]

    function startSubmission () {
      self.beginWaiting()
      self.disableForm(true)
      self.emit(Events.SUBMITTING)
    }

    // a closure so that we can access method
    var submitVideomailCallback = function (err1, videomail, videomailResponse) {
      if (err1) {
        finalizeSubmissions(err1, method, videomail, videomailResponse)
      } else if (post) {
        submitForm(formData, videomailResponse, url, function (err2, formResponse) {
          finalizeSubmissions(err2, method, videomail, videomailResponse, formResponse)
        })
      } else {
        // it's a direct submission
        finalizeSubmissions(null, method, videomail, videomailResponse)
      }
    }

    // !hasVideomailKey makes it possible to submit form when videomail itself
    // is not optional.
    if (!hasVideomailKey) {
      if (options.enableAutoSubmission) {
        startSubmission()
        submitForm(formData, null, url, function (err2, formResponse) {
          finalizeSubmissions(err2, method, null, null, formResponse)
        })
      }
      // ... and when the enableAutoSubmission option is false,
      // then that can mean, leave it to the framework to process with the form
      // validation/handling/submission itself. for example the ninja form
      // will want to highlight which one input are wrong.
    } else {
      startSubmission()
      submitVideomail(formData, method, submitVideomailCallback)
    }
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
      if (visuals.isRecorderUnloaded()) {
        isDirty = false
      } else if (this.isReplayShown() || this.isPaused()) {
        isDirty = true
      }
    }

    return isDirty
  }

  this.getReplay = function () {
    return visuals.getReplay()
  }

  this.isOutsideElementOf = function (element) {
    return element.parentNode !== containerElement && element !== containerElement
  }

  this.hideForm = function (params) {
    // form check needed, see https://github.com/binarykitchen/videomail-client/issues/127
    form && form.hide()
    buttons && buttons.hide(params)
  }

  this.loadForm = function (videomail) {
    if (form) {
      form.loadVideomail(videomail)
      this.validate()
    }
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

export default Container
