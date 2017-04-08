const test = require('tape')

const standardize = require('./../../src/util/standardize')
const root = this

test('standardize:', function (t) {
  t.test('can be called', function (tt) {
    tt.plan(1)

    tt.doesNotThrow(function () {
      standardize(this, root)
    })
  })
})
