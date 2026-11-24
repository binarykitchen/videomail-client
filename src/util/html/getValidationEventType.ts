// Radios and selects settle on "change". Text-like fields report each keystroke on "input".
function getValidationEventType(element: Element) {
  const isChoiceControl =
    element.getAttribute("type") === "radio" || element.tagName === "SELECT";

  return isChoiceControl ? "change" : "input";
}

export default getValidationEventType;
