import type { VideomailClientOptions } from "../../types/options";
import createError from "../../util/error/createError";

/**
 * Render a replay value in a host input, textarea or select.
 *
 * @param control - The matched host element; unsupported tags use the client's error
 *   path.
 * @param value - A saved value or callback result. A missing value leaves the control
 *   alone.
 * @param options - Client settings used if an unsupported control needs to be reported.
 */
function setFormControlValue(
  control: Element,
  value: string | string[] | null | undefined,
  options: VideomailClientOptions,
) {
  if (value === undefined || value === null) {
    return;
  }

  const { tagName } = control;

  switch (tagName) {
    case "INPUT": {
      const input = control as HTMLInputElement;
      // Inputs show address lists as comma-separated text that submission can split again.
      input.value = Array.isArray(value) ? value.join(", ") : value;
      break;
    }
    case "TEXTAREA":
    case "SELECT": {
      const field = control as HTMLTextAreaElement | HTMLSelectElement;
      field.value = String(value);
      break;
    }
    default:
      throw createError({
        message: `Unsupported form control tag name ${tagName} found`,
        options,
      });
  }
}

export default setFormControlValue;
