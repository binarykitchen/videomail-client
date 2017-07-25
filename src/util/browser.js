import UAParser from 'ua-parser-js'
import defined from 'defined'
import VideomailError from './videomailError'

const Browser = function (options) {
  options = options || {}

  const firefoxDownload = 'http://www.mozilla.org/firefox/update/'
  const edgeDownload = 'https://www.microsoft.com/en-us/download/details.aspx?id=48126'
  const chromeDownload = 'http://www.google.com/chrome/'
  const chromiumDownload = 'http://www.chromium.org/getting-involved/download-chromium'
  const browseHappyLink = 'http://browsehappy.com'
  const ua = defined(options.fakeUaString, (
    typeof window !== 'undefined' &&
    window.navigator &&
    window.navigator.userAgent
  ), '')

  const uaParser = new UAParser(ua).getResult()

  const isIOS = uaParser.os.name === 'iOS'
  const isChrome = uaParser.browser.name === 'Chrome'
  const isChromium = uaParser.browser.name === 'Chromium'
  const firefox = uaParser.browser.name === 'Firefox'
  const osVersion = parseFloat(uaParser.os.version)
  const isWindows = uaParser.os.name === 'Windows'
  const isEdge = uaParser.browser.name === 'Edge' || (isWindows && osVersion >= 10)
  const isIE = /IE/.test(uaParser.browser.name)
  const isSafari = /Safari/.test(uaParser.browser.name)
  const isOpera = /Opera/.test(uaParser.browser.name)
  const isAndroid = /Android/.test(uaParser.os.name)
  const chromeBased = isChrome || isChromium
  const okBrowser = chromeBased || firefox || isAndroid || isOpera || isEdge

  const self = this

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

    if (video && video.canPlayType) {
      canPlayType = video.canPlayType('video/' + type)
    }

    return canPlayType
  }

    // just temporary
  this.canRecord = function () {
    const hasNavigator = typeof navigator !== 'undefined'
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
      const classList = []

      if (isIOS) {
        classList.push(VideomailError.IOS_PROBLEM)
      } else {
        classList.push(VideomailError.BROWSER_PROBLEM)
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
    options.debug('Browser: checkPlaybackCapabilities()')

    var err
    var message

    if (!video) {
      message = 'No HTML5 support for video tag!'
    } else if (!this.getVideoType(video)) {
      message = 'Your old browser cannot support modern video codecs'
    } else if (!video.setAttribute) {
      // fixes "Not implemented" error on older browsers
      message = 'Unable to set video attributes in your old browser'
    }

    if (message) {
      err = VideomailError.create(message, getPlaybackWarning(), options)
    }

    return err
  }

  this.checkBufferTypes = function () {
    var err

    if (typeof window === 'undefined' || typeof window.atob === 'undefined') {
      err = VideomailError.create('atob is not supported', options)
    } else if (typeof window.ArrayBuffer === 'undefined') {
      err = VideomailError.create('ArrayBuffers are not supported', options)
    } else if (typeof window.Uint8Array === 'undefined') {
      err = VideomailError.create('Uint8Arrays are not supported', options)
    }

    return err
  }

  this.getVideoType = function (video) {
    if (!videoType) {
      // there is a bug in canPlayType within chrome for mp4
      if (canPlayType(video, 'mp4') && !chromeBased) {
        videoType = 'mp4'
      } else if (canPlayType(video, 'webm')) {
        videoType = 'webm'
      }
    }

    return videoType
  }

  this.getNoAccessIssue = function () {
    const message = 'Unable to access webcam'
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

  this.isMobile = function () {
    return uaParser.device.type === 'mobile'
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

export default Browser

// so that we also can require() it from videomailError.js within
module.exports = Browser
