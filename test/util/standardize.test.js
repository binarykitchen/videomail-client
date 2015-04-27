var test = require('tape'),

    standardize = require('./../../src/util/standardize'),
    root        = this

test('standardize:', function(t) {

    t.test('can be called', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            standardize(this, root)
        })
    })
})
