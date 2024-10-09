function disableElement(element?: HTMLElement) {
  if (!element) {
    return;
  }

  if (element.tagName === "INPUT" || element.tagName === "BUTTON") {
    element.setAttribute("disabled", "true");
  } else {
    element.classList.add("disabled");
  }
}

export default disableElement;
