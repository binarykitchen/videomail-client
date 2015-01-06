var toBuffer = require('typedarray-to-buffer'),

    verifiedImageType

module.exports = function(canvas, options) {

    var quality = parseFloat(options.image.quality)

    function verifyImageType() {
        var canvas      = document.createElement('canvas'),
            imageType   = 'image/' + options.image.types[0],
            uri

        canvas.width = canvas.height = 1

        try {
            uri = canvas.toDataURL && canvas.toDataURL(imageType)
        } catch (exc) {
            // Can happen when a spider is coming. Just be robust here and continue.
            options.debug && options.logger.debug('Failed to call toDataURL() on canvas')
        }

        if (!uri || !uri.match(imageType)) {
            imageType = 'image/' + options.image.types[1]

            options.debug && options.logger.debug('Using images of type %s instead', imageType)
        }

        return imageType
    }

    // only run for the first time this constructor is called and cache result
    // for the next calls
    if (!verifiedImageType)
        verifiedImageType = verifyImageType()

    this.toBuffer = function() {

        // this method is proven to be fast, see
        // http://jsperf.com/data-uri-to-buffer-performance/3

        var uri   = canvas.toDataURL(verifiedImageType, quality),
            bytes = atob(uri.split(',')[1]),
            arr   = new Uint8Array(bytes.length)

        // http://mrale.ph/blog/2014/12/24/array-length-caching.html
        for (var i = 0, l = bytes.length; i < l; i++) {
            arr[i] = bytes.charCodeAt(i)
        }

        return toBuffer(arr)
    }
}
