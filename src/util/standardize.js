module.exports = function(window, navigator) {

    require('es5-shim')

    if (typeof self !== "undefined")
        require('classlist.js')

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

    var method,
        noop = function() {},
        methods = [
            'debug', 'groupCollapsed', 'groupEnd', 'error',
            'exception', 'info', 'log', 'trace', 'warn'
        ],
        length  = methods.length,
        console = (window.console = window.console || {})

    while (length--) {
        method = methods[length]

        if (!console[method]) console[method] = noop
    }
}
