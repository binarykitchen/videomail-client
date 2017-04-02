const   util    = require('util'),
        Browser = require('./browser')

module.exports = function(localOptions) {

    localOptions = localOptions || {}

    const   browser     = new Browser(localOptions),
            logger      = localOptions.logger || console,
            containerId = localOptions.selectors && localOptions.selectors.containerId || 'undefined container id',
            stack       = []

    function lifo(level, parameters) {
        const line = util.format.apply(util, parameters)

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

            const args = [].slice.call(arguments, 0)

            args[0] = addContainerId(args[0])

            const output = lifo('debug', args)

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
        const args = [].slice.call(arguments, 0)
        args[0] = addContainerId(args[0])
        logger.error(lifo('error', args))
    }

    this.warn = function() {
        const args = [].slice.call(arguments, 0)
        args[0] = addContainerId(args[0])
        logger.warn(lifo('warn', args))
    }

    this.getLines = function() {
        return stack
    }
}
