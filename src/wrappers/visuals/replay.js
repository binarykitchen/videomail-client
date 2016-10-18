var util   = require('util'),
    h      = require('hyperscript'),
    hidden = require('hidden'),

    Events          = require('./../../events'),
    Browser         = require('./../../util/browser'),
    EventEmitter    = require('./../../util/eventEmitter'),

    makeVideoPlayableInline

if ('undefined' != typeof navigator)
    makeVideoPlayableInline = require('iphone-inline-video')

var Replay = function(parentElement, options) {

    EventEmitter.call(this, options, 'Replay')

    var self    = this,
        browser = new Browser(options),

        built,
        replayElement,
        videomail

    function buildElement() {
        replayElement = h('video.' + options.selectors.replayClass)
        parentElement.appendChild(replayElement)
    }

    function isStandalone() {
        return parentElement.constructor.name === 'HTMLDivElement'
    }

    function copyAttributes(newVideomail) {
        var attributeContainer

        Object.keys(newVideomail).forEach(function(attribute) {
            attributeContainer = parentElement.querySelector('.' + attribute)

            if (attributeContainer)
                attributeContainer.innerHTML = newVideomail[attribute]
        })
    }

    function correctDimensions(options) {
        var width, height

        if (videomail && videomail.playerWidth)
            width = videomail.playerWidth
        else if (parentElement.calculateWidth)
            width = parentElement.calculateWidth(options)

        if (videomail && videomail.playerHeight)
            height = videomail.playerHeight
        else if (parentElement.calculateHeight)
            height = parentElement.calculateHeight(options)

        if (width > 0)
            replayElement.style.width = width  + 'px'
        else
            replayElement.style.width = 'auto'

        if (height > 0)
            replayElement.style.height = height + 'px'
        else
            replayElement.style.height = 'auto'
    }

    this.setVideomail = function(newVideomail) {
        videomail = newVideomail

        if (videomail.webm)
            this.setWebMSource(videomail.webm)

        if (videomail.mp4)
            this.setMp4Source(videomail.mp4)

        if (videomail.poster)
            replayElement.setAttribute('poster', videomail.poster)

        copyAttributes(newVideomail)

        this.show(videomail.width, videomail.height)
    }

    this.show = function(recorderWidth, recorderHeight) {
        correctDimensions({
            responsive:  true,
            // beware that recorderWidth and recorderHeight can be null sometimes
            videoWidth:  recorderWidth  || replayElement.videoWidth,
            videoHeight: recorderHeight || replayElement.videoHeight
        })

        hidden(replayElement, false)

        // parent element can be any object, be careful!
        if (parentElement) {
            if (parentElement.style)
                hidden(parentElement, false)
            else if (parentElement.show)
                parentElement.show()
        }

        // this must be called after setting the sources and when becoming visible
        // see https://github.com/bfred-it/iphone-inline-video/issues/16
        makeVideoPlayableInline && makeVideoPlayableInline(replayElement, options.isAudioEnabled())

        // this forces to actually fetch the videos from the server
        replayElement.load()

        if (!videomail)
            self.emit(Events.PREVIEW_SHOWN)
        else
            self.emit(Events.REPLAY_SHOWN)
    }

    this.build = function() {
        replayElement = parentElement.querySelector('video.' + options.selectors.replayClass)

        if (!replayElement)
            buildElement()

        this.hide()

        if (!replayElement.autoplay)
            replayElement.autoplay = true

        if (!replayElement.autostart)
            replayElement.autostart = true

        if (!replayElement.autobuffer)
            replayElement.autobuffer = true

        if (!replayElement.controls)
            replayElement.controls = 'controls'

        if (!replayElement.preload)
            replayElement.preload = 'auto'

        replayElement.setAttribute('webkit-playsinline', 'webkit-playsinline')

        if (!built) {
            if (!isStandalone()) {
                this.on(Events.PREVIEW, function(key, recorderWidth, recorderHeight) {
                    self.show(recorderWidth, recorderHeight)
                })
            }

            replayElement.addEventListener('touchstart', function(e) {
                e && e.preventDefault()

                if (this.paused)
                    play()
                else
                    pause()
            })

            replayElement.onclick = function(e) {
                e && e.preventDefault()

                if (this.paused)
                    play()
                else
                    pause()
            }
        }

        browser.checkPlaybackCapabilities(replayElement)

        built = true
    }

    this.unload = function() {
        built = false
    }

    this.getVideoSource = function(type) {
        var sources = replayElement.getElementsByTagName('source'),
            l       = sources.length,
            type    = 'video/' + type,
            source

        if (l) {
            var i

            for (i = 0; i < l && !source; i++) {
                if (sources[i].getAttribute('type') === type)
                    source = sources[i]
            }
        }

        return source
    }

    function setVideoSource(type, src) {
        var source = self.getVideoSource(type)
        var timestamp = Date.now()

        if (src)
            src += '?' +  timestamp

        if (!source) {
            if (src) {
                var source = h('source', {
                    src:  src,
                    type: 'video/' + type
                })

                replayElement.appendChild(source)
            }
        } else {
            if (src)
                source.setAttribute('src', src)
            else
                replayElement.removeChild(source)
        }
    }

    this.setMp4Source = function(src) {
        setVideoSource('mp4', src)
    }

    this.setWebMSource = function(src) {
        setVideoSource('webm', src)
    }

    this.getVideoType = function() {
        return browser.getVideoType(replayElement)
    }

    function pause(cb) {
        if (replayElement && replayElement.pause)
            replayElement.pause()

        cb && cb()
    }

    function play(cb) {
        if (replayElement && replayElement.play && replayElement.duration) {
            const p = replayElement.play()

            if (p && (typeof Promise !== 'undefined') && (p instanceof Promise)) {
                p.then(function() {
                    cb && cb()
                })
            } else
                cb && cb()
        } else
            cb && cb()
    }

    this.reset = function(cb) {
        // pause video to make sure it won't consume any memory
        pause(function() {
            if (replayElement) {
                self.setMp4Source(null)
                self.setWebMSource(null)
            }

            cb && cb()
        })
    }

    this.hide = function() {
        if (isStandalone())
            hidden(parentElement, true)
        else
            replayElement && hidden(replayElement, true)
    }

    this.isShown = function() {
        return replayElement && !hidden(replayElement)
    }

    this.getParentElement = function() {
        return parentElement
    }
}

util.inherits(Replay, EventEmitter)

module.exports = Replay
