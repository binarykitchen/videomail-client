const test = require('tape')

const Buttons = require('./../../src/wrappers/buttons')

test('Buttons:', function (t) {
  t.test('can be instantiated', function (tt) {
    tt.plan(1)

    tt.doesNotThrow(function () {
      return new Buttons()
    })
  })
})
