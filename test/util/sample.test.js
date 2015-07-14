var test    = require('tape'),

    Sample  = require('./../../src/util/items/sample')

test('Audio Sample:', function(t) {

    t.test('arguments', function(tt) {

        tt.test('missing array', function(tt) {
            tt.plan(1)

            tt.throws(function() {
                new Sample()
            })
        })

        tt.test('invalid array', function(tt) {
            tt.plan(5)

            tt.throws(function() {
                new Sample('bad parameter')
            })

            tt.throws(function() {
                new Sample(['bad array'])
            })

            tt.throws(function() {
                new Sample(new Int32Array(16))
            })

            tt.throws(function() {
                new Sample(new Float64Array(4))
            })

            tt.throws(function() {
                new Sample(new ArrayBuffer(8))
            })
        })

        tt.test('one valid array', function(tt) {
            tt.plan(1)

            tt.doesNotThrow(function() {
                new Sample(new Float32Array(2))
            })
        })
    })

    t.test('toBuffer', function(tt) {

        tt.test('buffer from empty array has correct contents', function(tt) {
            tt.plan(3)

            var sample = new Sample(new Float32Array()),
                buffer = sample.toBuffer()

            tt.ok(Buffer.isBuffer(buffer))
            tt.equal(buffer.length, 0)
            tt.equal(buffer.toString(), '')
        })

        tt.test('buffer from a Float32array with a length of 16 but full of zeroes has correct buffer contents', function(tt) {
            tt.plan(3)

            var sample = new Sample(new Float32Array(16)),
                buffer = sample.toBuffer()

            tt.ok(Buffer.isBuffer(buffer))
            tt.equal(buffer.length, 32)
            tt.equal(buffer.toString(), new Array(33).join('\x00'))
        })

        tt.test('buffer from a Float32array filled with [1, 0] has correct endianess and does not exceed the limit', function(tt) {
            tt.plan(5)

            var sample = new Sample(new Float32Array([1, 0, 2])),
                buffer = sample.toBuffer()

            tt.ok(Buffer.isBuffer(buffer))
            tt.equal(buffer.length, 6)
            tt.equal(buffer.readInt16LE(0), 32767)
            tt.equal(buffer.readInt16LE(2), 0)
            tt.equal(buffer.readInt16LE(4), 32767)
        })

        tt.test('buffer from a Float32array filled with floats less than 1 has correct buffer contents', function(tt) {
            tt.plan(5)

            var sample = new Sample(new Float32Array([0.1, 0.2, 0.3])),
                buffer = sample.toBuffer()

            tt.ok(Buffer.isBuffer(buffer))
            tt.equal(buffer.length, 6)
            tt.equal(buffer.readInt16LE(0), 6553)
            tt.equal(buffer.readInt16LE(2), 13106)
            tt.equal(buffer.readInt16LE(4), 19660)
        })
    })
})
