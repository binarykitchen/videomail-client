import test from 'tape'

import Form from './../../src/wrappers/form'

test('Form:', function (t) {
  t.test('can be instantiated', function (tt) {
    tt.plan(1)

    tt.doesNotThrow(function () {
      return new Form()
    })
  })
})
