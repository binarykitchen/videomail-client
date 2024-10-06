import test from "tape-catch";

import Container from "./../../src/wrappers/container";
import addOptionsFunctions from "./../../src/util/addOptionsFunctions";

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
