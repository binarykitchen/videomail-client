module.exports = function(window, navigator) {

    // todo: add https://github.com/eligrey/classList.js when package.json is avail
    // see https://github.com/eligrey/classList.js/issues/41

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
            'debug', 'groupCollapsed', 'groupEnd', 'error',
            'exception', 'info', 'log', 'trace', 'warn'
        ],
        length  = methods.length,
        console = (window.console = window.console || {})

    while (length--) {
        method = methods[length]

        if (!console[method]) console[method] = noop
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

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {

        Object.keys = (function() {

            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length

            return function(obj) {

                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object')
                }

                var result = [], prop, i

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) result.push(prop)
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i])
                    }
                }

                return result
            }
        }())
    }
}
