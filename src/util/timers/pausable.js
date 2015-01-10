// parts taken from http://stackoverflow.com/questions/3969475/javascript-pause-settimeout

module.exports = function(delay, cb) {

    var remaining = delay,

        timeoutId,
        start

    this.stop = function() {
        clearTimeout(timeoutId)
    }

    this.pause = function() {
        this.stop()
        remaining -= new Date() - start
    }

    this.resume = function() {
        start   = new Date()
        timeoutId = setTimeout(cb, remaining)
    }

    this.resume()
}
