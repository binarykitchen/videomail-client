import despot from "despot";
import stringify from "safe-json-stringify";

import Events from "../events";
import { VideomailClientOptions } from "../types/options";
import createError from "./error/createError";
import mergeWithDefaultOptions from "./options/mergeWithDefaultOptions";

// TODO: MAKE EVENT EMITTING IN DESPOT NOT GLOBAL BUT BY CONTAINER ID INSTEAD LoL

class EventEmitter {
  protected options;

  protected constructor(options: VideomailClientOptions) {
    this.options = mergeWithDefaultOptions(options);
  }

  protected emit(event) {
    const args = Array.prototype.slice.call(arguments, 0);

    if (!event) {
      throw createError({
        message: "You cannot emit without an event.",
        options: this.options,
      });
    }

    // Automatically convert errors to videomail errors
    if (event === Events.ERROR) {
      let err = args[1];

      err = createError({ err, options: this.options });

      args[1] = err;
    }

    if (this.options.debug) {
      if (event !== "removeListener" && event !== "newListener") {
        let moreArguments;

        if (args[1]) {
          moreArguments = args.slice(1);
        }

        if (moreArguments) {
          this.options.debug(`${name} emits ${event} with ${stringify(moreArguments)}`);
        } else {
          this.options.debug(`${name} emits ${event}`);
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
  }

  protected on(eventName: string, cb) {
    return despot.on(eventName, cb);
  }

  protected once(eventName: string, cb) {
    return despot.once(eventName, cb);
  }

  protected listeners(eventName: string) {
    return despot.listeners(eventName);
  }

  protected removeListener(eventName: string, cb) {
    return despot.removeListener(eventName, cb);
  }

  protected removeAllListeners = function () {
    despot.removeAllListeners();
  };
}

export default EventEmitter;
