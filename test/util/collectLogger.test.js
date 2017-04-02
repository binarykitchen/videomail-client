const test = require('tape'),
      CollectLogger = require('./../../src/util/collectLogger')

test('CollectLogger:', function(t) {

    t.test('can be instantiated', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            new CollectLogger()
        })
    })
})
