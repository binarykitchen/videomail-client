const test = require('tape'),
      AudioRecorder = require('./../../src/util/audioRecorder')

test('AudioRecorder:', function(t) {

    t.test('can be instantiated', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            new AudioRecorder()
        })
    })
})
