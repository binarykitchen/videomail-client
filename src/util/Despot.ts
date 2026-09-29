import { createNanoEvents, Emitter } from "nanoevents";

import { VideomailEvents } from "../types/events";
import { VideomailClientOptions } from "../types/options";
import VideomailError from "./error/VideomailError";
import pretty from "./pretty";

class Despot {
  private readonly name: string;
  private readonly emitter: Emitter<VideomailEvents>;
  protected options: VideomailClientOptions;

  private static readonly emitters = new WeakMap<
    VideomailClientOptions,
    Emitter<VideomailEvents>
  >();

  protected constructor(name: string, options: VideomailClientOptions) {
    this.name = name;
    this.options = options;

    let emitter = Despot.emitters.get(options);

    if (!emitter) {
      emitter = createNanoEvents<VideomailEvents>();
      Despot.emitters.set(options, emitter);
    }

    this.emitter = emitter;
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
      this.emitter.emit(eventName, ...params);
    } catch (exc) {
      if (exc instanceof VideomailError) {
        this.emitter.emit("ERROR", { err: exc });
      } else {
        this.emitter.emit("ERROR", { exc });
      }
    }
  }

  public on<E extends keyof VideomailEvents>(eventName: E, callback: VideomailEvents[E]) {
    return this.emitter.on(eventName, callback);
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

  protected getListeners<E extends keyof VideomailEvents>(eventName: E) {
    return this.emitter.events[eventName];
  }

  protected removeListener(eventName: keyof VideomailEvents) {
    delete this.emitter.events[eventName];
  }

  protected removeAllListeners() {
    this.emitter.events = {};
  }
}

export default Despot;
