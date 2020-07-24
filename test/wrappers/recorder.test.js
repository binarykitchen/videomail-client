import test from 'tape-catch'

import Recorder from './../../src/js/wrappers/visuals/recorder'

test('Recorder:', function(t) {
  t.test('can be instantiated', function(tt) {
    tt.plan(1)

    tt.doesNotThrow(function() {
      return new Recorder(null, null, {
        video: {
          fps: 15
        },
        image: {}
      })
    })
  })
})
