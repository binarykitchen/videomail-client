import test from "tape-catch";

import Browser from "../../src/js/util/browser";

test("Browser:", { timeout: 2000 }, function (t) {
  t.test("without arguments", function (tt) {
    tt.plan(7);

    const browser = new Browser({ debug() {} });

    let err = browser.checkBufferTypes();
    tt.equal(err, undefined);

    const videoType = browser.getVideoType();
    tt.equal(videoType, "mp4");

    err = browser.getNoAccessIssue();
    tt.equal(err.message, "Unable to access webcam (default)");
    tt.equal(err.explanation, "Your system does not let your browser access your webcam");

    tt.equal(browser.isChromeBased(), false);
    tt.equal(browser.isFirefox(), false);
    tt.equal(browser.isEdge(), false);
  });

  t.test("fake old Firefox", function (tt) {
    tt.plan(7);

    const options = {
      fakeUaString:
        "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:23.0) Gecko/20131011 Firefox/23.0",
      debug() {},
    };

    const browser = new Browser(options);
    let err = browser.checkBufferTypes();
    tt.equal(err, undefined);

    tt.equal(browser.getVideoType(), "mp4");

    err = browser.getNoAccessIssue();
    tt.equal(err.message, "Unable to access webcam (default)");
    tt.equal(err.explanation, "Please grant Firefox access to your webcam");

    tt.equal(browser.isChromeBased(), false);
    tt.equal(browser.isFirefox(), true);
    tt.equal(browser.isEdge(), false);
  });

  t.test("fake old Chrome", function (tt) {
    tt.plan(7);

    const options = {
      fakeUaString:
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.8 (KHTML, like Gecko) Chrome/17.0.940.0 Safari/535.8",
      debug() {},
    };

    const browser = new Browser(options);
    let err = browser.checkBufferTypes();
    tt.equal(err, undefined);

    tt.equal(browser.getVideoType(), "mp4");

    err = browser.getNoAccessIssue();
    tt.equal(err.message, "Unable to access webcam (default)");
    tt.equal(err.explanation, "Click on the allow button to grant access to your webcam");

    tt.equal(browser.isChromeBased(), true);
    tt.equal(browser.isFirefox(), false);
    tt.equal(browser.isEdge(), false);
  });

  t.test("fake old Safari", function (tt) {
    tt.plan(7);

    const options = {
      fakeUaString:
        "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_5_8; en-us) AppleWebKit/532.0+ (KHTML, like Gecko) Version/4.0.3 Safari/531.9",
      fakeHttps: true,
      debug() {},
    };

    const browser = new Browser(options);
    let err = browser.checkBufferTypes();
    tt.equal(err, undefined);

    tt.equal(browser.getVideoType(), "mp4");

    err = browser.getNoAccessIssue();
    tt.equal(err.message, "Unable to access webcam (default)");
    tt.equal(err.explanation, "Your system does not let your browser access your webcam");

    tt.equal(browser.isChromeBased(), false);
    tt.equal(browser.isFirefox(), false);
    tt.equal(browser.isEdge(), false);
  });

  t.test("is edge", function (tt) {
    tt.plan(3);

    const options = {
      fakeUaString:
        "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136",
      debug() {},
    };

    const browser = new Browser(options);

    tt.equal(browser.isChromeBased(), false);
    tt.equal(browser.isFirefox(), false);
    tt.equal(browser.isEdge(), true);
  });
});
