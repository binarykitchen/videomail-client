import hidden from "hidden";

function isShown(element?: HTMLElement | null) {
  if (!element) {
    return false;
  }

  return !hidden(element);
}

export default isShown;
