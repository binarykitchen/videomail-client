function hideElement(element?: HTMLElement | null) {
  if (!element) {
    return;
  }

  // Some WordPress themes override inline styles, so !important is needed.
  element.style.setProperty("display", "none", "important");
}

export default hideElement;
