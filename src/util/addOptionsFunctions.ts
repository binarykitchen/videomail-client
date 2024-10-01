function addOptionsFunctions(options) {
  let audioEnabled = options.audio && options.audio.enabled;

  options.hasDefinedWidth = function () {
    return this.video.width && this.video.width !== "auto";
  };

  options.hasDefinedHeight = function () {
    return this.video.height && this.video.height !== "auto";
  };

  options.hasDefinedDimension = function () {
    return this.hasDefinedWidth() || this.hasDefinedHeight();
  };

  options.hasDefinedDimensions = function () {
    return this.hasDefinedWidth() && this.hasDefinedHeight();
  };

  options.getRatio = function () {
    let ratio = 1; // just a default one when no computations are possible

    // todo fix this, it's not really an option
    const hasVideoDimensions = this.videoHeight && this.videoWidth;

    if (this.hasDefinedDimensions()) {
      if (hasVideoDimensions) {
        // figure out first which one to pick
        if (this.videoHeight < this.video.height || this.videoWidth < this.video.width) {
          ratio = this.videoHeight / this.videoWidth;
        } else {
          ratio = this.video.height / this.video.width;
        }
      } else {
        ratio = this.video.height / this.video.width;
      }
    } else if (hasVideoDimensions) {
      ratio = this.videoHeight / this.videoWidth;
    }

    return ratio;
  };

  options.isAudioEnabled = function () {
    return audioEnabled;
  };

  options.setAudioEnabled = function (enabled) {
    audioEnabled = enabled;
  };

  options.isAutoPauseEnabled = function () {
    return this.enableAutoPause && this.enablePause;
  };

  return options;
}

export default addOptionsFunctions;
