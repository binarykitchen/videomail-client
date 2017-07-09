import test from 'tape'

import Visuals from './../../src/wrappers/visuals'

test('Visuals:', function (t) {
  t.test('can be instantiated', function (tt) {
    tt.plan(1)

    tt.doesNotThrow(function () {
      return new Visuals(null, {
        video: {
          fps: 15
        }
      })
    })
  })
})
