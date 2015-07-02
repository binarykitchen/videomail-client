var util            = require('util'),
    h               = require('hyperscript'),

    Events          = require('./../../events'),
    Browser         = require('./../../util/browser'),
    EventEmitter    = require('./../../util/eventEmitter')

var Replay = function(parentElement, options) {

    EventEmitter.call(this, options, 'Replay')

    var self    = this,
        browser = new Browser(options),

        built,
        replayElement,
        videomail

    function buildElement() {
        replayElement = h('video.' + options.selectors.replayClass, {
            autoplay: false,
            controls: 'controls'
        })

        self.hide()

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

    this.setVideomail = function(newVideomail) {
        videomail = newVideomail

        if (videomail.webm)
            this.setWebMSource(videomail.webm)

        if (videomail.mp4)
            this.setMp4Source(videomail.mp4)

        copyAttributes(newVideomail)

        this.show()
    }

    this.show = function() {
        replayElement.classList.remove('hide')

        if (parentElement.classList)
            parentElement.classList.remove('hide')

        // add a little delay to make sure the source is set
        setTimeout(function() {
            replayElement.load()
        }, 40)

        if (!isStandalone())
            if (!videomail)
                this.emit(Events.PREVIEW_SHOWN)
            else
                this.emit(Events.REPLAY_SHOWN)
    }

    this.build = function() {
        replayElement = parentElement.querySelector('video.' + options.selectors.replayClass)

        if (!replayElement)
            buildElement()
        else
            this.hide()

        if (!replayElement.width && options.video.width)
            replayElement.width = options.video.width

        if (!replayElement.height && options.video.height)
            replayElement.height = options.video.height

        if (!replayElement.controls)
            replayElement.controls = true

        if (!built) {
            if (!isStandalone()) {
                this.on(Events.PREVIEW, function() {
                    self.show()
                })
            }

// THEN
// - ALLOW MISSING TO IN VIDEOMAIL
// - when subject is missing, do not generate an alias like -81559658 but someting better SEE GITHUB
// - make JS functions to compile video view container
// - tweet and show the world
            replayElement.onclick = function(e) {
                e.preventDefault()

                if (this.paused)
                    this.play()
                else
                    self.pause()
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

    this.pause = function() {
        replayElement && replayElement.pause && replayElement.pause()
    }

    this.reset = function() {
        // pause video to make sure it won't consume any memory
        this.pause()

        this.setMp4Source(null)
        this.setWebMSource(null)
    }

    this.hide = function() {
        if (isStandalone())
            parentElement.classList.add('hide')
        else
            replayElement.classList.add('hide')
    }

    this.isShown = function() {
        return !replayElement.classList.contains('hide')
    }
}

util.inherits(Replay, EventEmitter)

module.exports = Replay
