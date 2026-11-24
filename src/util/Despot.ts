import type { Emitter } from "nanoevents";
import { createNanoEvents } from "nanoevents";

import { VideomailEvents } from "../types/events";
import { VideomailClientOptions } from "../types/options";
import VideomailError from "./error/VideomailError";
import isObjectLike from "./isObjectLike";
import pretty from "./string/pretty";

export type DespotEmitter = Emitter<VideomailEvents>;

interface Subscription {
  eventName: keyof VideomailEvents;
  unsubscribe: () => void;
}

/*
 * Fired for every confirmed frame and audio batch. Logging them would push
 * everything useful out of the few lines attached to error reports.
 */
const QUIET_EVENTS = new Set<keyof VideomailEvents>(["PROGRESS"]);

// Empty parameters like {} would only add noise to the log line.
function hasParamsToShow(firstParam: unknown) {
  if (!firstParam) {
    return false;
  }

  if (!isObjectLike(firstParam)) {
    return true;
  }

  return Object.keys(firstParam).filter(Boolean).length > 0;
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

  private logEmit<E extends keyof VideomailEvents>(
    eventName: E,
    params: Parameters<VideomailEvents[E]>,
  ) {
    if (QUIET_EVENTS.has(eventName)) {
      return;
    }

    if (hasParamsToShow(params[0])) {
      this.options.logger.debug(`${this.name} emits ${eventName} with ${pretty(params)}`);
    } else {
      this.options.logger.debug(`${this.name} emits ${eventName}`);
    }
  }

  protected emit<E extends keyof VideomailEvents>(
    eventName: E,
    ...params: Parameters<VideomailEvents[E]>
  ) {
    this.logEmit(eventName, params);

    // Listeners can't throw out of here; on() guards each one of them.
    this.emitter.emit(eventName, ...params);
  }

  /*
   * A listener registered by one of our components failed. That's a recorder problem,
   * so it becomes an ERROR, which the container displays and reports.
   *
   * VideomailClient overrides this, because its listeners belong to the host app.
   */
  protected handleListenerFailure(eventName: keyof VideomailEvents, exc: unknown) {
    // A failing ERROR listener would only trigger itself again. Log and stop there.
    if (eventName === "ERROR") {
      this.options.logger.error(exc);
      return;
    }

    if (exc instanceof VideomailError) {
      this.emit("ERROR", { err: exc });
    } else {
      this.emit("ERROR", { exc });
    }
  }

  public on<E extends keyof VideomailEvents>(eventName: E, callback: VideomailEvents[E]) {
    // Each listener fails on its own. Nanoevents would otherwise stop at the first
    // exception and skip everybody else listening to the same event.
    const guardedCallback = ((...params: Parameters<VideomailEvents[E]>) => {
      try {
        (callback as (...args: Parameters<VideomailEvents[E]>) => void)(...params);
      } catch (exc) {
        this.handleListenerFailure(eventName, exc);
      }
    }) as VideomailEvents[E];

    const unsubscribeFromEmitter = this.emitter.on(eventName, guardedCallback);
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
