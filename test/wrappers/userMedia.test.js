import test from 'tape'

import UserMedia from './../../src/wrappers/visuals/userMedia'

test('UserMedia:', function (t) {
  t.test('can be instantiated', function (tt) {
    tt.plan(1)

    tt.doesNotThrow(function () {
      return new UserMedia()
    })
  })
})
