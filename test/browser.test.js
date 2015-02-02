var test    = require('tape'),

    Browser = require('./../src/util/browser')

test('Browser:', function(t) {

    t.test('without arguments', function(tt) {
        tt.plan(12)

        var browser = new Browser(),
            err

        tt.equal(browser.canRecord(), false)

        err = browser.checkRecordingCapabilities()
        tt.equal(err.message, 'No webcam support')
        tt.ok(err.explanation.indexOf('Upgrade browser') >= 0)

        err = browser.checkPlaybackCapabilities()
        tt.equal(err.message, 'No HTML5 support for video tag!')
        tt.ok(err.explanation.indexOf('Upgrade browser') >= 0)

        err = browser.checkBufferTypes()

        tt.equal(err.message, 'atob is not supported')
        tt.equal(err.explanation, undefined)

        tt.equal(browser.getVideoType(), undefined)

        err = browser.getNoAccessIssue()
        tt.equal(err.message, 'Cannot access webcam!')
        tt.equal(err.explanation, 'Your operating system does not let your browser access your webcam.')

        tt.equal(browser.isChromeBased(), false)
        tt.equal(browser.isFirefox(), false)
    })
})
