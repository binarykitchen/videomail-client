function hideElement(element?: HTMLElement | null) {
  if (!element) {
    return;
  }

  // It has to be !important because some poorly WordPress themes override inline styles
  element.style.setProperty("display", "none", "important");
}

export default hideElement;
