var despot = require('despot')

var VideomailError = require('./videomailError')
var Events = require('./../events')

// TODO: MAKE EVENT EMITTING IN DESPOT NOT GLOBAL BUT BY CONTAINER ID INSTEAD

module.exports = function (options, name) {
  this.emit = function (event) {
    var args = Array.prototype.slice.call(arguments, 0)

    if (!event) {
      throw VideomailError.create('You cannot emit without an event.', options)
    }

        // Automatically convert errors to videomail errors
    if (event === Events.ERROR) {
      var err = args[1]

      err = VideomailError.create(err, options)

      args[1] = err
    }

    if (options.debug) {
      if (event !== 'removeListener' && event !== 'newListener') {
        var moreArguments

        if (args[1]) {
          moreArguments = args.slice(1)
        }

        if (moreArguments) {
          options.debug('%s emits: %s', name, event, moreArguments)
        } else {
          options.debug('%s emits: %s', name, event)
        }
      }
    }

    var result = despot.emit.apply(despot, args)

        // Todo: have this emitted through a configuration because it is pretty noisy
        // if (event !== Events.EVENT_EMITTED)
        //     this.emit(Events.EVENT_EMITTED, event)

    return result
  }

  this.on = function (eventName, cb) {
    return despot.on(eventName, cb)
  }

  this.once = function (eventName, cb) {
    return despot.once(eventName, cb)
  }

  this.listeners = function (eventName) {
    return despot.listeners(eventName)
  }

  this.removeListener = function (eventName, cb) {
    return despot.removeListener(eventName, cb)
  }

  this.removeAllListeners = function () {
    despot.removeAllListeners()
  }
}
