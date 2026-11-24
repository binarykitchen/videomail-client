// Browsers report media and playback failures as DOMExceptions, told apart by their name.
function isDOMExceptionNamed(error: unknown, name: string): error is DOMException {
  return error instanceof DOMException && error.name === name;
}

export default isDOMExceptionNamed;
