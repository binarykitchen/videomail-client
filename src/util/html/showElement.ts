import hidden from "hidden";

function showElement(element?: HTMLElement | null) {
  if (!element) {
    return;
  }

  hidden(element, false);
}

export default showElement;
