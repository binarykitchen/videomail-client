var util         = require('util'),
    EventEmitter = require('events').EventEmitter

var VideomailEventEmitter = function(options, name) {

    if (options.debug) {

        if (!this.originalEmit)
            this.originalEmit = this.emit

        this.emit = function(event) {

            var args = [].splice.call(arguments, 0)

            if (event != 'removeListener' && event != 'newListener') {
                var moreArguments = args.slice(1)

                if (moreArguments.length > 0)
                    options.debug('%s emits: %s', name, event, moreArguments)
                else
                    options.debug('%s emits: %s', name, event)
            }

            return this.originalEmit.apply(this, args)
        }
    }
}

util.inherits(VideomailEventEmitter, EventEmitter)

module.exports = VideomailEventEmitter
