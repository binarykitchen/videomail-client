import test from 'tape-catch'

import CollectLogger from './../../src/util/collectLogger'

test('CollectLogger:', function (t) {
  t.test('can be instantiated', function (tt) {
    tt.plan(1)

    tt.doesNotThrow(function () {
      return new CollectLogger()
    })
  })
})
