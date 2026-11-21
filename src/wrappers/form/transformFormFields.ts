import type { PartialVideomail } from "../../types/Videomail";
import { trimEmail, trimEmails } from "../../util/email/trimEmail";
import type { FormFieldMappings, FormOnlyFields } from "./getFormFieldMappings";

export type FormInputs = Record<string, string>;

/**
 * Prepare the Videomail payload without copying unrelated host form fields.
 *
 * @param formInputs - Serialized values keyed by their HTML names.
 * @param fieldMappings - Pairs of Videomail field and configured HTML name.
 */
function transformFormFields(formInputs: FormInputs, fieldMappings: FormFieldMappings) {
  const videomail: PartialVideomail & FormOnlyFields = {};

  fieldMappings.forEach(([field, inputName]) => {
    const value = inputName in formInputs ? formInputs[inputName] : undefined;

    // Skip missing inputs but preserve empty values submitted by the host.
    if (value === undefined) {
      return;
    }

    // The API expects one sender string and a list for each recipient field.
    switch (field) {
      case "from":
        videomail[field] = trimEmail(value);
        break;
      case "to":
      case "cc":
      case "bcc":
        videomail[field] = trimEmails(value);
        break;
      default:
        videomail[field] = value;
    }
  });

  return videomail;
}

export default transformFormFields;
