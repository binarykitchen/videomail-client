// enhances options with useful functions we can reuse everywhere
import deepmerge from 'deepmerge'

export default {
  addFunctions: function (options) {
    var audioEnabled = options.audio && options.audio.enabled

    options.hasDefinedHeight = function () {
      return this.video.height && this.video.height !== 'auto'
    }

    options.hasDefinedWidth = function () {
      return this.video.width && this.video.width !== 'auto'
    }

    options.hasDefinedDimension = function () {
      return this.hasDefinedWidth() || this.hasDefinedHeight()
    }

    options.hasDefinedDimensions = function () {
      return this.hasDefinedWidth() && this.hasDefinedHeight()
    }

    options.getRatio = function () {
      var ratio = 1 // just a default one when no computations are possible

      if (this.hasDefinedDimensions()) {
        ratio = this.video.height / this.video.width

      // todo fix this, it's not really an option
      } else if (this.videoHeight && this.videoWidth) {
        ratio = this.videoHeight / this.videoWidth
      }

      return ratio
    }

    options.isAudioEnabled = function () {
      return audioEnabled
    }

    options.setAudioEnabled = function (enabled) {
      audioEnabled = enabled
    }

    options.isAutoPauseEnabled = function () {
      return this.enableAutoPause && this.enablePause
    }
  },

  merge: function (defaultOptions, newOptions) {
    const options = deepmerge(defaultOptions, newOptions, true)

    this.addFunctions(options)

    return options
  }
}
