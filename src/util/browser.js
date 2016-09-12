var UAParser        = require('ua-parser-js'),
    VideomailError  = require('./videomailError')

module.exports = function(options) {

    options = options || {}

    var firefoxDownload  = 'http://www.mozilla.org/firefox/update/',
        edgeDownload     = 'https://www.microsoft.com/en-us/download/details.aspx?id=48126',
        chromeDownload   = 'http://www.google.com/chrome/',
        chromiumDownload = 'http://www.chromium.org/getting-involved/download-chromium',
        browseHappyLink  = 'http://browsehappy.com',
        ua               = options.fakeUaString || (
                            typeof window !== 'undefined' &&
                            window.navigator &&
                            window.navigator.userAgent
                           ) || '',

        uaParser = new UAParser(ua).getResult(),

        isIOS         = uaParser.os.name === 'iOS',
        isChrome      = uaParser.browser.name === 'Chrome',
        isChromium    = uaParser.browser.name === 'Chromium',
        firefox       = uaParser.browser.name === 'Firefox',
        osVersion     = parseFloat(uaParser.os.version),
        isWindows     = uaParser.os.name === 'Windows',
        isEdge        = uaParser.browser.name === 'Edge' || (isWindows && osVersion >= 10),
        isIE          = /IE/.test(uaParser.browser.name),
        isSafari      = /Safari/.test(uaParser.browser.name),
        isOpera       = /Opera/.test(uaParser.browser.name),
        isAndroid     = /Android/.test(uaParser.os.name),
        chromeBased   = isChrome || isChromium,
        okBrowser     = chromeBased || firefox || isAndroid || isOpera || isEdge,

        self = this,

        videoType

    function getRecommendation() {
        var warning

        if (firefox)
            warning = 'Probably you need to <a href="' + firefoxDownload + '" target="_blank">' +
                      'upgrade Firefox</a> to fix this.'

        else if (isChrome)
            warning = 'Probably you need to <a href="' + chromeDownload + '" target="_blank">' +
                      'upgrade Chrome</a> to fix this.'

        else if (isChromium)
            warning = '<a href="' + chromiumDownload + '" target="_blank">' +
                      'Upgrade Chromium</a> to fix this.'

        else if (isIE)
            warning = 'Forget Internet Explorer!<br/>Better pick' +
                      ' <a href="' + chromeDownload + '" target="_blank">Chrome</a>,' +
                      ' <a href="' + firefoxDownload + '" target="_blank">Firefox</a>' +
                      ' or <a href="' + edgeDownload + '" target="_blank">Edge</a>.'

        else if (isSafari)
            warning = 'Safari has no webcam support yet.<br/>Better pick' +
                      ' <a href="' + chromeDownload + '" target="_blank">Chrome</a>' +
                      ' or <a href="' + firefoxDownload + '" target="_blank">Firefox</a>.'

        return warning
    }

    function getUserMediaWarning() {
        var warning

        if (isIOS)
            warning = 'On iPads/iPhones this feature is missing. ' +
                      'Here is <a href="http://caniuse.com/stream" target="_blank">' +
                      'evidence</a>.<br/><br/>For now, we recommend you to use a desktop computer or ' +
                      'an Android device.'

        else
            warning = getRecommendation()

        if (!warning) {
            if (self.isChromeBased() || self.isFirefox())
                warning = 'For that, your browser needs an <a href="' + browseHappyLink + '" target="_blank">upgrade</a>.'
            else
                warning = 'Hence we recommend you to use either ' +
                          '<a href="' + chromeDownload + '" target="_blank">Chrome</a>, ' +
                          '<a href="' + firefoxDownload + '" target="_blank">Firefox</a> or ' +
                          '<a href="' + edgeDownload + '" target="_blank">Edge</a> instead.'
        }

        warning = 'To access external webcams, your browser must support the ' +
                  '<a href="http://caniuse.com/#feat=stream" target="_blank">getUserMedia</a> feature.' +
                  '<br/><br/>' + warning

        return warning
    }

    function getPlaybackWarning() {
        var warning = getRecommendation()

        if (!warning)
            warning =   '<a href="' + browseHappyLink + '" target="_blank">Upgrading your browser</a> ' +
                        'might help.'

        return warning
    }

    function canPlayType(video, type) {
        var canPlayType

        if (video && video.canPlayType)
            canPlayType = video.canPlayType('video/' + type)

        return canPlayType
    }

    // just temporary
    this.canRecord = function() {
        var hasNavigator = typeof navigator !== 'undefined'

        if (hasNavigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            return true
        } else {
            var getUserMediaType = hasNavigator && typeof navigator.getUserMedia_

            return getUserMediaType !== 'undefined' && getUserMediaType == 'function'
        }
    }

    this.checkRecordingCapabilities = function() {
        var err

        if (!okBrowser || !this.canRecord()) {

            err = VideomailError.create({
                message: 'Sorry, your browser has no webcam support',
            }, getUserMediaWarning(), options, true)
        }

        return err
    }

    this.checkPlaybackCapabilities = function(video) {
        var err,
            message

        if (!video)
            message = 'No HTML5 support for video tag!'

        else if (!this.getVideoType(video))
            message = 'No H264 nor webm support found.'

        if (message)
            err = VideomailError.create(message, getPlaybackWarning(), options)

        return err
    }

    this.checkBufferTypes = function() {
        var err

        if (typeof window === 'undefined' || typeof window.atob === 'undefined')
            err = VideomailError.create('atob is not supported', options)

        else if (typeof window.ArrayBuffer === 'undefined')
            err = VideomailError.create('ArrayBuffers are not supported', options)

        else if (typeof window.Uint8Array === 'undefined')
            err = VideomailError.create('Uint8Arrays are not supported', options)

        return err
    }

    this.getVideoType = function(video) {

        if (!videoType) {
            // there is a bug in canPlayType within chrome for mp4
            if (canPlayType(video, 'mp4') && !chromeBased)
                videoType = 'mp4'

            else if (canPlayType(video, 'webm'))
                videoType = 'webm'
        }

        return videoType
    }

    this.getNoAccessIssue = function() {
        var message = 'Cannot access webcam!',
            explanation

        if (this.isChromeBased())
            explanation = 'Click on the allow button to grant access to your webcam.'

        else if (this.isFirefox())
            explanation = 'Please share your webcam under Firefox.'

        else
            explanation = 'Your operating system does not let your browser access your webcam.'

        return VideomailError.create(message, explanation, options)
    }

    this.isChromeBased = function() {
        return chromeBased
    }

    this.isFirefox = function() {
        return firefox
    }

    this.isEdge = function() {
        return isEdge
    }
}
