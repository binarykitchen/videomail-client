import test from 'tape-catch'

import Notifier from './../../src/js/wrappers/visuals/notifier'

test('Notifier:', function(t) {
  t.test('can be instantiated', function(tt) {
    tt.plan(1)

    tt.doesNotThrow(function() {
      return new Notifier()
    })
  })
})
