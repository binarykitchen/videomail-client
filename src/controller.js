var util         = require('util'),

    EventEmitter = require('./util/eventEmitter'),

    Replay       = require('./wrappers/visuals/replay')

var Controller = function(container, options) {

    EventEmitter.call(this, options, 'Controller')

    this.unload = function() {
        container.unload()
    }

    // automatically adds a <video> element inside the given parentElement and loads
    // it with the videomail
    this.addReplay = function(parentElement, videomail) {
        var replay = new Replay(parentElement, options)

        replay.build()

        replay.setVideomail(videomail)

        replay.show()
    }
}

util.inherits(Controller, EventEmitter)

module.exports = Controller
