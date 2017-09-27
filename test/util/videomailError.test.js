import test from 'tape-catch'

import VideomailError from './../../src/util/videomailError'

const fakeOptions = {
  debug: function () {}
}

test('Videomail Error:', function (t) {
  t.test('arguments', function (tt) {
    tt.test('no arguments', function (tt) {
      tt.plan(5)

      const err = new VideomailError()

      tt.ok(err instanceof VideomailError)
      tt.ok(err instanceof Error)

      tt.equal(err.toString(), 'Videomail Error')
      tt.equal(err.message, '')
      tt.equal(err.explanation, undefined)
    })

    tt.test('all undefined', function (tt) {
      tt.plan(3)

      const err = new VideomailError(undefined, {
        explanation: undefined
      }, fakeOptions)

      tt.equal(err.toString(), 'Videomail Error')
      tt.equal(err.message, '')
      tt.equal(err.explanation, undefined)
    })

    tt.test('one message', function (tt) {
      tt.plan(3)

      const err = new VideomailError('one message', fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: one message')
      tt.equal(err.message, 'one message')
      tt.equal(err.explanation, undefined)
    })

    tt.test('and an explanation', function (tt) {
      tt.plan(3)

      const err = new VideomailError('one message', {
        explanation: 'and an explanation'
      }, fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: one message')
      tt.equal(err.message, 'one message')
      tt.equal(err.explanation, 'and an explanation')
    })
  })

  t.test('static create(err)', function (tt) {
    tt.test('null', function (tt) {
      tt.plan(3)

      const err = VideomailError.create(undefined, undefined, {
        debug: function () {} // so that it wont pollute output during tests
      })

      tt.equal(err.toString(), 'Videomail Error')
      tt.equal(err.message, '')
      tt.equal(err.explanation, undefined)
    })

    tt.test('no arguments', function (tt) {
      tt.plan(3)

      const err = VideomailError.create(new Error(), fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: Error')
      tt.equal(err.message, 'Error')
      tt.equal(err.explanation, undefined)
    })

    tt.test('undefined message', function (tt) {
      tt.plan(3)

      const err = VideomailError.create(new Error(undefined), fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: Error')
      tt.equal(err.message, 'Error')
      tt.equal(err.explanation, undefined)
    })

    tt.test('bad integer', function (tt) {
      tt.plan(3)

      const err = VideomailError.create(123, fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: 123')
      tt.equal(err.message, 123)
      tt.equal(err.explanation, undefined)
    })

    tt.test('one message', function (tt) {
      tt.plan(3)

      const err = VideomailError.create('one message', fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: one message')
      tt.equal(err.message, 'one message')
      tt.equal(err.explanation, undefined)
    })

    tt.test('deals with VideomailError instance', function (tt) {
      tt.plan(3)

      const err = VideomailError.create(new VideomailError('i am already instantiated', fakeOptions))

      tt.equal(err.toString(), 'Videomail Error: i am already instantiated')
      tt.equal(err.message, 'i am already instantiated')
      tt.equal(err.explanation, undefined)
    })

    tt.test('PERMISSION_DENIED', function (tt) {
      tt.plan(6)

      const err1 = VideomailError.create({
        code: 1,
        PERMISSION_DENIED: 1
      }, fakeOptions)

      tt.equal(err1.toString(), 'Videomail Error: Permission denied')
      tt.equal(err1.message, 'Permission denied')
      tt.equal(err1.explanation, 'Cannot access your webcam. This can have two reasons:<br/>a) you blocked access to webcam; or<br/>b) your webcam is already in use.')

      const err2 = VideomailError.create({
        code: 2,
        PERMISSION_DENIED: 2
      }, fakeOptions)

      tt.equal(err2.toString(), 'Videomail Error')
      tt.equal(err2.message, '')
      tt.equal(err2.explanation, '- 2<br/>- 2')
    })

    tt.test('NOT_ALLOWED_ERROR', function (tt) {
      tt.plan(3)

      const err1 = VideomailError.create(VideomailError.NOT_ALLOWED_ERROR, fakeOptions)

      tt.equal(err1.toString(), 'Videomail Error: Permission denied')
      tt.equal(err1.message, 'Permission denied')
      tt.equal(err1.explanation, 'Cannot access your webcam. This can have two reasons:<br/>a) you blocked access to webcam; or<br/>b) your webcam is already in use.')
    })

    tt.test('with bad name in object', function (tt) {
      tt.plan(3)

      const err = VideomailError.create({
        name: 1
      }, fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: 1')
      tt.equal(err.message, 1)
      tt.equal(err.explanation, undefined)
    })

    tt.test('with NO_DEVICES_FOUND as name in object', function (tt) {
      tt.plan(3)

      const err = VideomailError.create({
        name: 'NO_DEVICES_FOUND'
      }, fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: No webcam found')
      tt.equal(err.message, 'No webcam found')
      tt.equal(err.explanation, 'Your browser cannot find a webcam attached to your machine.')
    })

    tt.test('with PermissionDeniedError as name in object', function (tt) {
      tt.plan(3)

      const err = VideomailError.create({
        name: 'PermissionDeniedError'
      }, fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: Permission denied')
      tt.equal(err.message, 'Permission denied')
      tt.equal(err.explanation, 'Cannot access your webcam. This can have two reasons:<br/>a) you blocked access to webcam; or<br/>b) your webcam is already in use.')
    })

    tt.test('with HARDWARE_UNAVAILABLE as name in object', function (tt) {
      tt.plan(3)

      const err = VideomailError.create({
        name: 'HARDWARE_UNAVAILABLE'
      }, fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: Webcam is unavailable')
      tt.equal(err.message, 'Webcam is unavailable')
      tt.equal(err.explanation, 'Maybe it is already busy in another window? Or you have to allow access above?')
    })

    tt.test('with "Not connected" as name in object', function (tt) {
      tt.plan(3)

      const err = VideomailError.create({
        name: 'Not connected'
      }, fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: Unable to transfer data')
      tt.equal(err.message, 'Unable to transfer data')
      tt.equal(err.explanation, 'Unable to maintain a websocket to the server. Either server or your connection is down. Trying to reconnect every two seconds …')
    })

    tt.test('with "Not connected" as argument', function (tt) {
      tt.plan(3)

      const err = VideomailError.create('Not connected', fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: Unable to transfer data')
      tt.equal(err.message, 'Unable to transfer data')
      tt.equal(err.explanation, 'Unable to maintain a websocket to the server. Either server or your connection is down. Trying to reconnect every two seconds …')
    })

    tt.test('with NO_VIDEO_FEED as name in object', function (tt) {
      tt.plan(3)

      const err = VideomailError.create({
        name: 'NO_VIDEO_FEED'
      }, fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: No video feed found!')
      tt.equal(err.message, 'No video feed found!')
      tt.equal(err.explanation, 'Your webcam is already used in another browser.')
    })

    tt.test('with "Starting video failed" as name in object', function (tt) {
      tt.plan(3)

      const err = VideomailError.create({
        name: 'Starting video failed'
      }, fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: Starting video failed')
      tt.equal(err.message, 'Starting video failed')
      tt.equal(err.explanation, 'Most likely this happens when the webam is already active in another browser.')
    })

    tt.test('with DevicesNotFoundError as name in object', function (tt) {
      tt.plan(3)

      const err = VideomailError.create({
        name: 'DevicesNotFoundError'
      }, fakeOptions)

      tt.equal(err.toString(), 'Videomail Error: No available webcam could be found')
      tt.equal(err.message, 'No available webcam could be found')
      tt.equal(err.explanation, 'Looks like you do not have any webcam attached to your machine; or the one you plugged in is already used.')
    })
  })
})
