import { serializeError } from "serialize-error";

function getEventDetails(event: Event) {
  const eventWithErrorDetails = event as unknown as Record<string, unknown>;

  // Copy useful fields explicitly; event properties do not serialize on their own.
  const details: Record<string, unknown> = {
    constructor: event.constructor.name,
    type: event.type,
    isTrusted: event.isTrusted,
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    composed: event.composed,
    defaultPrevented: event.defaultPrevented,
    eventPhase: event.eventPhase,
    timeStamp: event.timeStamp,
    returnValue: eventWithErrorDetails.returnValue,
    cancelBubble: eventWithErrorDetails.cancelBubble,
  };

  for (const property of ["message", "filename", "lineno", "colno"]) {
    const value = eventWithErrorDetails[property];

    if (value !== undefined) {
      details[property] = value;
    }
  }

  if (eventWithErrorDetails.error instanceof Error) {
    details.error = serializeError(eventWithErrorDetails.error);
  }

  if (event.target) {
    const target = event.target as EventTarget & Record<string, unknown>;
    const targetDetails: Record<string, unknown> = {
      constructor: target.constructor.name,
    };

    for (const property of [
      "url",
      "readyState",
      "protocol",
      "extensions",
      "binaryType",
      "bufferedAmount",
    ]) {
      const value = target[property];

      if (value !== undefined) {
        targetDetails[property] = value;
      }
    }

    details.target = targetDetails;
  }

  return details;
}

export default getEventDetails;
