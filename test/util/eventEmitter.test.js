const test = require('tape')
const EventEmitter = require('./../../src/util/eventEmitter')

test('EventEmitter:', function (t) {
  t.test('can be instantiated', function (tt) {
    tt.plan(1)

    tt.doesNotThrow(function () {
      return new EventEmitter()
    })
  })
})
