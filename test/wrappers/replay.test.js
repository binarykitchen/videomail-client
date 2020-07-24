import test from 'tape-catch'

import Replay from './../../src/js/wrappers/visuals/replay'

test('Replay:', function(t) {
  t.test('can be instantiated', function(tt) {
    tt.plan(1)

    tt.doesNotThrow(function() {
      return new Replay(null, {
        debug: function() {}
      })
    })
  })
})
