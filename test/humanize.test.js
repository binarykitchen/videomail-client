var test     = require('tape'),

    humanize = require('./../src/util/humanize')

test('humanize:', function(t) {

    t.test('filesize', function(tt) {

        tt.test('empty', function(tt) {
            tt.plan(1)

            var filesize = humanize.filesize(0)
            tt.equal(filesize, '0 B')
        })

        /*
        tt.test('under one kilobyte', function(tt) {
            tt.plan(1)

            var filesize = humanize.filesize(1023, 0)
            tt.equal(filesize, '1023 B')
        })
        */

        tt.test('is one kilobyte', function(tt) {
            tt.plan(1)

            var filesize = humanize.filesize(1024)
            tt.equal(filesize, '1 kB')
        })

        tt.test('is one megabyte', function(tt) {
            tt.plan(1)

            var filesize = humanize.filesize(Math.pow(1024, 2))
            tt.equal(filesize, '1 MB')
        })

        tt.test('is one gigabyte', function(tt) {
            tt.plan(1)

            var filesize = humanize.filesize(Math.pow(1024, 3))
            tt.equal(filesize, '1 GB')
        })

        tt.test('is one megabyte without precision', function(tt) {
            tt.plan(1)

            var filesize = humanize.filesize(Math.pow(1024, 2.123), 0)
            tt.equal(filesize, '2 MB')
        })

        tt.test('is one megabyte with one digit after comma', function(tt) {
            tt.plan(1)

            var filesize = humanize.filesize(Math.pow(1024, 2.123), 1)
            tt.equal(filesize, '2.3 MB')
        })

        tt.test('is one megabyte with four digits after comma', function(tt) {
            tt.plan(1)

            var filesize = humanize.filesize(Math.pow(1024, 2.123), 4)
            tt.equal(filesize, '2.3457 MB')
        })
    })
})
