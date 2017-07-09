import test from 'tape'
import Resource from './../../src/resource'

test('Resource:', function (t) {
  t.test('can be instantiated', function (tt) {
    tt.plan(1)

    tt.doesNotThrow(function () {
      return new Resource()
    })
  })
})
