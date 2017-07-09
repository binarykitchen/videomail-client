import 'core-js/shim'
import 'classlist.js'

// needed for IE 11
import 'element-closest'

// https://github.com/julienetie/request-frame
import requestFrame from 'request-frame'

// use those default params for unit tests
export default function (window = {}, navigator = {}) {
  // https://github.com/julienetie/request-frame/issues/6
  window.screen = window.screen || {}

  requestFrame('native')

  // avoids warning "navigator.mozGetUserMedia has been replaced by navigator.mediaDevices.getUserMedia",
  // see https://github.com/binarykitchen/videomail-client/issues/79
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // do not shim
  } else {
    navigator.getUserMedia_ =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia
  }

  window.AudioContext = window.AudioContext || window.webkitAudioContext
  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL

  const methods = [
    'debug', 'groupCollapsed', 'groupEnd', 'error',
    'exception', 'info', 'log', 'trace', 'warn'
  ]

  const noop = function () {}
  const console = (window.console = window.console || {})

  var method
  var length = methods.length

  while (length--) {
    method = methods[length]

    if (!console[method]) {
      console[method] = noop
    }
  }
}
