import test from 'tape-catch'

import UserMedia from './../../src/js/wrappers/visuals/userMedia'

test('UserMedia:', function (t) {
  t.test('can be instantiated', function (tt) {
    tt.plan(1)

    tt.doesNotThrow(function () {
      return new UserMedia()
    })
  })
})
