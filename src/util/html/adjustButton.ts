import disableElement from "./disableElement";
import hideElement from "./hideElement";

export type ButtonType = "submit" | "reset" | "button";

function adjustButton(
  buttonElement: HTMLButtonElement,
  show?: boolean,
  type?: ButtonType,
  disabled?: boolean,
) {
  if (disabled) {
    disableElement(buttonElement);
  }

  if (type) {
    buttonElement.type = type;
  }

  if (!show) {
    hideElement(buttonElement);
  }

  return buttonElement;
}

export default adjustButton;
