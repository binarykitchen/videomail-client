function showElement(element?: HTMLElement | null) {
  if (!element) {
    return;
  }

  element.style.removeProperty("display");
}

export default showElement;
