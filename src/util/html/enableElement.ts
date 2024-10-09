function enableElement(element?: HTMLElement) {
  if (!element) {
    return;
  }

  if (element.tagName === "INPUT" || element.tagName === "BUTTON") {
    element.removeAttribute("disabled");
  } else {
    element.classList.remove("disabled");
  }
}

export default enableElement;
