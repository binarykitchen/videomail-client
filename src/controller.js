var util         = require('util'),
    EventEmitter = require('events').EventEmitter

var Controller = function(container) {

    this.unload = function() {
        container.unload()
    }

    this.isValid = function() {
        return container.isValid()
    }

    this.isReady = function() {
        return container.isReady()
    }

    /*
    this.beginWaiting   = container.beginWaiting
    this.endWaiting     = container.endWaiting
    this.notify         = container.notify
    this.getRecorder    = container.getRecorder
    this.block          = container.block
    this.setExplanation = container.setExplanation
    this.hideNotifier   = container.hideNotifier
    this.showNotifier   = container.showNotifier
    this.hideReplay     = container.hideReplay
    this.hideRecorder   = container.hideRecorder
    this.showReplay     = container.showReplay
    this.showRecorder   = container.showRecorder
    this.reset          = container.reset
    this.stop           = container.stop
    this.pause          = container.pause
    this.record         = container.record
    this.resume         = container.resume
    this.back           = container.back
    this.isPaused       = container.isPaused
    */
}

util.inherits(Controller, EventEmitter)

module.exports = Controller
