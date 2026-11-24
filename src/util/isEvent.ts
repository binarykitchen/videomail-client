// Event is missing outside browser-like environments.
function isEvent(value: unknown): value is Event {
  return typeof Event !== "undefined" && value instanceof Event;
}

export default isEvent;
