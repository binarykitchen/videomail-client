var test = require('tape'),

    Notifier = require('./../../src/wrappers/visuals/notifier')

test('Notifier:', function(t) {

    t.test('can be instantiated', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            new Notifier()
        })
    })
})
