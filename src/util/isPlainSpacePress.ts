// Shortcuts only react to a plain Space press: no modifier keys, auto-repeat or handled event.
function isPlainSpacePress(e: KeyboardEvent) {
  return (
    e.code === "Space" &&
    !e.repeat &&
    !e.defaultPrevented &&
    !e.altKey &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.shiftKey
  );
}

export default isPlainSpacePress;
