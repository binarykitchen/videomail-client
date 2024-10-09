function isNotButton(element: Element) {
  return element.tagName !== "BUTTON" && element.getAttribute("type") !== "submit";
}

export default isNotButton;
