import adjustButton, { type ButtonType } from "../../util/html/adjustButton";
import insertControl from "./insertControl";

interface ButtonOptions {
  className: string;
  text: string;
  sharedClass?: string | undefined;
  id?: string | undefined;
  selector?: string | undefined;
  show?: boolean;
  type?: ButtonType;
  disabled?: boolean;
}

/**
 * Reuse an existing button or insert a new one without moving host controls.
 *
 * @param container - The widget's button area, used for class lookup and insertion.
 * @param options - Lookup and initial state. The label and shared class only affect new
 *   buttons.
 * @param submitButton - An optional placement anchor for a new button.
 */
function getOrCreateButton(
  container: HTMLElement,
  options: ButtonOptions,
  submitButton?: HTMLButtonElement,
) {
  const {
    className,
    text,
    sharedClass,
    id,
    selector,
    show,
    type = "button",
    disabled = true,
  } = options;
  let existing: HTMLButtonElement | null;

  // Explicit IDs and selectors can find host buttons elsewhere on the page.
  // Use the widget-local class only when neither is configured.
  if (id) {
    existing = document.querySelector<HTMLButtonElement>(`#${id}`);
  } else if (selector) {
    existing = document.querySelector<HTMLButtonElement>(selector);
  } else {
    existing = container.querySelector<HTMLButtonElement>(`.${className}`);
  }

  if (existing) {
    // Adjust the state without replacing the host button's label or classes.
    return adjustButton(existing, show, type, disabled);
  }

  const button = document.createElement("button");
  button.classList.add(className);

  if (sharedClass) {
    button.classList.add(sharedClass);
  }

  adjustButton(button, show, type, disabled);
  button.textContent = text;
  insertControl(container, button, submitButton);

  return button;
}

export default getOrCreateButton;
