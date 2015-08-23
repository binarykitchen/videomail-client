var test = require('tape'),

    Buttons = require('./../../src/wrappers/buttons')

test('Buttons:', function(t) {

    t.test('can be instantiated', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            new Buttons()
        })
    })
})
