var singletonEvent = require('node-singleton-event'),
    VideomailError = require('./videomailError')

module.exports = function(options, name) {

    this.emit = function(event) {

        var args = [].splice.call(arguments, 0)

        // Automatically convert errors to videomail errors
        if (event === 'error') {
            var err = args[1]

            err = VideomailError.create(err, options)

            args[1] = err
        }

        if (options.debug)
            if (event != 'removeListener' && event != 'newListener') {
                var moreArguments = args.slice(1)

                if (moreArguments.length > 0)
                    options.debug('%s emits: %s', name, event, moreArguments)
                else
                    options.debug('%s emits: %s', name, event)
            }

        return singletonEvent.emit.apply(singletonEvent, args)
    }

    // Not working well with IE10, see https://github.com/teawithfruit/node-singleton-event/issues/5
    this.on = function(eventName, cb) {
        return singletonEvent.on(eventName, cb)
    }

    this.listeners = function(eventName) {
        return singletonEvent.listeners(eventName)
    }

    this.removeAllListeners = function() {
        singletonEvent.removeAllListeners()
    }
}
