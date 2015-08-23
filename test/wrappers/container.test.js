var test = require('tape'),

    Container = require('./../../src/wrappers/container')

test('Container:', function(t) {

    t.test('can be instantiated', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            new Container({
                video: {
                    fps: 15
                }
            })
        })
    })
})
