var insertCss      = require('insert-css'),

    Visuals        = require('./visuals'),
    Buttons        = require('./buttons'),

    VideomailError = require('./../util/videomailError'),
    css            = require('./../assets/css/main.min.css.js')

module.exports = function(options) {

    var visuals     = new Visuals(this, options),
        buttons     = new Buttons(this, options),
        htmlElement = document.querySelector('html'),

        containerElement

    function prependDefaultCss() {
        insertCss(css, {prepend: true})
    }

    function buildChildren(cb) {
        containerElement.classList.add('videomail')

        visuals.build(cb)
        buttons.build(cb)
    }

    this.build = function(cb) {
        containerElement = document.getElementById(options.selectors.containerId)

        if (!containerElement)
            cb(new VideomailError('The container ID is invalid!', {
                explanation: 'No tag with the ID ' + options.selectors.containerId + ' could be found.'
            }))
        else {
            options.insertCss && prependDefaultCss()
            buildChildren(cb)
        }
    }

    this.querySelector = function(selector) {
        return containerElement.querySelector(selector)
    }

    this.beginWaiting = function() {
        htmlElement.classList && htmlElement.classList.add('wait')
    }

    this.endWaiting = function() {
        htmlElement.classList && htmlElement.classList.remove('wait')
    }

    this.appendChild = function(child) {
        containerElement.appendChild(child)
    }

    this.record         = visuals.record
    this.pause          = visuals.pause
    this.resume         = visuals.resume
    this.stop           = visuals.stop
    this.back           = visuals.back

    /*
    this.isReplayShown  = visuals.isShown
    this.hideReplay     = visuals.hideReplay
    this.showReplay     = visuals.show
    this.hideRecorder   = visuals.hide
    this.showRecorder   = visuals.showRecorder
    this.notify         = visuals.notify
    this.block          = visuals.block
    this.setExplanation = visuals.setExplanation
    this.hideNotifier   = visuals.hideNotifier
    this.showNotifier   = visuals.show
    this.unload         = visuals.unload
    this.isReady        = visuals.isReady
    this.isConnected    = visuals.isConnected
    this.isValid        = visuals.isValid
    this.isPaused       = visuals.isPaused
    */

    // todo: remove later because it exposes too much
    this.getRecorder = function() {
        return visuals.getRecorder()
    }
}
