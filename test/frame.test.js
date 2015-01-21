var test   = require('tape'),
    Canvas = require('canvas'),
    atob   = require('atob'),

    Frame  = require('./../src/util/items/frame')

// Add missing function because atob only exists on the browser
Frame.atob = atob

function generateCanvas(width, height) {
    width  = width  || 1
    height = height || 1

    return new Canvas(width, height)
}

test('frame:', function(t) {

    t.test('arguments', function(tt) {

        tt.test('missing options', function(tt) {
            tt.plan(1)

            tt.throws(function() {
                new Frame()
            })
        })

        tt.test('missing image type', function(tt) {
            tt.plan(3)

            tt.throws(function() {
                new Frame(null, {
                    image: {}
                })
            })

            tt.throws(function() {
                new Frame(null, {
                    image: {
                        types: null
                    }
                })
            })

            tt.throws(function() {
                new Frame(generateCanvas(), {
                    image: {
                        types: []
                    }
                })
            })
        })

        tt.test('invalid image type', function(tt) {
            tt.plan(2)

            new Frame(generateCanvas(), {
                image: {
                    types: ['bad image type']
                }
            })
            .getImageType(function(err, imageType) {
                tt.equal(err, null)
                tt.equal(imageType, undefined)
            })
        })

        tt.test('too many image types', function(tt) {
            tt.plan(1)

            tt.throws(function() {
                new Frame(generateCanvas(), {
                    image: {
                        types: ['too', 'many', 'image', 'types']
                    }
                })
            })
        })

        tt.test('one valid image type', function(tt) {
            tt.plan(3)

            var frame

            tt.doesNotThrow(function() {
                frame = new Frame(generateCanvas(), {
                    image: {
                        types: ['png']
                    }
                })
            })

            frame.getImageType(function(err, imageType) {
                tt.equal(err, null)
                tt.equal(imageType, 'image/png')
            })
        })

        tt.test('first image type is invalid, second image type is valid', function(tt) {
            tt.plan(2)

            var frame = new Frame(generateCanvas(), {
                image: {
                    types: ['bad image type', 'png']
                }
            })

            frame.getImageType(function(err, imageType) {
                tt.equal(err, null)
                tt.equal(imageType, 'image/png')
            })
        })
    })

    t.test('toBuffer', function(tt) {

        tt.test('fails without valid image type', function(tt) {
            tt.plan(1)

            var frame = new Frame(generateCanvas(), {
                image: {
                    types: ['bad image type']
                }
            })

            var buffer = frame.toBuffer()
            tt.equal(buffer, undefined)
        })

        tt.test('crashes when canvas is bad', function(tt) {
            tt.plan(2)

            var frame = new Frame(generateCanvas(-1, -1), {
                image: {
                    types: ['png']
                }
            })

            frame.toBuffer(function(err, buffer) {
                tt.equal(err.toString(), 'Error: invalid value (typically too big) for the size of the input (surface, pattern, etc.)')
                tt.equal(buffer, undefined)
            })
        })

        tt.test('buffer from small canvas has correct contents', function(tt) {
            tt.plan(3)

            var frame = new Frame(generateCanvas(), {
                image: {
                    types: ['png']
                }
            })

            frame.toBuffer(function(err, buffer) {
                tt.equal(err, null)
                tt.equal(buffer.length, 88)
                tt.equal(buffer.toString().indexOf('PNG') > -1, true)
            })
        })

        tt.test('buffer from large canvas has correct contents', function(tt) {
            tt.plan(3)

            var frame = new Frame(generateCanvas(1000, 1000), {
                image: {
                    types: ['png']
                }
            })

            frame.toBuffer(function(err, buffer) {
                tt.equal(err, null)
                tt.equal(buffer.length, 3975)
                tt.equal(buffer.toString().indexOf('PNG') > -1, true)
            })
        })
    })
})
