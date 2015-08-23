var test = require('tape'),

    UserMedia = require('./../../src/wrappers/visuals/userMedia')

test('UserMedia:', function(t) {

    t.test('can be instantiated', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            new UserMedia()
        })
    })
})
