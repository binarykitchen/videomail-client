// Anything but text, like an object or a number. A missing message doesn't count.
function isNonTextMessage(message: unknown) {
  if (message === undefined || message === null) {
    return false;
  }

  return typeof message !== "string";
}

export default isNonTextMessage;
