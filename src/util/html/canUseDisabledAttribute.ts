// Inputs and buttons have a native disabled state. Other elements get a "disabled" class.
function canUseDisabledAttribute(element: HTMLElement) {
  return element.tagName === "INPUT" || element.tagName === "BUTTON";
}

export default canUseDisabledAttribute;
