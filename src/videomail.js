var merge           = require('merge-recursive'),

    Recorder        = require('./recorder'),
    Resource        = require('./resource'),
    // Builder         = require('./builder'),

    VideomailError  = require('./util/videomailError'),
    Browser         = require('./util/browser'),
    standardize     = require('./util/standardize'),

    browser         = new Browser(),
    resource        = new Resource()

    // , builder

function factory() {

    return {
        globalOptions: {
            logger:         console,
            timeout:        10000,
            baseUrl:        'https://videomail.io',
            socketUrl:      'wss://videomail.io',
            reconnect:      true,
            cache:          true,
            audio: {
                enabled: false
            },
            video: {
                fps: 15
            },
            image: {
                quality:    .8,
                types:      ['webp', 'jpeg']
            }
        },

        setGlobalOptions: function(newGlobalOptions) {
            this.globalOptions = merge.recursive(this.globalOptions, newGlobalOptions)
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

        init: function(recorderId, playerId, localOptions, cb) {

            var replayElement,
                recorderElement,
                err

            if (!cb) {
                cb           = localOptions
                localOptions = this.globalOptions
            } else
                localOptions = merge.recursive(this.globalOptions, localOptions)

            if (!err && !recorderId) {
                err = new VideomailError('The recorder ID is missing!')
            } else {
                replayElement = document.querySelector('video#' + playerId)
            }

            if (!err && !playerId) {
                err = new VideomailError('The player ID is missing!')
            } else {
                recorderElement = document.querySelector('video#' + recorderId)
            }

            if (!err && !recorderElement)
                err = new VideomailError('Invalid recorder ID!', {
                    explanation: 'No video with the ID ' + recorderElement + ' could be found.'
                })

            if (!err && !replayElement)
                err = new VideomailError('Invalid player ID!', {
                    explanation: 'No video with the ID ' + playerId + ' could be found.'
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
