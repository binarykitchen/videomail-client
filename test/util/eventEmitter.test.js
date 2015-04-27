var test = require('tape'),

    EventEmitter = require('./../../src/util/eventEmitter')

test('EventEmitter:', function(t) {

    t.test('can be instantiated', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            new EventEmitter()
        })
    })
})
