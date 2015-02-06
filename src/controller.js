var util         = require('util'),

    EventEmitter = require('./util/eventEmitter')

var Controller = function(container) {

    this.unload = function() {
        container.unload()
    }
}

util.inherits(Controller, EventEmitter)

module.exports = Controller
