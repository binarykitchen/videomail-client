var merge           = require('merge-recursive'),
    readystate      = require('readystate'),
    util            = require('util'),

    defaultOptions = require('./options'),
    Events         = require('./events'),
    CollectLogger  = require('./util/collectLogger'),
    EventEmitter   = require('./util/eventEmitter'),
    Container      = require('./wrappers/container'),
    Replay         = require('./wrappers/visuals/replay'),

    Browser         = require('./util/browser'),
    Resource        = require('./resource'),

    browser

function adjustOptions(options) {
    var localOptions    = merge.recursive(defaultOptions, options || {})
    localOptions.logger = new CollectLogger(localOptions)
    localOptions.debug  = localOptions.logger.debug

    return localOptions
}

function getBrowser(localOptions) {
    if (!browser)
        browser = new Browser(localOptions)

    return browser
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
            container.build(containerId) && self.emit(Events.FORM_READY)
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

    this.canRecord = function() {
        return getBrowser(localOptions).canRecord()
    }
}

util.inherits(VideomailClient, EventEmitter)

module.exports = VideomailClient
