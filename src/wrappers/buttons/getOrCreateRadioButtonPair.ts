import disableElement from "../../util/html/disableElement";
import insertControl from "./insertControl";

interface RadioButtonOptions {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  changeHandler: () => void;
}

/**
 * Reuse an audio input by ID, or create the input and its matching label.
 *
 * @param container - The widget's button area where new markup belongs.
 * @param options - The lookup ID, defaults for new markup, and change handler for either
 *   case.
 * @param submitButton - An optional placement anchor for the new radio group.
 */
function getOrCreateRadioButtonPair(
  container: HTMLElement,
  options: RadioButtonOptions,
  submitButton?: HTMLButtonElement,
) {
  const { id, name, value, label, checked, changeHandler } = options;
  let radio = id ? document.querySelector<HTMLInputElement>(`#${id}`) : null;

  if (!radio) {
    radio = document.createElement("input");
    radio.id = id;
    radio.type = "radio";
    radio.name = name;
    radio.value = value;
    radio.checked = checked;

    const group = document.createElement("span");
    group.classList.add("radioGroup");
    group.appendChild(radio);

    const radioLabel = document.createElement("label");
    radioLabel.htmlFor = id;
    radioLabel.textContent = label;
    group.appendChild(radioLabel);

    insertControl(container, group, submitButton);
  }

  radio.onchange = changeHandler;
  // Recorder readiness events decide when the audio choice can be used.
  disableElement(radio);

  return radio;
}

export default getOrCreateRadioButtonPair;
