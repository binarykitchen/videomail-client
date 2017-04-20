var UAParser = require('ua-parser-js')
var defined = require('defined')
var VideomailError = require('./videomailError')

module.exports = function (options) {
  options = options || {}

  var firefoxDownload = 'http://www.mozilla.org/firefox/update/'
  var edgeDownload = 'https://www.microsoft.com/en-us/download/details.aspx?id=48126'
  var chromeDownload = 'http://www.google.com/chrome/'
  var chromiumDownload = 'http://www.chromium.org/getting-involved/download-chromium'
  var browseHappyLink = 'http://browsehappy.com'
  var ua = defined(options.fakeUaString, (
    typeof window !== 'undefined' &&
    window.navigator &&
    window.navigator.userAgent
  ), '')

  var uaParser = new UAParser(ua).getResult()

  var isIOS = uaParser.os.name === 'iOS'
  var isChrome = uaParser.browser.name === 'Chrome'
  var isChromium = uaParser.browser.name === 'Chromium'
  var firefox = uaParser.browser.name === 'Firefox'
  var osVersion = parseFloat(uaParser.os.version)
  var isWindows = uaParser.os.name === 'Windows'
  var isEdge = uaParser.browser.name === 'Edge' || (isWindows && osVersion >= 10)
  var isIE = /IE/.test(uaParser.browser.name)
  var isSafari = /Safari/.test(uaParser.browser.name)
  var isOpera = /Opera/.test(uaParser.browser.name)
  var isAndroid = /Android/.test(uaParser.os.name)
  var chromeBased = isChrome || isChromium
  var okBrowser = chromeBased || firefox || isAndroid || isOpera || isEdge

  var self = this

  var videoType

  function getRecommendation () {
    var warning

    if (firefox) {
      warning = 'Probably you need to <a href="' + firefoxDownload + '" target="_blank">' +
                      'upgrade Firefox</a> to fix this.'
    } else if (isChrome) {
      warning = 'Probably you need to <a href="' + chromeDownload + '" target="_blank">' +
                      'upgrade Chrome</a> to fix this.'
    } else if (isChromium) {
      warning = '<a href="' + chromiumDownload + '" target="_blank">' +
                      'Upgrade Chromium</a> to fix this.'
    } else if (isIE) {
      warning = 'Instead of Internet Explorer better pick' +
                      ' <a href="' + chromeDownload + '" target="_blank">Chrome</a>,' +
                      ' <a href="' + firefoxDownload + '" target="_blank">Firefox</a>,' +
                      ' <a href="' + edgeDownload + '" target="_blank">Edge</a> or Android.'
    } else if (isSafari) {
      warning = 'Safari has no webcam support yet.<br/>Better pick' +
                      ' <a href="' + chromeDownload + '" target="_blank">Chrome</a>,' +
                      ' <a href="' + firefoxDownload + '" target="_blank">Firefox</a> or Android.'
    }

    return warning
  }

  function getUserMediaWarning () {
    var warning

    if (isIOS) {
      warning = 'On iPads/iPhones this webcam feature is missing.<br/><br/>' +
                      'For now, we recommend you to use a desktop computer or an Android device.'
    } else {
      warning = getRecommendation()
    }

    if (!warning) {
      if (self.isChromeBased() || self.isFirefox()) {
        warning = 'For the webcam feature, your browser needs an upgrade.'
      } else {
        warning = 'Hence we recommend you to use either ' +
                          '<a href="' + chromeDownload + '" target="_blank">Chrome</a>, ' +
                          '<a href="' + firefoxDownload + '" target="_blank">Firefox</a>, ' +
                          '<a href="' + edgeDownload + '" target="_blank">Edge</a> or Android.'
      }
    }

    warning = 'Your browser does not have the getUserMedia feature to access webcams.' +
                  '<br/><br/>' + warning

    return warning
  }

  function getPlaybackWarning () {
    var warning = getRecommendation()

    if (!warning) {
      warning = '<a href="' + browseHappyLink + '" target="_blank">Upgrading your browser</a> ' +
                        'might help.'
    }

    return warning
  }

  function canPlayType (video, type) {
    var canPlayType

    if (video && video.canPlayType) { canPlayType = video.canPlayType('video/' + type) }

    return canPlayType
  }

    // just temporary
  this.canRecord = function () {
    var hasNavigator = typeof navigator !== 'undefined'
    var canRecord = false

    if (hasNavigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      canRecord = true
    } else {
      var getUserMediaType = hasNavigator && typeof navigator.getUserMedia_

      canRecord = getUserMediaType === 'function'
    }

    return canRecord
  }

  this.checkRecordingCapabilities = function () {
    var err

    if (!okBrowser || !this.canRecord()) {
      var classList = [VideomailError.BROWSER_PROBLEM]

      if (isIOS) {
        classList.push(VideomailError.IOS_PROBLEM)
      }

      err = VideomailError.create({
        message: 'Sorry, your browser is unable to use webcams'
      }, getUserMediaWarning(), options, {
        classList: classList
      })
    }

    return err
  }

  this.checkPlaybackCapabilities = function (video) {
    var err,
      message

    if (!video) {
      message = 'No HTML5 support for video tag!'
    } else if (!this.getVideoType(video)) {
      message = 'Your old browser cannot support modern video codecs'
    }

    if (message) { err = VideomailError.create(message, getPlaybackWarning(), options) }

    return err
  }

  this.checkBufferTypes = function () {
    var err

    if (typeof window === 'undefined' || typeof window.atob === 'undefined') { err = VideomailError.create('atob is not supported', options) } else if (typeof window.ArrayBuffer === 'undefined') { err = VideomailError.create('ArrayBuffers are not supported', options) } else if (typeof window.Uint8Array === 'undefined') { err = VideomailError.create('Uint8Arrays are not supported', options) }

    return err
  }

  this.getVideoType = function (video) {
    if (!videoType) {
            // there is a bug in canPlayType within chrome for mp4
      if (canPlayType(video, 'mp4') && !chromeBased) { videoType = 'mp4' } else if (canPlayType(video, 'webm')) { videoType = 'webm' }
    }

    return videoType
  }

  this.getNoAccessIssue = function () {
    var message = 'Unable to access webcam'
    var explanation

    if (this.isChromeBased()) {
      explanation = 'Click on the allow button to grant access to your webcam.'
    } else if (this.isFirefox()) {
      explanation = 'Please grant Firefox access to your webcam.'
    } else {
      explanation = 'Your system does not let your browser access your webcam.'
    }

    return VideomailError.create(message, explanation, options)
  }

  this.isChromeBased = function () {
    return chromeBased
  }

  this.isFirefox = function () {
    return firefox
  }

  this.isEdge = function () {
    return isEdge
  }

  this.getUsefulData = function () {
    return {
      browser: uaParser.browser,
      device: uaParser.device,
      os: uaParser.os,
      engine: uaParser.engine,
      userAgent: ua
    }
  }
}
