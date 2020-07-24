import test from 'tape-catch'

import Buttons from './../../src/js/wrappers/buttons'

test('Buttons:', function(t) {
  t.test('can be instantiated', function(tt) {
    tt.plan(1)

    tt.doesNotThrow(function() {
      return new Buttons(null, {
        debug: function() {}
      })
    })
  })
})
