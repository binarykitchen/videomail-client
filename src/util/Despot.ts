import stringify from "safe-json-stringify";
import EventEmitter from "events";

import Events from "../events";
import { VideomailClientOptions } from "../types/options";
import createError from "./error/createError";

// TODO: MAKE EVENT EMITTING IN DESPOT NOT GLOBAL BUT BY CONTAINER ID INSTEAD LoL

// const makeDespot = function () {
//   const Despot = function () {
//     if (global._singletonDespotInstance) {
//       return global._singletonDespotInstance;
//     }

//     global._singletonDespotInstance = this;
//     EventEmitter.call(this);
//   };

//   inherits(Despot, EventEmitter);

//   return new Despot();
// };

// export default makeDespot();

interface EventArgs {
  exc?: unknown;
  err?: Error;
  [key: string]: any;
}

class Despot extends EventEmitter {
  protected options: VideomailClientOptions;
  private name: string;

  protected constructor(name: string, options: VideomailClientOptions) {
    super();

    this.options = options;
    this.name = name;
  }

  public override emit(eventName: string, args?: EventArgs) {
    const exc = args?.exc;
    const err = args?.err;

    // Automatically convert errors to videomail errors
    if (eventName === Events.ERROR) {
      if (exc) {
        args.exc = createError({ exc, options: this.options });
      } else if (err) {
        args.err = createError({ err, options: this.options });
      }
    }

    if (this.options.logger.debug) {
      if (eventName !== "removeListener" && eventName !== "newListener") {
        if (args) {
          this.options.logger.debug(
            `${this.name} emits ${eventName} with ${stringify(args)}`,
          );
        } else {
          this.options.logger.debug(`${this.name} emits ${eventName}`);
        }
      }
    }

    return super.emit(eventName, args);
  }
}

export default Despot;
