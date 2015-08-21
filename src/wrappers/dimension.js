function getOuterWidth(element) {
    var rect = element.getBoundingClientRect()
    return rect.right - rect.left
}

function figureMinHeight(height, options) {
    if (options.hasDefinedHeight()) {
        if (!height)
            height = options.video.height
        else
            height = Math.min(options.video.height, height)
    }

    return height
}

module.exports = {


    limitWidth: function(element, width) {
        var outerWidth = getOuterWidth(element)
        return outerWidth < width ? outerWidth : width
    },

    // this is difficult to compute and is not entirely correct.
    // but good enough for now to ensure some stability.
    limitHeight : function(height) {
        return window.outerHeight < height ? window.outerHeight : height
    },

    calculateWidth: function(options) {
        var height = options.videoHeight || null,
            ratio  = options.ratio       || options.getRatio()

        height = figureMinHeight(height, options)

        if (options.responsive)
            height = this.limitHeight(height)

        return parseInt(height / ratio)
    },

    calculateHeight: function(element, options) {
        var width = options.videoWidth || null,
            ratio = options.ratio      || options.getRatio(),
            height

        if (options.hasDefinedWidth())
            width = options.video.width

        if (options.responsive)
            width = this.limitWidth(element, width)

        if (width)
            height = parseInt(width * ratio)

        return figureMinHeight(height, options)
    }
}
