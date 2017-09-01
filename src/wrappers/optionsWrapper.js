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

      // todo fix this, it's not really an option
      const hasVideoDimensions = this.videoHeight && this.videoWidth

      if (this.hasDefinedDimensions()) {
        if (hasVideoDimensions) {
          // figure out first which one to pick
          if (this.videoHeight < this.video.height) {
            ratio = this.videoHeight / this.videoWidth
          } else {
            ratio = this.video.height / this.video.width
          }
        } else {
          ratio = this.video.height / this.video.width
        }
      } else if (hasVideoDimensions) {
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

  // not very elegant but works! and if you here are reading this, and
  // start to doubt, rest assured, it's solid and run thousand times over
  // and over again each day. and other large sites out there have their own
  // tech debts. hope i have shattered your illusion on perfection?
  merge: function (defaultOptions, newOptions) {
    const options = deepmerge(defaultOptions, newOptions, true)

    this.addFunctions(options)

    return options
  }
}
