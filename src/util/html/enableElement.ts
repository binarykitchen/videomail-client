import canUseDisabledAttribute from "./canUseDisabledAttribute";

function enableElement(element?: HTMLElement) {
  if (!element) {
    return;
  }

  if (canUseDisabledAttribute(element)) {
    element.removeAttribute("disabled");
  } else {
    element.classList.remove("disabled");
  }
}

export default enableElement;
