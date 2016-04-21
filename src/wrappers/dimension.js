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
        var outerWidth   = getOuterWidth(element)
        var limitedWidth = outerWidth > 0 && outerWidth < width ? outerWidth : width

        if (limitedWidth < 1)
            throw new Error('Limited width cannot be less than 1!')
        else
            return limitedWidth
    },

    // this is difficult to compute and is not entirely correct.
    // but good enough for now to ensure some stability.
    limitHeight : function(height) {
        var limitedHeight = window.outerHeight < height ? window.outerHeight : height

        if (limitedHeight < 1)
            throw new Error('Limited height cannot be less than 1!')
        else
            return limitedHeight
    },

    calculateWidth: function(options) {
        var height = options.videoHeight || null,
            ratio  = options.ratio       || options.getRatio()

        height = figureMinHeight(height, options)

        if (options.responsive)
            height = this.limitHeight(height)

        if (height < 1) {
            throw new Error('Height cannot be smaller than 1 when calculating width.')
        } else {
            var calculatedWidth = parseInt(height / ratio)

            if (calculatedWidth < 1) {
                throw new Error('Calculated width cannot be smaller than 1!')
            } else {
                return calculatedWidth
            }
        }
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
