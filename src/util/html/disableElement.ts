import canUseDisabledAttribute from "./canUseDisabledAttribute";

function disableElement(element?: HTMLElement) {
  if (!element) {
    return;
  }

  if (canUseDisabledAttribute(element)) {
    element.setAttribute("disabled", "true");
  } else {
    element.classList.add("disabled");
  }
}

export default disableElement;
