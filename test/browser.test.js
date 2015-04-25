var test    = require('tape'),

    Browser = require('./../src/util/browser')

test('Browser:', function(t) {

    t.test('without arguments', function(tt) {
        tt.plan(11)

        var browser = new Browser(),
            err

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

    t.test('fake old Firefox', function(tt) {
        tt.plan(11)

        var options = {
            fakeUaString: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:23.0) Gecko/20131011 Firefox/23.0'
        }

        var browser = new Browser(options),
            err

        err = browser.checkRecordingCapabilities()
        tt.equal(err.message, 'No webcam support')
        tt.ok(err.explanation.indexOf('Upgrade Firefox') >= 0)

        err = browser.checkPlaybackCapabilities()
        tt.equal(err.message, 'No HTML5 support for video tag!')
        tt.ok(err.explanation.indexOf('Upgrade Firefox') >= 0)

        err = browser.checkBufferTypes()

        tt.equal(err.message, 'atob is not supported')
        tt.equal(err.explanation, undefined)

        tt.equal(browser.getVideoType(), undefined)

        err = browser.getNoAccessIssue()
        tt.equal(err.message, 'Cannot access webcam!')
        tt.equal(err.explanation, 'Please share your webcam under Firefox.')

        tt.equal(browser.isChromeBased(), false)
        tt.equal(browser.isFirefox(), true)
    })

    t.test('fake old Chrome', function(tt) {
        tt.plan(11)

        var options = {
            fakeUaString: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.8 (KHTML, like Gecko) Chrome/17.0.940.0 Safari/535.8'
        }

        var browser = new Browser(options),
            err

        err = browser.checkRecordingCapabilities()
        tt.equal(err.message, 'No webcam support')
        tt.ok(err.explanation.indexOf('Upgrade Chrome') >= 0)

        err = browser.checkPlaybackCapabilities()
        tt.equal(err.message, 'No HTML5 support for video tag!')
        tt.ok(err.explanation.indexOf('Upgrade Chrome') >= 0)

        err = browser.checkBufferTypes()

        tt.equal(err.message, 'atob is not supported')
        tt.equal(err.explanation, undefined)

        tt.equal(browser.getVideoType(), undefined)

        err = browser.getNoAccessIssue()
        tt.equal(err.message, 'Cannot access webcam!')
        tt.equal(err.explanation, 'Click on the allow button above to grant access to your webcam.')

        tt.equal(browser.isChromeBased(), true)
        tt.equal(browser.isFirefox(), false)
    })

    t.test('fake old IE', function(tt) {
        tt.plan(11)

        var options = {
            fakeUaString: 'Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.2; Trident/4.0; Media Center PC 4.0; SLCC1; .NET CLR 3.0.04320)'
        }

        var browser = new Browser(options),
            err

        err = browser.checkRecordingCapabilities()
        tt.equal(err.message, 'No webcam support')
        tt.ok(err.explanation.indexOf('Forget Internet Explorer!') >= 0)

        err = browser.checkPlaybackCapabilities()
        tt.equal(err.message, 'No HTML5 support for video tag!')
        tt.ok(err.explanation.indexOf('Forget Internet Explorer!') >= 0)

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

    t.test('fake old Safari', function(tt) {
        tt.plan(11)

        var options = {
            fakeUaString: 'Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_5_8; en-us) AppleWebKit/532.0+ (KHTML, like Gecko) Version/4.0.3 Safari/531.9'
        }

        var browser = new Browser(options),
            err

        err = browser.checkRecordingCapabilities()
        tt.equal(err.message, 'No webcam support')
        tt.ok(err.explanation.indexOf('Safari has no webcam support yet.') >= 0)

        err = browser.checkPlaybackCapabilities()
        tt.equal(err.message, 'No HTML5 support for video tag!')
        tt.ok(err.explanation.indexOf('Safari has no webcam support yet.') >= 0)

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
