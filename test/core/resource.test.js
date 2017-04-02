const test = require('tape'),
      Resource = require('./../../src/resource')

test('Resource:', function(t) {

    t.test('can be instantiated', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            new Resource()
        })
    })
})
