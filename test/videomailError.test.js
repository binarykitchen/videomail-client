var test            = require('tape'),

    VideomailError  = require('./../src/util/videomailError')

test('Videomail Error:', function(t) {

    t.test('arguments', function(tt) {

        tt.test('no arguments', function(tt) {
            tt.plan(5)

            var err = new VideomailError()

            tt.ok(err instanceof VideomailError)
            tt.ok(err instanceof Error)

            tt.equal(err.toString(),    'Videomail Error')
            tt.equal(err.message,       '')
            tt.equal(err.explanation,   undefined)
        })

        tt.test('all undefined', function(tt) {
            tt.plan(3)

            var err = new VideomailError(undefined, {
                explanation: undefined
            })

            tt.equal(err.toString(),    'Videomail Error')
            tt.equal(err.message,       '')
            tt.equal(err.explanation,   undefined)
        })

        tt.test('one message', function(tt) {
            tt.plan(3)

            var err = new VideomailError('one message')

            tt.equal(err.toString(),    'Videomail Error: one message')
            tt.equal(err.message,       'one message')
            tt.equal(err.explanation,   undefined)
        })

        tt.test('and an explanation', function(tt) {
            tt.plan(3)

            var err = new VideomailError('one message', {
                explanation: 'and an explanation'
            })

            tt.equal(err.toString(),    'Videomail Error: one message')
            tt.equal(err.message,       'one message')
            tt.equal(err.explanation,   'and an explanation')
        })
    })

    /* TODO: continue after completing tests of browser.js
    t.test('static create(err)', function(tt) {

        tt.test('no arguments', function(tt) {
            tt.plan(3)

            var err = VideomailError.create(new Error())

            tt.equal(err.toString(),    'Videomail Error')
            tt.equal(err.message,       '')
            tt.equal(err.explanation,   undefined)
        })

        tt.test('undefined message', function(tt) {
            tt.plan(3)

            var err = VideomailError.create(new Error(undefined))

            tt.equal(err.toString(),    'Videomail Error')
            tt.equal(err.message,       '')
            tt.equal(err.explanation,   undefined)
        })

        tt.test('one message', function(tt) {
            tt.plan(3)

            var err = VideomailError.create('one message')

            tt.equal(err.toString(),    'Videomail Error: one message')
            tt.equal(err.message,       'one message')
            tt.equal(err.explanation,   undefined)
        })
    })
    */
})
