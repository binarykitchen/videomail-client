// https://github.com/tgriesser/create-error
var createError = require('create-error')
var originalPretty = require('./pretty')
var Resource = require('./../resource')

var VIDEOMAIL_ERR_NAME = 'Videomail Error'

var VideomailError = createError(Error, VIDEOMAIL_ERR_NAME, {
  'explanation': undefined,
  'logLines': undefined,
  'useragent': undefined,
  'url': undefined,
  'stack': undefined
})

// shim pretty to exclude stack always
var pretty = function (anything) {
  return originalPretty(anything, {excludes: ['stack']})
}

// static and public attribute of this class
VideomailError.PERMISSION_DENIED = 'PERMISSION_DENIED'
VideomailError.NOT_CONNECTED = 'Not connected'
VideomailError.DOM_EXCEPTION = 'DOMException'
VideomailError.STARTING_FAILED = 'Starting video failed'
VideomailError.MEDIA_DEVICE_NOT_SUPPORTED = 'MediaDeviceNotSupported'
VideomailError.BROWSER_PROBLEM = 'browser-problem'
VideomailError.WEBCAM_PROBLEM = 'webcam-problem'
VideomailError.IOS_PROBLEM = 'ios-problem'

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

  var classList = parameters.classList || []

  // Require Browser here, not at the top of the file to avoid
  // recursion. Because the Browser class is requiring this file as well.
  var Browser = require('./browser')
  var browser = new Browser(options)

  var errType
  var message
  var stack

    // whole code is ugly because all browsers behave so differently :(

  if (typeof err === 'object') {
    if (err.code === 1 && err.PERMISSION_DENIED === 1) {
      errType = VideomailError.PERMISSION_DENIED
    } else if (err.constructor && err.constructor.name === VideomailError.DOM_EXCEPTION) {
      errType = VideomailError.DOM_EXCEPTION
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
  }

  switch (errType) {
    case 'NotFoundError':
    case 'NO_DEVICES_FOUND':
      message = 'No webcam found'
      explanation = 'Your browser cannot find a webcam attached to your machine.'
      classList.push(VideomailError.WEBCAM_PROBLEM)
      break

    case 'PermissionDismissedError':
      message = 'Ooops, you didn\'t give me any permissions?'
      explanation = 'Looks like you skipped the webcam permission dialogue.<br/>' +
                    'Please grant access next time the dialogue appears.'
      classList.push(VideomailError.WEBCAM_PROBLEM)
      break

    case VideomailError.PERMISSION_DENIED:
    case 'PermissionDeniedError':
      message = 'Permission denied'

      if (browser.isChromeBased() || browser.isFirefox() || browser.isEdge()) {
        explanation = 'Permission to access your webcam has been denied. ' +
                      'This can have two reasons:<br/>' +
                      'a) you blocked access to webcam; or<br/>' +
                      'b) your webcam is already in use.'
      } else {
        explanation = 'Permission to access your webcam has been denied.'
      }

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
      message = 'Unable to transfer data'
      explanation = 'Unable to maintain a websocket to the server. Either server or ' +
                    'your connection is down. Trying to reconnect every two seconds …'
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
      if (err.code === 9) {
        message = 'Insecure origin detected'
        explanation = 'To use the powerful webcam feature, security should not be neglected. ' +
                      'Please change the location in your browser to HTTPS.'
        classList.push(VideomailError.BROWSER_PROBLEM)
      } else {
        message = VideomailError.DOM_EXCEPTION
        explanation = pretty(err)
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
      var originalExplanation = explanation

      if (explanation && typeof explanation === 'object') {
        explanation = pretty(explanation)
      }

      // it can be that explanation itself is an error object
      // error objects can be prettified to undefined sometimes
      if (!explanation && originalExplanation) {
        if (originalExplanation.message) {
          explanation = originalExplanation.message
        } else {
          explanation = originalExplanation.toString()
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

  var videomailError = new VideomailError(message, {
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
    return hasClass(VideomailError.BROWSER_PROBLEM) ||
      parameters.browserProblem
  }

  // add some public functions

  // this one is useful so that the notifier can have different css classes
  videomailError.getClassList = function () {
    return classList
  }

  videomailError.removeDimensions = function () {
    return hasClass(VideomailError.IOS_PROBLEM)
  }

  videomailError.hideButtons = function () {
    return isBrowserProblem() || hasClass(VideomailError.IOS_PROBLEM)
  }

  videomailError.hideForm = function () {
    return hasClass(VideomailError.IOS_PROBLEM)
  }

  return videomailError
}

module.exports = VideomailError
