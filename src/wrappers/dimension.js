var numberIsInteger = require('number-is-integer')
var VideomailError = require('./../util/videomailError')

function getOuterWidth (element) {
  var rect = element.getBoundingClientRect()
  return rect.right - rect.left
}

function figureMinHeight (height, options) {
  if (options.hasDefinedHeight()) {
    if (!height) {
      height = options.video.height
    } else {
      height = Math.min(options.video.height, height)
    }
  }

  if (numberIsInteger(height) && height < 1) {
    throw VideomailError.create(
      'Got a video height less than 1 (' +
      height +
      ') while figuring out the minimum!'
    )
  }

    // just return it, can be "auto"
  return height
}

module.exports = {

  limitWidth: function (element, width) {
    var outerWidth = getOuterWidth(element)
    var limitedWidth = outerWidth > 0 && outerWidth < width ? outerWidth : width

    if (numberIsInteger(limitedWidth) && limitedWidth < 1) {
      throw VideomailError.create('Limited width cannot be less than 1!')
    } else {
      return limitedWidth
    }
  },

    // this is difficult to compute and is not entirely correct.
    // but good enough for now to ensure some stability.
  limitHeight: function (height) {
    if (numberIsInteger(height) && height < 1) {
      throw VideomailError.create('Passed limit-height argument cannot be less than 1!')
    } else {
      var limitedHeight = Math.min(
        height,
        document.body.scrollHeight,
        document.documentElement.clientHeight
      )

      if (limitedHeight < 1) {
        throw VideomailError.create('Limited height cannot be less than 1!')
      } else {
        return limitedHeight
      }
    }
  },

  calculateWidth: function (options) {
    var height = options.videoHeight || null
    var ratio = options.ratio || options.getRatio()

    height = figureMinHeight(height, options)

    if (options.responsive) { height = this.limitHeight(height) }

    if (numberIsInteger(height) && height < 1) {
      throw VideomailError.create('Height cannot be smaller than 1 when calculating width.')
    } else {
      var calculatedWidth = parseInt(height / ratio)

      if (calculatedWidth < 1) {
        throw VideomailError.create('Calculated width cannot be smaller than 1!')
      } else {
        return calculatedWidth
      }
    }
  },

  calculateHeight: function (element, options) {
    var width = options.videoWidth || null
    var height

    var ratio = options.ratio || options.getRatio()

    if (options.hasDefinedWidth()) { width = options.video.width }

    if (numberIsInteger(width) && width < 1) {
      throw VideomailError.create('Unable to calculate height when width is less than 1.')
    } else if (options.responsive) {
      width = this.limitWidth(element, width)
    }

    if (width) { height = parseInt(width * ratio) }

    if (numberIsInteger(height) && height < 1) {
      throw VideomailError.create('Just calculated a height less than 1 which is wrong.')
    } else {
      return figureMinHeight(height, options)
    }
  }
}
