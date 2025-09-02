function isShown(element?: HTMLElement | null) {
  if (!element) {
    return false;
  }

  const display = element.style.getPropertyValue("display");

  return !display.includes("none");
}

export default isShown;
