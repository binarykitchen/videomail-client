/**
 * Place a generated control without rearranging the host's markup.
 *
 * @param container - The button area receiving the generated control.
 * @param control - The new button or radio group to insert.
 * @param submitButton - Insert before this button if it is a direct child; otherwise
 *   append.
 */
function insertControl(
  container: HTMLElement,
  control: HTMLElement,
  submitButton?: HTMLButtonElement,
) {
  // A descendant match is not enough: insertBefore() throws if Submit is not a direct child.
  if (submitButton?.parentElement === container) {
    container.insertBefore(control, submitButton);
  } else {
    container.appendChild(control);
  }
}

export default insertControl;
