module.exports = function(window, navigator) {

    require('es5-shim')
    require('classlist.js')

    // https://github.com/julienetie/request-frame/issues/6
    window.screen = window.screen || {}

    // https://github.com/julienetie/request-frame
    require('request-frame')('native')

    navigator.getUserMedia_ =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia

    window.AudioContext = window.AudioContext || window.webkitAudioContext
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL

    window.XMLHttpRequest = (
        window.XMLHttpRequest || function() {
        try { return new ActiveXObject("Msxml3.XMLHTTP") } catch (e0) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP.6.0") } catch (e1) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP.3.0") } catch (e2) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP") } catch (e3) {}
        try { return new ActiveXObject("Microsoft.XMLHTTP") } catch (e4) {}
    })

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
