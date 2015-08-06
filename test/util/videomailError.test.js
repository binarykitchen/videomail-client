var test            = require('tape'),

    VideomailError  = require('./../../src/util/videomailError')

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

    t.test('static create(err)', function(tt) {

        tt.test('null', function(tt) {
            tt.plan(3)

            var err = VideomailError.create()

            tt.equal(err.toString(),    'Videomail Error')
            tt.equal(err.message,       '')
            tt.equal(err.explanation,   undefined)
        })

        tt.test('no arguments', function(tt) {
            tt.plan(3)

            var err = VideomailError.create(new Error())

            tt.equal(err.toString(),    'Videomail Error: Error')
            tt.equal(err.message,       'Error')
            tt.equal(err.explanation,   undefined)
        })

        tt.test('undefined message', function(tt) {
            tt.plan(3)

            var err = VideomailError.create(new Error(undefined))

            tt.equal(err.toString(),    'Videomail Error: Error')
            tt.equal(err.message,       'Error')
            tt.equal(err.explanation,   undefined)
        })

        tt.test('bad integer', function(tt) {
            tt.plan(3)

            var err = VideomailError.create(123)

            tt.equal(err.toString(),    'Videomail Error: 123')
            tt.equal(err.message,       123)
            tt.equal(err.explanation,   undefined)
        })

        tt.test('one message', function(tt) {
            tt.plan(3)

            var err = VideomailError.create('one message')

            tt.equal(err.toString(),    'Videomail Error: one message')
            tt.equal(err.message,       'one message')
            tt.equal(err.explanation,   undefined)
        })

        tt.test('deals with VideomailError instance', function(tt) {
            tt.plan(3)

            var err = VideomailError.create(new VideomailError('i am already instantiated'))

            tt.equal(err.toString(),    'Videomail Error: i am already instantiated')
            tt.equal(err.message,       'i am already instantiated')
            tt.equal(err.explanation,   undefined)
        })

        tt.test('PERMISSION_DENIED', function(tt) {
            tt.plan(6)

            var err = VideomailError.create({
                code:               1,
                PERMISSION_DENIED:  1
            })

            tt.equal(err.toString(),    'Videomail Error: Permission denied!')
            tt.equal(err.message,       'Permission denied!')
            tt.equal(err.explanation,   undefined)

            err = VideomailError.create({
                code:               2,
                PERMISSION_DENIED:  2
            })

            tt.equal(err.toString(),    'Videomail Error')
            tt.equal(err.message,       '')
            tt.equal(err.explanation,   undefined)
        })

        tt.test('with bad name in object', function(tt) {
            tt.plan(3)

            var err = VideomailError.create({
                name: 1
            })

            tt.equal(err.toString(),    'Videomail Error: 1')
            tt.equal(err.message,       1)
            tt.equal(err.explanation,   undefined)
        })

        tt.test('with NO_DEVICES_FOUND as name in object', function(tt) {
            tt.plan(3)

            var err = VideomailError.create({
                name: 'NO_DEVICES_FOUND'
            })

            tt.equal(err.toString(),    'Videomail Error: No webcam found')
            tt.equal(err.message,       'No webcam found')
            tt.equal(err.explanation,   'Your browser cannot find a webcam attached to your machine.')
        })

        tt.test('with PermissionDeniedError as name in object', function(tt) {
            tt.plan(3)

            var err = VideomailError.create({
                name: 'PermissionDeniedError'
            })

            tt.equal(err.toString(),    'Videomail Error: Permission denied!')
            tt.equal(err.message,       'Permission denied!')
            tt.equal(err.explanation,   undefined)
        })

        tt.test('with HARDWARE_UNAVAILABLE as name in object', function(tt) {
            tt.plan(3)

            var err = VideomailError.create({
                name: 'HARDWARE_UNAVAILABLE'
            })

            tt.equal(err.toString(),    'Videomail Error: Webcam is unavailable!')
            tt.equal(err.message,       'Webcam is unavailable!')
            tt.equal(err.explanation,   'Maybe it is already busy in another window?')
        })

        tt.test('with "Not connected" as name in object', function(tt) {
            tt.plan(3)

            var err = VideomailError.create({
                name: 'Not connected'
            })

            tt.equal(err.toString(),    'Videomail Error: Unable to transfer data')
            tt.equal(err.message,       'Unable to transfer data')
            tt.equal(err.explanation,   'Unable to maintain a binary websocket to the server. Either the server or your connection is down. Trying to reconnect every two seconds …')
        })

        tt.test('with "Not connected" as argument', function(tt) {
            tt.plan(3)

            var err = VideomailError.create('Not connected')

            tt.equal(err.toString(),    'Videomail Error: Unable to transfer data')
            tt.equal(err.message,       'Unable to transfer data')
            tt.equal(err.explanation,   'Unable to maintain a binary websocket to the server. Either the server or your connection is down. Trying to reconnect every two seconds …')
        })

        tt.test('with NO_VIDEO_FEED as name in object', function(tt) {
            tt.plan(3)

            var err = VideomailError.create({
                name: 'NO_VIDEO_FEED'
            })

            tt.equal(err.toString(),    'Videomail Error: No video feed found!')
            tt.equal(err.message,       'No video feed found!')
            tt.equal(err.explanation,   'Your webcam is already used in another browser.')
        })

        tt.test('with "Starting video failed" as name in object', function(tt) {
            tt.plan(3)

            var err = VideomailError.create({
                name: 'Starting video failed'
            })

            tt.equal(err.toString(),    'Videomail Error: Starting video failed')
            tt.equal(err.message,       'Starting video failed')
            tt.equal(err.explanation,   'Most likely this happens when the webam is already active in another browser.')
        })

        tt.test('with DevicesNotFoundError as name in object', function(tt) {
            tt.plan(3)

            var err = VideomailError.create({
                name: 'DevicesNotFoundError'
            })

            tt.equal(err.toString(),    'Videomail Error: Webcam is unavailable')
            tt.equal(err.message,       'Webcam is unavailable')
            tt.equal(err.explanation,   'Looks like another program has control over your webcam? Close it and come back.')
        })
    })
})
