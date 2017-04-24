const test = require('tape')
const parseMultipleJson = require('./../../src/util/parseMultipleJson')

test('parseMultipleJson:', function (t) {
  t.test('deals fine with weird parameters', function (tt) {
    tt.plan(3)

    tt.deepEqual(parseMultipleJson(null), [])
    tt.deepEqual(parseMultipleJson(''), [])
    tt.deepEqual(parseMultipleJson(123), [])
  })

  t.test('works with empty jsons', function (tt) {
    tt.plan(2)

    tt.deepEqual(parseMultipleJson('{}'), [{}])
    tt.deepEqual(parseMultipleJson('{}{}{}{}'), [{}, {}, {}, {}])
  })

  t.test('works with real jsons', function (tt) {
    tt.plan(2)

    tt.deepEqual(parseMultipleJson('{"a": 1, "b": "2", "c": null}'), [{a: 1, b: '2', c: null}])
    tt.deepEqual(parseMultipleJson('{"d": 100}{"e": 101}{"f": 102}{"g": 103}'), [{d: 100}, {e: 101}, {f: 102}, {g: 103}])
  })

  t.test('works with nested jsons', function (tt) {
    tt.plan(1)

    tt.deepEqual(parseMultipleJson('{"h": {"i": {"j": 200}}}{"k": 300}'), [{h: {i: {j: 200}}}, {k: 300}])
  })
})
