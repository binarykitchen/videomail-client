var merge           = require('merge-recursive'),
    insertCss       = require('insert-css'),

    Recorder        = require('./recorder'),
    Resource        = require('./resource'),

    VideomailError  = require('./util/videomailError'),
    Browser         = require('./util/browser'),
    standardize     = require('./util/standardize'),

    CountdownTimer  = require('./util/timers/countdown'),
    RecordTimer     = require('./util/timers/record'),

    css             = require('./assets/css/main.min.css.js'),

    browser         = new Browser(),
    resource        = new Resource()

// todo: consider using a web component instead!

function prependDefaultCss() {
    insertCss(css, {prepend: true})
}

function factory() {

    return {
        globalOptions: {
            logger:         console,
            debug:          false,
            timeout:        10000,
            baseUrl:        'https://videomail.io',
            socketUrl:      'wss://videomail.io',
            reconnect:      true,
            cache:          true,
            insertCss:      true,
            selectors: {
                containerId:    'videomail',
                replayClass:    'replay',
                userMediaClass: 'userMedia',
            },
            audio: {
                enabled: false
            },
            video: {
                fps:            15,
                limitSeconds:   60,
                countdown:      3
            },
            image: {
                quality:    .8,
                types:      ['webp', 'jpeg']
            }
        },

        setGlobalOptions: function(newGlobalOptions) {
            this.globalOptions = merge.recursive(this.globalOptions, newGlobalOptions)
        },

        getOptions: function(localOptions) {
            localOptions = merge.recursive(this.globalOptions, localOptions || {})

            if (localOptions.debug)
                localOptions.debug = localOptions.logger.debug.bind(localOptions.logger)
            else
                localOptions.debug = function() {}

            return localOptions
        },

        init: function(localOptions, cb) {

            var replayElement,
                recorderElement,
                containerElement,
                err

            if (!cb) {
                cb           = localOptions
                localOptions = this.getOptions()
            } else
                localOptions = this.getOptions(localOptions)

            containerElement = document.getElementById(localOptions.selectors.containerId)

            if (!err && !containerElement)
                err = new VideomailError('The container ID is invalid!', {
                    explanation: 'No tag with the ID ' + localOptions.selectors.containerId + ' could be found.'
                })
            else
                containerElement.classList.add('videomail')

            if (!err)
                replayElement = containerElement.querySelector('video.' + localOptions.selectors.replayClass)

            if (!err && !replayElement)
                err = new VideomailError('Invalid replay video class!', {
                    explanation: 'No video with the class ' + localOptions.selectors.replayClass + ' could be found.'
                })

            if (!err)
                recorderElement = containerElement.querySelector('video.' + localOptions.selectors.userMediaClass)

            if (!err && !recorderElement)
                err = new VideomailError('Invalid recorder video class!', {
                    explanation: 'No video with the class ' + localOptions.selectors.userMediaClass + ' could be found.'
                })

            if (!err)
                err = browser.checkRecordingCapabilities()

            if (!err)
                err = browser.checkPlaybackCapabilities(replayElement)

            if (!err)
                err = browser.checkBufferTypes()

            if (err)
                cb(err)

            else {
                localOptions.insertCss && prependDefaultCss()

                var recorder = new Recorder(recorderElement, replayElement, localOptions)

                if (localOptions.load)
                    Videomail.get(localOptions.load, localOptions, function(err, videomail) {

                        if (err) {
                            recorder.unload(err)
                            cb(err)
                        } else
                            cb(null, recorder, videomail)
                    })
                else
                    cb(null, recorder)
            }
        },

        get: function(identifier, options, cb) {
            if (!cb) {
                cb      = options
                options = this.globalOptions
            }

            resource.get(identifier, options, cb)
        },

        post: function(videomail, options, cb) {
            if (!cb) {
                cb      = options
                options = this.globalOptions
            }

            resource.post(videomail, options, cb)
        },

        canRecord: function() {
            return browser.canRecord()
        },

        createError: function(err) {
            return VideomailError.create(err)
        },

        createRecordTimer: function(localOptions) {
            return new RecordTimer(this.getOptions(localOptions))
        },

        createCountdownTimer: function(localOptions) {
            return new CountdownTimer(this.getOptions(localOptions))
        }
    }
}

// UMD (Universal Module Definition)
// Inspired by https://github.com/es-shims/es5-shim
;(function(root, navigator, factory) {
    standardize(root, navigator)

    if (typeof exports === 'object') {
        module.exports = factory()
    } else {
        root.Videomail = factory()
    }
}(this, navigator, factory))
