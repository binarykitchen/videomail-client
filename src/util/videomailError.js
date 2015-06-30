// https://github.com/tgriesser/create-error
var createError = require('create-error'),
    pretty = require('./pretty'),

    VIDEOMAIL_ERR_NAME = 'Videomail Error'

var VideomailError = createError(Error, VIDEOMAIL_ERR_NAME, {
    'explanation': undefined,
    'logLines':    undefined
})

// static and public attribute of this class
VideomailError.PERMISSION_DENIED = 'PERMISSION_DENIED'
VideomailError.NOT_CONNECTED     = 'Not connected'
VideomailError.STARTING_FAILED   = 'Starting video failed'

// static function to convert an error into a videomail error

VideomailError.create = function(err, explanation, options) {

    if (err && err.name === VIDEOMAIL_ERR_NAME)
        return err

    if (!options && explanation) {
        options     = explanation
        explanation = undefined
    }

    options = options || {}

    // Require Browser here, not at the top of the file to avoid
    // recursion. Because the Browser class is requiring this file as well.
    var Browser = require('./browser'),
        browser = new Browser(options),

        errType,
        message,
        stack

    // whole code is ugly because all browsers behave so differently :(

    if (typeof(err) == 'object') {
        if (err.code == 1 && err.PERMISSION_DENIED == 1)
            errType = VideomailError.PERMISSION_DENIED

        else if (err.message === VideomailError.STARTING_FAILED)
            errType = err.message

        else if (err.name)
            errType = err.name

        else if (err.type === 'error' && err.target.bufferedAmount === 0)
            errType = VideomailError.NOT_CONNECTED

        if (err.stack)
            stack = err.stack

    } else
        if (err === VideomailError.NOT_CONNECTED)
            errType = VideomailError.NOT_CONNECTED
        else
            errType = err

    switch (errType) {
        case 'NO_DEVICES_FOUND':
            message     = 'No webcam found'
            explanation = 'Your browser cannot find a webcam attached to your machine.'
            break

        case VideomailError.PERMISSION_DENIED:
        case 'PermissionDeniedError':
            message = 'Permission denied!'

            if (browser.isChromeBased() || browser.isFirefox())
                explanation = 'Permission to access your webcam has been denied. ' +
                              'This can have two reasons:<br/>' +
                              'a) you blocked access to webcam; or<br/>' +
                              'b) your webcam is already in use.'
            break

        case 'HARDWARE_UNAVAILABLE':
            message     = 'Webcam is unavailable!'
            explanation = 'Maybe it is already busy in another window?'

            if (browser.isChromeBased())
                explanation += ' Or you have to allow access above?'
            break

        case VideomailError.NOT_CONNECTED:
            message     = 'Unable to transfer data'
            explanation = 'Unable to maintain a binary websocket to the server. Either the server or ' +
                          'your connection is down. Trying to reconnect every two seconds …'
            break

        case 'NO_VIDEO_FEED':
            message     = 'No video feed found!'
            explanation = 'Your webcam is already used in another browser.'
            break

        case VideomailError.STARTING_FAILED:
            message     = 'Starting video failed'
            explanation = 'Most likely this happens when the webam is already active in another browser.'
            break

        case 'DevicesNotFoundError':
            message     = 'Webcam is unavailable'
            explanation = 'Looks like another program has control over your webcam? Close it and come back.'
            break

        default:
            if (typeof err === 'string')
                message = err
            else {
                if (err && err.message)
                    message = err.message.toString()

                if (err && err.explanation)
                    explanation = err.explanation.toString()

                if (err && err.details) {
                    var details = pretty(err.details)

                    if (!explanation)
                        explanation = details
                    else
                        explanation += ';<br/>' + details
                }
            }

            break
    }

    var logLines = null

    if (options.logger && options.logger.getLines)
        logLines = options.logger.getLines()

    if (stack) {
        message = new Error(message)
        message.stack = stack
    }

    return new VideomailError(message, {
        explanation: explanation,
        logLines:    logLines
    })
}

module.exports = VideomailError
