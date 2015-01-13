var merge           = require('merge-recursive'),

    Recorder        = require('./recorder'),
    Resource        = require('./resource'),
    // Builder         = require('./builder'),

    VideomailError  = require('./util/videomailError'),
    Browser         = require('./util/browser'),
    standardize     = require('./util/standardize'),

    CountdownTimer  = require('./util/timers/countdown'),
    RecordTimer     = require('./util/timers/record'),

    browser         = new Browser(),
    resource        = new Resource()

    // , builder

// todo: consider using a web component instead!

function insertCss() {
    var css = '.videomail{position:relative}.videomail .hide{display:none}.videomail .replay,.videomail .userMedia{width:100%!important;height:100%!important}.videomail .countdown,.videomail .paused,.videomail .recordNote,.videomail .recordTimer{margin:0}.videomail .countdown,.videomail .paused,.videomail .recordNote,.videomail .recordTimer,.videomail noscript{position:absolute;font-weight:700}.videomail .countdown,.videomail .paused,.videomail noscript{width:100%;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%)}.videomail .paused{opacity:.75;text-align:center}.videomail .countdown{opacity:.7;text-align:center}.videomail .recordNote,.videomail .recordTimer{right:.7em;background:rgba(10,10,10,.85);padding:.4em .4em .3em;transition:all 1s ease}.videomail .recordTimer{top:.7em}.videomail .recordNote{top:3.6em}.videomail .recordNote:before{content:"REC";-webkit-animation:blink 1s infinite;animation:blink 1s infinite}.videomail .notifier{display:table-cell;vertical-align:middle;overflow:hidden;box-sizing:border-box}'
    require('insert-css')(css)
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

        /* comment back later when we want to automatically build the html elements in a new version
        build: function(containerId, localOptions, cb) {
            builder = builder || new Builder()

            var self = this

            builder.construct(containerId, localOptions, function(err, recorderId, playerId) {
                if (err) {
                    cb(err)
                } else {
                    self.init(recorderId, playerId, localOptions, cb)
                }
            })
        },
        */

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
                localOptions.insertCss && insertCss()

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
