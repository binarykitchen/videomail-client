/*
var VideomailError = require('./util/videomailError')

module.exports = function() {

    function clear(container) {
        while (container.hasChildNodes()) {
            container.removeChild(container.firstChild)
        }
    }

    function createVideoDiv() {
        return document.createElement('div')
    }

    this.construct = function(containerId, localOptions, cb) {
        var container = document.getElementById(containerId),
            err

        if (!err && !container) {
            err = new VideomailError('Invalid container ID!', {
                explanation: 'No HTML tag with the ID ' + containerId + ' could be found.'
            })
        }

        if (err) {
            cb(err)
        } else {
            clear(container)

            createVideoDiv()

            // continue from here, generate html seen on home.jade

            cb()
        }
    }
}
*/
