import type { VideomailClientOptions } from "../../types/options";
import type { Videomail } from "../../types/Videomail";
import type { FormFieldMappings, FormOnlyFields } from "./getFormFieldMappings";
import getVideomailFieldName from "./getVideomailFieldName";
import setFormControlValue from "./setFormControlValue";

/**
 * Fill the controls that belong to the loaded replay, leaving unrelated host fields
 * alone.
 *
 * @param form - The host form, including any controls associated with it from outside.
 * @param videomail - The replay record, also passed to the host callback if configured.
 * @param fieldMappings - The same field names used to build the submission payload.
 * @param options - Provides the host value callback and the field names to lock.
 */
function populateFormFields(
  form: HTMLFormElement,
  videomail: Videomail & FormOnlyFields,
  fieldMappings: FormFieldMappings,
  options: VideomailClientOptions,
) {
  const { selectors, callbacks } = options;

  for (const control of form.elements) {
    const name = control.getAttribute("name");
    const fieldName = getVideomailFieldName(name, fieldMappings);

    if (name && fieldName) {
      // Integrations expect the host field name, not the canonical Videomail field name.
      const storedValue = videomail[fieldName];
      const value = callbacks.adjustFormValueBeforePopulating
        ? callbacks.adjustFormValueBeforePopulating(name, storedValue, videomail)
        : storedValue;
      setFormControlValue(control, value, options);

      // Keep the replay's To, subject and body locked even when a stored value is missing.
      if (
        name === selectors.toInputName ||
        name === selectors.subjectInputName ||
        name === selectors.bodyInputName
      ) {
        control.setAttribute("disabled", "disabled");
      }
    }
  }
}

export default populateFormFields;
