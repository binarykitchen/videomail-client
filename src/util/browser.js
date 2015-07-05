var UAParser        = require('ua-parser-js'),
    VideomailError  = require('./videomailError')

module.exports = function(options) {

    options = options || {}

    var firefoxDownload  = 'http://www.mozilla.org/firefox/update/',
        chromeDownload   = 'http://www.google.com/chrome/',
        chromiumDownload = 'http://www.chromium.org/getting-involved/download-chromium',
        browseHappyLink  = 'http://browsehappy.com',
        ua               = options.fakeUaString ||
                           (typeof window !== 'undefined' && window.navigator.userAgent),

        uaParser = new UAParser(ua).getResult(),

        isIOS         = uaParser.os.name === 'iOS',
        isChrome      = uaParser.browser.name === 'Chrome',
        isChromium    = uaParser.browser.name === 'Chromium',
        firefox       = uaParser.browser.name === 'Firefox',
        isIE          = /IE/.test(uaParser.browser.name),
        isSafari      = /Safari/.test(uaParser.browser.name),
        isOpera       = /Opera/.test(uaParser.browser.name),
        isAndroid     = /Android/.test(uaParser.os.name),
        chromeBased   = isChrome || isChromium,
        okBrowser     = chromeBased || firefox || isAndroid || isOpera,

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
                      ' <a href="' + firefoxDownload + '" target="_blank">Firefox</a>' +
                      ' or <a href="' + chromeDownload + '" target="_blank">Chrome</a>.'

        else if (isSafari)
            warning = 'Safari has no webcam support yet.<br/>Better pick' +
                      ' <a href="' + firefoxDownload + '" target="_blank">Firefox</a>' +
                      ' or <a href="' + chromeDownload + '" target="_blank">Chrome</a>.'

        return warning
    }

    function getUserMediaWarning() {
        var warning

        if (isIOS)
            warning = '<a href="http://caniuse.com/stream" target="_blank">' +
                      'iOS devices are unable to access video streams.' +
                      '</a> One day they will hopefully. Depends on Apple &hellip;'

        else
            warning = getRecommendation()

        if (!warning)
            warning = '<a href="http://caniuse.com/stream" target="_blank">Switch</a> ' +
                      'or ' + getBrowseHappyLink()

        return warning
    }

    function getBrowseHappyLink() {
        return '<a href="' + browseHappyLink + '" target="_blank">Upgrade browser</a>'
    }

    function getPlaybackWarning() {
        var warning = getRecommendation()

        if (!warning)
            warning = getBrowseHappyLink()

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
        var getUserMediaType = typeof navigator !== 'undefined' && typeof navigator.getUserMedia

        return getUserMediaType !== 'undefined' && getUserMediaType == 'function'
    }

    this.checkRecordingCapabilities = function() {
        var err

        if (!okBrowser || !this.canRecord()) {

            var message

            if (!okBrowser)
                message = 'Browser has no webcam support'

            else
                message = 'Browser has no getUserMedia support'

            err = VideomailError.create({
                message: message,
            }, getUserMediaWarning(), options)
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
            explanation = 'Click on the allow button above to grant access to your webcam.'

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
}
