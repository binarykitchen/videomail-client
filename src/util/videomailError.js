// https://github.com/tgriesser/create-error
var createError = require('create-error'),

    VIDEOMAIL_ERR_NAME = 'Videomail Error'

var VideomailError = createError(Error, VIDEOMAIL_ERR_NAME, {
    'explanation': undefined
})

// static and public attribute of this class
VideomailError.PERMISSION_DENIED = 'PERMISSION_DENIED'
VideomailError.NOT_CONNECTED     = 'Not connected'

// static function to convert an error into a videomail error

VideomailError.create = function(err) {

    if (err && err.name === VIDEOMAIL_ERR_NAME)
        return err

    // Require Browser here, not at the top of the file to avoid
    // recursion. Because the Browser class is requiring this file as well.
    var Browser = require('./browser'),
        browser = new Browser(),

        errType,
        message,
        explanation

    // whole code is ugly because all browsers behave so differently :(

    if (typeof(err) == 'object') {
        if (err.code == 1 && err.PERMISSION_DENIED == 1)
            errType = VideomailError.PERMISSION_DENIED

        else if (err.name)
            errType = err.name

        else if (err.type === 'error' && err.target.bufferedAmount === 0)
            errType = VideomailError.NOT_CONNECTED

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

        case 'Starting video failed':
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
            else
                message = err && err.message && err.toString()

            break
    }

    return new VideomailError(message, {
        explanation: explanation
    })
}

module.exports = VideomailError
