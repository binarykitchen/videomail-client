require('core-js/shim')
require('classlist.js')
require('element-closest') // needed for IE 11

module.exports = function(window, navigator) {
    // https://github.com/julienetie/request-frame/issues/6
    window.screen = window.screen || {}

    // https://github.com/julienetie/request-frame
    require('request-frame')('native')

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

    var     methods = [
                'debug', 'groupCollapsed', 'groupEnd', 'error',
                'exception', 'info', 'log', 'trace', 'warn'
            ],

            noop = function() {},
            console = (window.console = window.console || {})

    var method,
        length  = methods.length

    while (length--) {
        method = methods[length]

        if (!console[method]) console[method] = noop
    }
}
