// just a delegator for the container, to make it look less crowded:
// any pixel calculations goes here!

module.exports = function(container, options) {

    function getOuterWidth() {
        var rect = container.getBoundingClientRect()
        return rect.right - rect.left
    }

    function figureMinHeight(height) {
        if (options.hasDefinedHeight()) {
            if (!height)
                height = options.video.height
            else
                height = Math.min(options.video.height, height)
        }

        return height
    }

    this.limitWidth = function(width) {
        var outerWidth = getOuterWidth()
        return outerWidth < width ? outerWidth : width
    }

    // this is difficult to compute and is not entirely correct.
    // but good enough for now to ensure some stability.
    this.limitHeight = function(height) {
        return window.outerHeight < height ? window.outerHeight : height
    }

    this.calculateWidth = function(fnOptions) {
        fnOptions = fnOptions || {}

        var height = fnOptions.videoHeight || null,
            ratio  = fnOptions.ratio || options.getRatio()

        height = figureMinHeight(height)

        if (fnOptions.responsive)
            height = this.limitHeight(height)

        return parseInt(height / ratio)
    }

    this.calculateHeight = function(fnOptions) {
        fnOptions = fnOptions || {}

        var width = fnOptions.videoWidth || null,
            ratio = fnOptions.ratio || options.getRatio(),
            height

        if (options.hasDefinedWidth())
            width = options.video.width

        if (fnOptions.responsive)
            width = this.limitWidth(width)

        if (width)
            height = parseInt(width * ratio)

        return figureMinHeight(height)
    }
}
