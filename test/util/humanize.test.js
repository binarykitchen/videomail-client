import test from "tape-catch";

import humanize from "./../../src/js/util/humanize";

test("humanize:", function (t) {
  t.test("filesize throws error on missing params", function (tt) {
    tt.plan(1);

    tt.throws(function () {
      humanize.filesize();
    });
  });

  t.test("toTime can be called", function (tt) {
    tt.plan(1);

    tt.doesNotThrow(function () {
      humanize.toTime();
    });
  });
});
