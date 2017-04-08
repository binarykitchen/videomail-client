// enhances options with useful functions we can reuse everywhere

module.exports = {
  addFunctions: function (options) {
    var audioEnabled = options.audio && options.audio.enabled

    options.hasDefinedHeight = function () {
      return options.video.height && options.video.height !== 'auto'
    }

    options.hasDefinedWidth = function () {
      return options.video.width && options.video.width !== 'auto'
    }

    options.hasDefinedDimension = function () {
      return options.hasDefinedWidth() || options.hasDefinedHeight()
    }

    options.hasDefinedDimensions = function () {
      return options.hasDefinedWidth() && options.hasDefinedHeight()
    }

    options.getRatio = function () {
      var ratio = 1 // just a default one when no computations are possible

      if (options.hasDefinedDimensions()) { ratio = options.video.height / options.video.width }

      return ratio
    }

    options.isAudioEnabled = function () {
      return audioEnabled
    }

    options.setAudioEnabled = function (enabled) {
      audioEnabled = enabled
    }

    options.isAutoPauseEnabled = function () {
      return options.enableAutoPause && options.enablePause
    }
  }
}
