var test = require('tape'),

    VideomailClient = require('./../../src/client')

test('VideomailClient:', function(t) {

    t.test('can be instantiated', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            new VideomailClient()
        })
    })
})
