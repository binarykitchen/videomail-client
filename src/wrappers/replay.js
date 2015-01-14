var VideomailError = require('./../util/videomailError'),
    Browser        = require('./../util/browser'),

    browser = new Browser()

module.exports = function(container, options) {

    var self = this,

        replayElement

    this.build = function(cb) {
        replayElement = container.querySelector('video.' + options.selectors.replayClass)

        if (!replayElement)
            cb(new VideomailError('Invalid replay video class!', {
                explanation: 'No video with the class ' + options.selectors.replayClass + ' could be found.'
            }))
        else
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

    this.show = function() {
        replayElement.classList.remove('hide')
    }

    this.isShown = function() {
        return !replayElement.classList.contains('hide')
    }
}
