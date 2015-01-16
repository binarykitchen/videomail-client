var test     = require('tape'),

    humanize = require('./../../src/util/humanize')

test('humanize:', function(t) {

    t.test('empty filesize', function(t) {
        t.plan(1)

        var filesize = humanize.filesize(0)

        t.equal(filesize, '0 B')
    })
})
