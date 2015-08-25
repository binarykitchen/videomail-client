var test = require('tape'),

    Form = require('./../../src/wrappers/form')

test('Form:', function(t) {

    t.test('can be instantiated', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            new Form()
        })
    })
})
