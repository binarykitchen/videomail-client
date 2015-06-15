var util = require('util')

module.exports = function(localOptions) {

    localOptions = localOptions || {}

    var logger = localOptions.logger || console,
        stack  = []

    function lifo(level, parameters) {
        var line = util.format.apply(util, parameters)

        if (stack.length > localOptions.logStackSize)
            stack.pop()

        stack.push('[' + level + '] ' +  line)

        return line
    }

    // workaround: since we cannot overwrite console.log without having the correct file and line number
    // we'll use groupCollapsed() and trace() instead to get these.
    this.debug = function() {
        logger.groupCollapsed(lifo('debug', arguments))
        logger.trace('Trace')
        logger.groupEnd()
    }

    this.error = function() {
        logger.error(lifo('error', arguments))
    }

    this.warn = function() {
        logger.warn(lifo('warn', arguments))
    }

    this.getLines = function() {
        return stack
    }
}
