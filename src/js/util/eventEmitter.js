import despot from "despot";
import stringify from "safe-json-stringify";

import VideomailError from "./videomailError";
import Events from "./../events";

// TODO: MAKE EVENT EMITTING IN DESPOT NOT GLOBAL BUT BY CONTAINER ID INSTEAD

export default function (options, name) {
  this.emit = function (event) {
    const args = Array.prototype.slice.call(arguments, 0);

    if (!event) {
      throw VideomailError.create("You cannot emit without an event.", options);
    }

    // Automatically convert errors to videomail errors
    if (event === Events.ERROR) {
      let err = args[1];

      err = VideomailError.create(err, options);

      args[1] = err;
    }

    if (options.debug) {
      if (event !== "removeListener" && event !== "newListener") {
        let moreArguments;

        if (args[1]) {
          moreArguments = args.slice(1);
        }

        if (moreArguments) {
          options.debug("%s emits: %s", name, event, stringify(moreArguments));
        } else {
          options.debug("%s emits: %s", name, event);
        }
      }
    }

    const result = despot.emit.apply(despot, args);

    /*
     * Todo: have this emitted through a configuration because it is pretty noisy
     * if (event !== Events.EVENT_EMITTED)
     *     this.emit(Events.EVENT_EMITTED, event)
     */

    return result;
  };

  this.on = function (eventName, cb) {
    return despot.on(eventName, cb);
  };

  this.once = function (eventName, cb) {
    return despot.once(eventName, cb);
  };

  this.listeners = function (eventName) {
    return despot.listeners(eventName);
  };

  this.removeListener = function (eventName, cb) {
    return despot.removeListener(eventName, cb);
  };

  this.removeAllListeners = function () {
    despot.removeAllListeners();
  };
}
