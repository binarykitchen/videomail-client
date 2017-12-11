// https://github.com/tgriesser/create-error
import createError from 'create-error'
import util from 'util'

import originalPretty from './pretty'
import Resource from './../resource'

const VIDEOMAIL_ERR_NAME = 'Videomail Error'

const VideomailError = createError(Error, VIDEOMAIL_ERR_NAME, {
  'explanation': undefined,
  'logLines': undefined,
  'useragent': undefined,
  'url': undefined,
  'stack': undefined
})

// shim pretty to exclude stack always
const pretty = function (anything) {
  return originalPretty(anything, {excludes: ['stack']})
}

// static and public attribute of this class
VideomailError.PERMISSION_DENIED = 'PERMISSION_DENIED'
VideomailError.NOT_ALLOWED_ERROR = 'NotAllowedError'
VideomailError.NOT_CONNECTED = 'Not connected'
VideomailError.DOM_EXCEPTION = 'DOMException'
VideomailError.STARTING_FAILED = 'Starting video failed'
VideomailError.MEDIA_DEVICE_NOT_SUPPORTED = 'MediaDeviceNotSupported'
VideomailError.BROWSER_PROBLEM = 'browser-problem'
VideomailError.WEBCAM_PROBLEM = 'webcam-problem'
VideomailError.IOS_PROBLEM = 'ios-problem'
VideomailError.OVERCONSTRAINED = 'OverconstrainedError'

// static function to convert an error into a videomail error
VideomailError.create = function (err, explanation, options, parameters) {
  if (err && err.name === VIDEOMAIL_ERR_NAME) {
    return err
  }

  if (!options && explanation) {
    options = explanation
    explanation = undefined
  }

  options = options || {}
  parameters = parameters || {}

  // be super robust
  const debug = (options && options.debug) || console.log
  const audioEnabled = options && options.isAudioEnabled && options.isAudioEnabled()

  debug('VideomailError: create()', err, explanation)

  const classList = parameters.classList || []

  // Require Browser here, not at the top of the file to avoid
  // recursion. Because the Browser class is requiring this file as well.
  const Browser = require('./browser')
  const browser = new Browser(options)

  var errType
  var message
  var stack

    // whole code is ugly because all browsers behave so differently :(

  if (typeof err === 'object') {
    if (err.code === 35) {
      // https://github.com/binarykitchen/videomail.io/issues/411
      errType = VideomailError.NOT_ALLOWED_ERROR
    } else if (err.code === 1 && err.PERMISSION_DENIED === 1) {
      errType = VideomailError.PERMISSION_DENIED
    } else if (err.constructor && err.constructor.name === VideomailError.DOM_EXCEPTION) {
      errType = VideomailError.DOM_EXCEPTION
    } else if (err.constructor && err.constructor.name === VideomailError.OVERCONSTRAINED) {
      errType = VideomailError.OVERCONSTRAINED
    } else if (err.message === VideomailError.STARTING_FAILED) {
      errType = err.message
    } else if (err.name) {
      errType = err.name
    } else if (err.type === 'error' && err.target.bufferedAmount === 0) {
      errType = VideomailError.NOT_CONNECTED
    }
  } else if (err === VideomailError.NOT_CONNECTED) {
    errType = VideomailError.NOT_CONNECTED
  } else {
    errType = err
  }

  if (err && err.stack) {
    stack = err.stack
  } else {
    stack = new Error().stack
  }

  switch (errType) {
    case VideomailError.OVERCONSTRAINED:
      message = 'Invalid webcam constraints'

      if (err.constraint) {
        if (err.constraint === 'width') {
          explanation = 'Your webcam does not meet the width requirement.'
        } else {
          explanation = 'Unmet constraint: ' + err.constraint
        }
      } else {
        explanation = ' Details: ' + err.toString()
      }
      break
    case 'MediaDeviceFailedDueToShutdown':
      message = 'Webcam is shutting down'
      explanation = 'This happens your webcam is already switching off and not giving you permission to use it.'
      break
    case 'SourceUnavailableError':
      message = 'Source of your webcam cannot be accessed'
      explanation = 'Probably it is locked from another process or has a hardware error.'

      if (err.message) {
        err.message += ' Details: ' + err.message
      }

      break
    case 'NotFoundError':
    case 'NO_DEVICES_FOUND':
      if (audioEnabled) {
        message = 'No webcam nor microphone found'
        explanation = 'Your browser cannot find a webcam with microphone attached to your machine.'
      } else {
        message = 'No webcam found'
        explanation = 'Your browser cannot find a webcam attached to your machine.'
      }

      classList.push(VideomailError.WEBCAM_PROBLEM)
      break

    case 'PermissionDismissedError':
      message = 'Ooops, you didn\'t give me any permissions?'
      explanation = 'Looks like you skipped the webcam permission dialogue.<br/>' +
                    'Please grant access next time the dialogue appears.'
      classList.push(VideomailError.WEBCAM_PROBLEM)
      break

    case VideomailError.NOT_ALLOWED_ERROR:
    case VideomailError.PERMISSION_DENIED:
    case 'PermissionDeniedError':
      message = 'Permission denied'

      explanation = 'Cannot access your webcam. This can have two reasons:<br/>' +
                    'a) you blocked access to webcam; or<br/>' +
                    'b) your webcam is already in use.'

      classList.push(VideomailError.WEBCAM_PROBLEM)

      break

    case 'HARDWARE_UNAVAILABLE':
      message = 'Webcam is unavailable'
      explanation = 'Maybe it is already busy in another window?'

      if (browser.isChromeBased()) {
        explanation += ' Or you have to allow access above?'
      }

      classList.push(VideomailError.WEBCAM_PROBLEM)

      break

    case VideomailError.NOT_CONNECTED:
      message = 'Unable to connect'
      explanation = 'Either the videomail server or your connection is down. ' +
                    'Trying to reconnect every few seconds …'
      break

    case 'NO_VIDEO_FEED':
      message = 'No video feed found!'
      explanation = 'Your webcam is already used in another browser.'
      classList.push(VideomailError.WEBCAM_PROBLEM)
      break

    case VideomailError.STARTING_FAILED:
      message = 'Starting video failed'
      explanation = 'Most likely this happens when the webam is already active in another browser.'
      classList.push(VideomailError.WEBCAM_PROBLEM)
      break

    case 'DevicesNotFoundError':
      message = 'No available webcam could be found'
      explanation = 'Looks like you do not have any webcam attached to your machine; or ' +
                    'the one you plugged in is already used.'
      classList.push(VideomailError.WEBCAM_PROBLEM)
      break

    case VideomailError.DOM_EXCEPTION:
      switch (err.code) {
        case 9:
          const newUrl = 'https:' + window.location.href.substring(window.location.protocol.length)
          message = 'Security upgrade needed'
          explanation = 'Click <a href="' + newUrl + '">here</a> to switch to HTTPs which is more safe ' +
                        ' and enables encrypted videomail transfers.'
          classList.push(VideomailError.BROWSER_PROBLEM)
          break
        case 11:
          message = 'Invalid State'
          explanation = 'The object is in an invalid, unusable state.'
          classList.push(VideomailError.BROWSER_PROBLEM)
          break
        default:
          message = 'DOM Exception'
          explanation = pretty(err)
          classList.push(VideomailError.BROWSER_PROBLEM)
          break
      }
      break

    // Chrome has a weird problem where if you try to do a getUserMedia request too early, it
    // can return a MediaDeviceNotSupported error (even though nothing is wrong and permission
    // has been granted). Look at userMediaErrorCallback() in recorder, there we do not
    // emit those kind of errors further and just retry.
    //
    // but for whatever reasons, if it happens to reach this code, then investigate this further.
    case VideomailError.MEDIA_DEVICE_NOT_SUPPORTED:
      message = 'Media device not supported'
      explanation = pretty(err)
      break

    default:
      const originalExplanation = explanation

      if (explanation && typeof explanation === 'object') {
        explanation = pretty(explanation)
      }

      // it can be that explanation itself is an error object
      // error objects can be prettified to undefined sometimes
      if (!explanation && originalExplanation) {
        if (originalExplanation.message) {
          explanation = originalExplanation.message
        } else {
          // tried toString before but nah
          explanation = 'Inspected: ' + util.inspect(originalExplanation, {showHidden: true})
        }
      }

      if (err && typeof err === 'string') {
        message = err
      } else {
        if (err) {
          if (err.message) {
            message = pretty(err.message)
          }
        }

        if (err && err.explanation) {
          if (!explanation) {
            explanation = pretty(err.explanation)
          } else {
            explanation += ';<br/>' + pretty(err.explanation)
          }
        }

        if (err && err.details) {
          var details = pretty(err.details)

          if (!explanation) {
            explanation = details
          } else {
            explanation += ';<br/>' + details
          }
        }
      }

      // for weird, undefined cases
      if (!message) {
        if (errType) {
          message = errType
        }

        if (!explanation && err) {
          explanation = pretty(err, {excludes: ['stack']})
        }

        // avoid dupes
        if (pretty(message) === explanation) {
          explanation = undefined
        }
      }

      break
  }

  var logLines = null

  if (options.logger && options.logger.getLines) {
    logLines = options.logger.getLines()
  }

  if (stack) {
    message = new Error(message)
    message.stack = stack
  }

  var errCode = 'none'

  if (err) {
    errCode = 'code=' + (err.code ? err.code : 'undefined')
    errCode += ', type=' + (err.type ? err.type : 'undefined')
    errCode += ', name=' + (err.name ? err.name : 'undefined')
  }

  const videomailError = new VideomailError(message, {
    explanation: explanation,
    logLines: logLines,
    client: browser.getUsefulData(),
    url: window.location.href,
    code: errCode,
    stack: stack // have to assign it manually again because it is kinda protected
  })

  var resource
  var reportErrors = false

  if (options.reportErrors) {
    if (typeof options.reportErrors === 'function') {
      reportErrors = options.reportErrors(videomailError)
    } else {
      reportErrors = options.reportErrors
    }
  }

  if (reportErrors) {
    resource = new Resource(options)
  }

  if (resource) {
    resource.reportError(videomailError, function (err2) {
      if (err2) {
        console.error('Unable to report error', err2)
      }
    })
  }

  function hasClass (name) {
    return classList.indexOf(name) >= 0
  }

  function isBrowserProblem () {
    return hasClass(VideomailError.BROWSER_PROBLEM) || parameters.browserProblem
  }

  // add some public functions

  // this one is useful so that the notifier can have different css classes
  videomailError.getClassList = function () {
    return classList
  }

  videomailError.removeDimensions = function () {
    return hasClass(VideomailError.IOS_PROBLEM) || browser.isMobile()
  }

  videomailError.hideButtons = function () {
    return isBrowserProblem() || hasClass(VideomailError.IOS_PROBLEM)
  }

  videomailError.hideForm = function () {
    return hasClass(VideomailError.IOS_PROBLEM)
  }

  return videomailError
}

export default VideomailError
