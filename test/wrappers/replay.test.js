import test from 'tape'

import Replay from './../../src/wrappers/visuals/replay'

test('Replay:', function (t) {
  t.test('can be instantiated', function (tt) {
    tt.plan(1)

    tt.doesNotThrow(function () {
      return new Replay(null, {
        debug: function () {}
      })
    })
  })
})
