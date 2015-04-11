var singletonEvent = require('node-singleton-event')

module.exports = function(options, name) {

    this.emit = function(event) {

        var args = [].splice.call(arguments, 0)

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

    this.on = function(eventName, cb) {
        return singletonEvent.on(eventName, cb)
    }

    this.listeners = function(eventName) {
        return singletonEvent.listeners(eventName)
    }

    this.removeAllListeners = function() {
        return singletonEvent.removeAllListeners()
    }
}
