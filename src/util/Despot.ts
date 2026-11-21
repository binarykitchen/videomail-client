import type { Emitter } from "nanoevents";
import { createNanoEvents } from "nanoevents";

import { VideomailEvents } from "../types/events";
import { VideomailClientOptions } from "../types/options";
import VideomailError from "./error/VideomailError";
import pretty from "./string/pretty";

export type DespotEmitter = Emitter<VideomailEvents>;

interface Subscription {
  eventName: keyof VideomailEvents;
  unsubscribe: () => void;
}

class Despot {
  private readonly name: string;
  protected readonly emitter: DespotEmitter;
  private readonly subscriptions = new Set<Subscription>();
  protected options: VideomailClientOptions;

  protected constructor(
    name: string,
    options: VideomailClientOptions,
    emitter: DespotEmitter = createNanoEvents<VideomailEvents>(),
  ) {
    this.name = name;
    this.options = options;
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
    const unsubscribeFromEmitter = this.emitter.on(eventName, callback);
    const subscription: Subscription = {
      eventName,
      unsubscribe: () => {
        // Keep cleanup scoped to this component even when siblings share an emitter.
        unsubscribeFromEmitter();
        this.subscriptions.delete(subscription);
      },
    };

    this.subscriptions.add(subscription);

    return subscription.unsubscribe;
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
    this.subscriptions.forEach((subscription) => {
      if (subscription.eventName === eventName) {
        subscription.unsubscribe();
      }
    });
  }

  protected removeAllListeners() {
    Array.from(this.subscriptions).forEach(({ unsubscribe }) => {
      unsubscribe();
    });
  }
}

export default Despot;
