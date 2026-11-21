import type { FormFieldMappings } from "./getFormFieldMappings";

/**
 * Resolve a host control to a Videomail field; unrelated controls have no match.
 *
 * @param inputName - The HTML `name` (e.g. `videomail_key`), or `null` if absent.
 * @param fieldMappings - The same record-to-HTML pairs used for submission.
 */
function getVideomailFieldName(
  inputName: string | null,
  fieldMappings: FormFieldMappings,
) {
  return fieldMappings.find(([, name]) => name === inputName)?.[0];
}

export default getVideomailFieldName;
