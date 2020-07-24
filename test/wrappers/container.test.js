import test from 'tape-catch'

import Container from './../../src/js/wrappers/container'

test('Container:', function(t) {
  t.test('can be instantiated', function(tt) {
    tt.plan(1)

    tt.doesNotThrow(function() {
      return new Container({
        video: {
          fps: 15
        },
        image: {}
      })
    })
  })
})
