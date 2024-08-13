import test from "tape-catch";
import h from "hyperscript";

import VideomailClient from "./../../src/js/client";

const SILENT = true;

function addDivForVideomail() {
  const body = document.getElementsByTagName("body")[0];
  const div = h("div#videomail");

  body.appendChild(div);
}

test("VideomailClient:", { timeout: 2000 }, function (t) {
  let client;

  addDivForVideomail();

  t.test("can be instantiated and emits built event", function (tt) {
    tt.plan(2);

    const consoleFacade = console;

    if (SILENT) {
      consoleFacade.error = function () {};
      consoleFacade.warn = function () {};
      consoleFacade.debug = function () {};
    }

    tt.doesNotThrow(function () {
      client = new VideomailClient({
        verbose: !SILENT,
        logger: consoleFacade,
      });

      tt.equal(client.isBuilt(), true);
    });
  });

  // todo: add test for fn show() once tape-run + electronjs allow getUserMedia access

  t.test("hiding does not throw error and emits event", function (tt) {
    tt.plan(2);

    client.once(client.events.HIDE, function () {
      tt.pass("Hide event received");
    });

    tt.doesNotThrow(function () {
      client.hide();
    });
  });

  t.test("unload does not throw an error and emits event", function (tt) {
    tt.plan(1);

    tt.doesNotThrow(function () {
      client.unload();
    });
  });
});
