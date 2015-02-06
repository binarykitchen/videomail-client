var util         = require('util'),

    EventEmitter = require('./util/eventEmitter'),
    Resource     = require('./resource')

var Controller = function(container, options) {

    var resource = new Resource(options)

    this.unload = function() {
        container.unload()
    }

    this.validate = function() {
        return container.validate()
    }

    this.submit = function(videomail, cb) {

        container.beginWaiting()

        if (!cb) {
            cb        = videomail
            videomail = null
        }

        if (!videomail)
            videomail = {}

        videomail.avgFps = container.getAvgFps()
        videomail.key    = container.getVideomailKey()

        if (options.audio.enabled)
            videomail.sampleRate = container.getAudioSampleRate()

        container.emit('submitting')

        resource.post(videomail, function(err, response) {

            container.endWaiting()

            if (err) {
                container.emit('error', err)
                cb && cb(err)
            } else
                container.emit('submitted')
                cb && cb(null, response)
        })
    }

    /*
    get: function(identifier, options, cb) {
        if (!cb) {
            cb      = options
            options = this.globalOptions
        }

        resource.get(identifier, options, cb)
    },
    */

    /*
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
