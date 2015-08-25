var test = require('tape'),

    Recorder = require('./../../src/wrappers/visuals/recorder')

test('Recorder:', function(t) {

    t.test('can be instantiated', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            new Recorder(null, null, {
                video: {
                    fps: 15
                }
            })
        })
    })
})
