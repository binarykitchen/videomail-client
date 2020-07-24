import test from 'tape-catch'

import Visuals from './../../src/js/wrappers/visuals'

test('Visuals:', function(t) {
  t.test('can be instantiated', function(tt) {
    tt.plan(1)

    tt.doesNotThrow(function() {
      return new Visuals(null, {
        video: {
          fps: 15
        },
        image: {}
      })
    })
  })
})
