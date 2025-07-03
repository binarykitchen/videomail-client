import { createNanoEvents } from "nanoevents";

import VideomailEvents from "../types/events";
import { VideomailClientOptions } from "../types/options";
import VideomailError from "./error/VideomailError";
import pretty from "./pretty";

class Despot {
  private readonly name: string;
  protected options: VideomailClientOptions;

  // The one and only, instantiate it only once and keep it global.
  // https://github.com/ai/nanoevents
  protected static EMITTER = createNanoEvents<VideomailEvents>();

  protected constructor(name: string, options: VideomailClientOptions) {
    this.name = name;
    this.options = options;
  }

  protected emit<E extends keyof VideomailEvents>(
    eventName: E,
    ...params: Parameters<VideomailEvents[E]>
  ) {
    const firstParam = params[0];
    const showParams =
      firstParam &&
      (typeof firstParam !== "object" ||
        (typeof firstParam === "object" &&
          Object.keys(firstParam).filter(Boolean).length > 0));

    if (showParams) {
      this.options.logger.debug(`${this.name} emits ${eventName} with ${pretty(params)}`);
    } else {
      this.options.logger.debug(`${this.name} emits ${eventName}`);
    }

    try {
      Despot.EMITTER.emit(eventName, ...params);
    } catch (exc) {
      if (exc instanceof VideomailError) {
        Despot.EMITTER.emit("ERROR", { err: exc });
      } else {
        Despot.EMITTER.emit("ERROR", { exc });
      }
    }
  }

  public on<E extends keyof VideomailEvents>(eventName: E, callback: VideomailEvents[E]) {
    return Despot.EMITTER.on(eventName, callback);
  }

  public once<E extends keyof VideomailEvents>(
    eventName: E,
    listener: VideomailEvents[E],
  ) {
    const callback = (...params: Parameters<VideomailEvents[E]>) => {
      unbind();

      if (params.length > 0) {
        // Safely call listener with params
        (listener as (...args: any[]) => void)(...params);
      } else {
        // Safely call listener with no params
        (listener as () => void)();
      }
    };

    // TODO Fix force typing later
    const unbind = this.on(eventName, callback as VideomailEvents[E]);

    return unbind;
  }

  protected static getListeners<E extends keyof VideomailEvents>(eventName: E) {
    return Despot.EMITTER.events[eventName];
  }

  protected static removeListener(eventName: keyof VideomailEvents) {
    delete Despot.EMITTER.events[eventName];
  }

  protected static removeAllListeners() {
    Despot.EMITTER.events = {};
  }
}

export default Despot;
