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

    collectLogger,
    browser

function adjustOptions(options) {
    var localOptions = merge.recursive(defaultOptions, options || {})

    collectLogger = collectLogger || new CollectLogger(localOptions)

    localOptions.logger = collectLogger
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
        replay

    EventEmitter.call(this, localOptions, 'VideomailClient')

    // expose all possible events
    this.events = Events

    function build(containerId, cb) {
        function buildForm() {
            localOptions.debug('VideomailClient: buildForm()')

            container.build(containerId)
            cb && cb()
        }

        readystate.interactive(buildForm)
    }

    this.show = function(containerId) {
        localOptions.debug('VideomailClient: show()')

        build(containerId, container.show)
    }

    // automatically adds a <video> element inside the given parentElement and loads
    // it with the videomail
    this.replay = function(parentElement, videomail) {
        container.hide()

        replay = new Replay(parentElement, localOptions)

        replay.build()

        replay.setVideomail(videomail)
    }

    this.startOver = function() {
        replay && replay.hide()
        container.startOver()
    }

    this.unload = function(e) {
        container.unload(e)
    }

    this.hide = function() {
        container.hide()
    }

    this.get = function(key, cb) {
        new Resource(localOptions).get(key, cb)
    }

    this.canRecord = function() {
        return getBrowser(localOptions).canRecord()
    }

    build()
}

util.inherits(VideomailClient, EventEmitter)

module.exports = VideomailClient
