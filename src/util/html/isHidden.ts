function isHidden(element?: HTMLElement | null) {
  if (!element) {
    return true;
  }

  const display = element.style.getPropertyValue("display");

  return display.includes("none");
}

export default isHidden;
