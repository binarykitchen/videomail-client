var merge           = require('merge-recursive'),
    readystate      = require('readystate'),
    util            = require('util'),

    defaultOptions = require('./options'),
    Events         = require('./events'),
    EventEmitter   = require('./util/eventEmitter'),
    Container      = require('./wrappers/container'),
    Replay         = require('./wrappers/visuals/replay'),

    // just temporary
    Browser         = require('./util/browser'),
    Resource        = require('./resource'),

    browser

function adjustOptions(options) {
    var localOptions = merge.recursive(defaultOptions, options || {})

    if (localOptions.debug)
        localOptions.debug = localOptions.logger.debug.bind(localOptions.logger)
    else
        localOptions.debug = function() {}

    return localOptions
}

var VideomailClient = function(options) {

    var localOptions = adjustOptions(options),
        container    = new Container(localOptions),
        self         = this

    EventEmitter.call(this, localOptions, 'VideomailClient')

    // expose all possible events
    this.events = Events

    this.form = function(containerId) {

        function buildForm() {
            container.build(containerId)
            self.emit(Events.FORM_READY)
        }

        readystate.interactive(buildForm)
    }

    // automatically adds a <video> element inside the given parentElement and loads
    // it with the videomail
    this.replay = function(parentElement, videomail) {
        var replayElement = new Replay(parentElement, localOptions)

        replayElement.build()

        replayElement.setVideomail(videomail)

        replayElement.show()
    }

    this.startOver = function() {
        container.startOver()
    }

    this.unload = function() {
        container.unload()
    }

    this.get = function(key, cb) {
        var resource = new Resource(localOptions)
        resource.get(key, cb)
    }

    // TODO: remove later
    this.getBrowser = function() {
        if (!browser)
            browser = new Browser(localOptions.fakeUaString)

        return browser
    }

    // TODO: remove later
    this.canRecord = function() {
        return this.getBrowser().canRecord()
    }
}

util.inherits(VideomailClient, EventEmitter)

// --------------- STATIC FUNCTIONS --------------- //

VideomailClient.setDefaultOptions = function(newDefaultOptions) {
    defaultOptions = merge.recursive(defaultOptions, newDefaultOptions)
}

module.exports = VideomailClient
