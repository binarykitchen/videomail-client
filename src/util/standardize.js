module.exports = function(window, navigator) {

    require('es5-shim')

    navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia

    window.AudioContext =
        window.AudioContext ||
        window.webkitAudioContext

    window.URL =
        window.URL ||
        window.webkitURL ||
        window.mozURL ||
        window.msURL

    window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame

    window.cancelAnimationFrame =
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame

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
            'debug', 'dir', 'error', 'exception', 'info', 'log', 'trace', 'warn'
        ],
        length  = methods.length,
        console = (window.console = window.console || {})

    while (length--) {
        method = methods[length]

        if (!console[method])
            console[method] = noop
    }

    if (typeof Object.create != 'function') {
        Object.create = (function() {
            var Object = function() {}

            return function (prototype) {
                Object.prototype = prototype
                var result = {}
                Object.prototype = null
                return result
            }
        })()
    }
}
