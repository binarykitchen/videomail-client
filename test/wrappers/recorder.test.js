import test from 'tape'

import Recorder from './../../src/wrappers/visuals/recorder'

test('Recorder:', function (t) {
  t.test('can be instantiated', function (tt) {
    tt.plan(1)

    tt.doesNotThrow(function () {
      return new Recorder(null, null, {
        video: {
          fps: 15
        }
      })
    })
  })
})
