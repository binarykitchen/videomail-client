function hideElement(element?: HTMLElement | null) {
  if (!element) {
    return;
  }

  element.style.setProperty("display", "none", "important");
}

export default hideElement;
