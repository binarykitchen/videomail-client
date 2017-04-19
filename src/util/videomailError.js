// https://github.com/tgriesser/create-error
var createError = require('create-error')
var pretty = require('./pretty')
var Resource = require('./../resource')

var VIDEOMAIL_ERR_NAME = 'Videomail Error'

var VideomailError = createError(Error, VIDEOMAIL_ERR_NAME, {
  'explanation': undefined,
  'logLines': undefined,
  'useragent': undefined,
  'url': undefined,
  'stack': undefined
})

// static and public attribute of this class
VideomailError.PERMISSION_DENIED = 'PERMISSION_DENIED'
VideomailError.NOT_CONNECTED = 'Not connected'
VideomailError.DOM_EXCEPTION = 'DOMException'
VideomailError.STARTING_FAILED = 'Starting video failed'
VideomailError.MEDIA_DEVICE_NOT_SUPPORTED = 'MediaDeviceNotSupported'

// static function to convert an error into a videomail error
VideomailError.create = function (err, explanation, options, isBrowserProblem) {
  if (err && err.name === VIDEOMAIL_ERR_NAME) {
    return err
  }

  if (!options && explanation) {
    options = explanation
    explanation = undefined
  }

  options = options || {}

  var resource

  if (options.reportErrors) {
    resource = new Resource(options)
  }

  // Require Browser here, not at the top of the file to avoid
  // recursion. Because the Browser class is requiring this file as well.
  var Browser = require('./browser')
  var browser = new Browser(options)

  var errType
  var message
  var stack

    // whole code is ugly because all browsers behave so differently :(

  if (typeof (err) === 'object') {
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
      isBrowserProblem = true
      break

    case 'PermissionDismissedError':
      message = 'Ooops, you didn\'t give me any permissions?'
      explanation = 'Looks like you skipped the webcam permission dialogue.<br/>' +
                    'Please grant access next time the dialogue appears.'

      isBrowserProblem = true

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

      isBrowserProblem = true

      break

    case 'HARDWARE_UNAVAILABLE':
      message = 'Webcam is unavailable'
      explanation = 'Maybe it is already busy in another window?'
      isBrowserProblem = true

      if (browser.isChromeBased()) {
        explanation += ' Or you have to allow access above?'
      }
      break

    case VideomailError.NOT_CONNECTED:
      message = 'Unable to transfer data'
      explanation = 'Unable to maintain a websocket to the server. Either server or ' +
                    'your connection is down. Trying to reconnect every two seconds …'
      break

    case 'NO_VIDEO_FEED':
      message = 'No video feed found!'
      explanation = 'Your webcam is already used in another browser.'
      isBrowserProblem = true
      break

    case VideomailError.STARTING_FAILED:
      message = 'Starting video failed'
      explanation = 'Most likely this happens when the webam is already active in another browser.'
      isBrowserProblem = true
      break

    case 'DevicesNotFoundError':
      message = 'No available webcam could be found'
      explanation = 'Looks like you do not have any webcam attached to your machine; or ' +
                    'the one you plugged in is already used.'
      isBrowserProblem = true
      break

    case VideomailError.DOM_EXCEPTION:
      if (err.code === 9) {
        message = 'Insecure origin detected'
        explanation = 'To use the powerful webcam feature, security should not be neglected. ' +
                      'Please change the location in your browser to HTTPS.'
        isBrowserProblem = true
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
      if (typeof err === 'string') {
        message = err
      } else {
        if (err && err.message) {
          message = pretty(err.message)
        }

        if (err && err.explanation) {
          explanation = pretty(err.explanation)
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
        message = errType

        if (!explanation) {
          explanation = pretty(err, {excludes: ['stack']})
        }

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

  var videomailError = new VideomailError(message, {
    explanation: explanation,
    logLines: logLines,
    client: browser.getUsefulData(),
    url: window.location.href,
    stack: stack // have to assign it manually again because it is kinda protected
  })

  if (resource) {
    resource.reportError(videomailError, function (err2) {
      if (err2) {
        console.error('Unable to report error', err2)
      }
    })
  }

  // add some public functions

  // this one is useful so that the notifier can have different css classes
  videomailError.isBrowserProblem = function () {
    return isBrowserProblem
  }

  return videomailError
}

module.exports = VideomailError
