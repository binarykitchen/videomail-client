import hidden from "hidden";

function hideElement(element?: HTMLElement | null) {
  if (!element) {
    return;
  }

  hidden(element, true);
}

export default hideElement;
