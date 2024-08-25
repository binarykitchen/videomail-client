import test from "tape-catch";

import Container from "./../../src/js/wrappers/container";
import addOptionsFunctions from "./../../src/js/util/addOptionsFunctions";

test("Container:", function (t) {
  t.test("can be instantiated", function (tt) {
    tt.plan(1);

    tt.doesNotThrow(function () {
      const options = {
        video: {
          fps: 15,
        },
        image: {},
      };

      return new Container(addOptionsFunctions(options));
    });
  });
});
