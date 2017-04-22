const test = require('tape')
const pretty = require('./../../src/util/pretty')

test('pretty:', function (t) {
  t.test('prettifies undefined fine', function (tt) {
    tt.plan(1)

    tt.equal(pretty(), 'undefined')
  })

  t.test('prettifies null fine', function (tt) {
    tt.plan(1)

    tt.equal(pretty(null), 'null')
  })

  t.test('prettifies a string fine', function (tt) {
    tt.plan(1)

    tt.equal(pretty('sorry'), 'sorry')
  })

  t.test('prettifies a true boolean fine', function (tt) {
    tt.plan(1)

    tt.equal(pretty(true), 'true')
  })

  t.test('prettifies a false boolean fine', function (tt) {
    tt.plan(1)

    tt.equal(pretty(false), 'false')
  })

  t.test('prettifies an object fine', function (tt) {
    tt.plan(1)

    tt.equal(pretty({
      i: 'am',
      just: 'another',
      stupid: 'object',
      2: 3,
      4: null
    }), '- 3<br/>- am<br/>- another<br/>- object')
  })

  t.test('prettifies an array fine', function (tt) {
    tt.plan(1)

    tt.equal(pretty([
      'i', 'am', 'just', 'another', 'array', null, 1, 2
    ]), '- i<br/>- am<br/>- just<br/>- another<br/>- array<br/>- 1<br/>- 2')
  })

  t.test('prettifies can exclude object keys', function (tt) {
    tt.plan(4)

    tt.equal(pretty({ignoreMe: 'ignore me', includeMe: 'keep me'}, {excludes: null}), '- ignore me<br/>- keep me')
    tt.equal(pretty({ignoreMe: 'ignore me', includeMe: 'keep me'}, {excludes: []}), '- ignore me<br/>- keep me')
    tt.equal(pretty({ignoreMe: 'ignore me', includeMe: 'keep me'}, {excludes: ['something else']}), '- ignore me<br/>- keep me')
    tt.equal(pretty({ignoreMe: 'ignore me', includeMe: 'keep me'}, {excludes: ['ignoreMe']}), 'keep me')
  })
})
