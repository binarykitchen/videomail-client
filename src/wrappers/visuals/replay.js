var util            = require('util'),
    Browser         = require('./../../util/browser'),
    EventEmitter    = require('./../../util/eventEmitter'),

    browser = new Browser()

var Replay = function(visuals, options) {

    EventEmitter.call(this, options, 'Replay')

    var self = this,

        replayElement

    function buildElement() {
        replayElement = document.createElement('VIDEO')
        replayElement.classList.add(options.selectors.replayClass)

        self.hide()

        replayElement.autoplay = false
        replayElement.controls = 'controls'

        visuals.appendChild(replayElement)
    }

    function initEvents() {
        replayElement.addEventListener('click', function(e) {
            e.preventDefault()

            if (this.paused)
                this.play()
            else
                self.pause()
        })

        self
            .on('preview', function() {
                show()
            })
    }

    function show() {
        replayElement.classList.remove('hide')
    }

    this.build = function(cb) {
        replayElement = visuals.querySelector('video.' + options.selectors.replayClass)

        if (!replayElement)
            buildElement()
        else
            this.hide()

        if (!replayElement.width && options.video.width)
            replayElement.width = options.video.width

        if (!replayElement.height && options.video.height)
            replayElement.height = options.video.height

        initEvents()

        cb(browser.checkPlaybackCapabilities(replayElement))
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
                var source = document.createElement('source')

                source.setAttribute('src', src)
                source.setAttribute('type', 'video/' + type)

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

    this.load = function() {
        replayElement && replayElement.load()
    }

    this.pause = function() {
        replayElement && replayElement.pause()
    }

    this.reset = function() {
        // pause video to make sure it won't consume any memory
        this.pause()

        this.setMp4Source(null)
        this.setWebMSource(null)
    }

    this.hide = function() {
        replayElement.classList.add('hide')
    }

    this.isShown = function() {
        return !replayElement.classList.contains('hide')
    }
}

util.inherits(Replay, EventEmitter)

module.exports = Replay
