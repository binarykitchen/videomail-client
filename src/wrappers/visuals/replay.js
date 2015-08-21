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

        replayElement.style.width  = width  ? width + 'px' : 'auto'
        replayElement.style.height = height ? height + 'px' : 'auto'
    }

    this.setVideomail = function(newVideomail) {
        videomail = newVideomail

        if (videomail.webm)
            this.setWebMSource(videomail.webm)

        if (videomail.mp4)
            this.setMp4Source(videomail.mp4)

        copyAttributes(newVideomail)

        correctDimensions()

        this.show()
    }

    this.show = function(recorderWidth, recorderHeight) {
        correctDimensions({
            responsive:  true,
            videoWidth:  recorderWidth,
            videoHeight: recorderHeight
        })

        replayElement.classList.remove('hide')

        if (parentElement.classList)
            parentElement.classList.remove('hide')

        // add a little delay to make sure the source is set
        setTimeout(function() {
            replayElement.load()
        }, 30)

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

        if (!replayElement.controls)
            replayElement.controls = true

        if (!built) {
            if (!isStandalone()) {
                this.on(Events.PREVIEW, function(key, recorderWidth, recorderHeight) {
                    self.show(recorderWidth, recorderHeight)
                })
            }

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

        if (replayElement) {
            this.setMp4Source(null)
            this.setWebMSource(null)
        }
    }

    this.hide = function() {
        if (isStandalone())
            parentElement.classList.add('hide')
        else
            replayElement && replayElement.classList.add('hide')
    }

    this.isShown = function() {
        return replayElement && !replayElement.classList.contains('hide')
    }
}

util.inherits(Replay, EventEmitter)

module.exports = Replay
