var test = require('tape'),

    Replay = require('./../../src/wrappers/visuals/replay')

test('Replay:', function(t) {

    t.test('can be instantiated', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            new Replay()
        })
    })
})
