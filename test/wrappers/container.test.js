const test = require('tape')

const Container = require('./../../src/wrappers/container')

test('Container:', function (t) {
  t.test('can be instantiated', function (tt) {
    tt.plan(1)

    tt.doesNotThrow(function () {
      return new Container({
        video: {
          fps: 15
        }
      })
    })
  })
})
