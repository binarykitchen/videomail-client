var despot = require('despot'),

    VideomailError = require('./videomailError'),
    Events         = require('./../events')

// CONTINUE FROM HERE, MAKE EVENT EMITTING IN DESPOT NOT GLOBAL BUT BY CONTAINER ID INSTEAD

module.exports = function(options, name) {

    this.emit = function(event) {

        var args = Array.prototype.slice.call(arguments, 0)

        if (!event)
            throw VideomailError.create('You cannot emit without an event.', options)

        // Automatically convert errors to videomail errors
        if (event === Events.ERROR) {
            var err = args[1]

            err = VideomailError.create(err, options)

            args[1] = err
        }


        if (options.debug)
            if (event != 'removeListener' && event != 'newListener') {
                var moreArguments

                if (args[1])
                    moreArguments = args.slice(1)

                if (moreArguments)
                    options.debug('%s emits: %s', name, event, moreArguments)
                else
                    options.debug('%s emits: %s', name, event)
            }

        return despot.emit.apply(despot, args)
    }

    this.on = function(eventName, cb) {
        return despot.on(eventName, cb)
    }

    this.once = function(eventName, cb) {
        return despot.once(eventName, cb)
    }

    this.listeners = function(eventName) {
        return despot.listeners(eventName)
    }

    this.removeAllListeners = function() {
        despot.removeAllListeners()
    }
}
