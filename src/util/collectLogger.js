var util    = require('util'),
    Browser = require('./browser')

module.exports = function(localOptions) {

    localOptions = localOptions || {}

    var browser     = new Browser(localOptions),
        logger      = localOptions.logger || console,
        containerId = localOptions.selectors && localOptions.selectors.containerId || 'undefined container id',
        stack       = []

    function lifo(level, parameters) {
        var line = util.format.apply(util, parameters)

        if (stack.length > localOptions.logStackSize)
            stack.pop()

        stack.push('[' + level + '] ' +  line)

        return line
    }

    function addContainerId(firstArgument) {
        return '#' + containerId + ' > ' + firstArgument
    }

    // workaround: since we cannot overwrite console.log without having the correct file and line number
    // we'll use groupCollapsed() and trace() instead to get these.
    this.debug = function() {
        if (localOptions.verbose) {

            arguments[0] = addContainerId(arguments[0])

            var output = lifo('debug', arguments)

            if (browser.isFirefox()) {
                logger.debug(output)

            } else if (logger.groupCollapsed) {
                logger.groupCollapsed(output)
                logger.trace('Trace')
                logger.groupEnd()

            } else if (logger.debug) {
                logger.debug(output)

            } else {
                // last resort if everything else fails for any weird reasons
                console.log(output)
            }
        }
    }

    this.error = function() {
        arguments[0] = addContainerId(arguments[0])
        logger.error(lifo('error', arguments))
    }

    this.warn = function() {
        arguments[0] = addContainerId(arguments[0])
        logger.warn(lifo('warn', arguments))
    }

    this.getLines = function() {
        return stack
    }
}
