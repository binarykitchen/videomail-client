module.exports = function(container) {

    this.beginWaiting   = container.beginWaiting
    this.endWaiting     = container.endWaiting
    this.notify         = container.notify
    this.getRecorder    = container.getRecorder
    this.block          = container.block
    this.setExplanation = container.setExplanation
    this.hideNotifier   = container.hideNotifier
    this.showNotifier   = container.showNotifier
    this.hideReplay     = container.hideReplay
    this.hideRecorder   = container.hideRecorder
    this.showReplay     = container.showReplay
    this.showRecorder   = container.showRecorder
    this.reset          = container.reset
    this.stopRecording  = container.stopRecording
    this.pause          = container.pause
    this.record         = container.record
    this.resume         = container.resume
    this.back           = container.back
    this.isReady        = container.isReady
    this.unload         = container.unload
    this.isReplayShown  = container.isReplayShown
    this.isConnected    = container.isConnected
    this.isValid        = container.isValid
    this.isPaused       = container.isPaused
}
