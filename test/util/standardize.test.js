import test from 'tape-catch'

import standardize from './../../src/js/util/standardize'

const root = this

test('standardize:', function (t) {
  t.test('can be called', function (tt) {
    tt.plan(1)

    tt.doesNotThrow(function () {
      standardize(this, root)
    })
  })
})
