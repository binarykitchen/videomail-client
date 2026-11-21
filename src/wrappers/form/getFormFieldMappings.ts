import type { VideomailClientOptions } from "../../types/options";

const FORM_FIELDS = [
  "subject",
  "from",
  "to",
  "cc",
  "bcc",
  "body",
  "key",
  "parentKey",
  "sendCopy",
] as const;

type FormField = (typeof FORM_FIELDS)[number];
export type FormFieldMappings = readonly (readonly [FormField, string])[];

export interface FormOnlyFields {
  // The form can send this checkbox value, but it is not part of a stored video record.
  sendCopy?: string;
}

/**
 * Pair Videomail fields with the host's HTML input names for reading and writing.
 *
 * @param selectors - The integration's configured names, e.g. `keyInputName` can be
 *   `videomail_key`.
 */
function getFormFieldMappings(selectors: VideomailClientOptions["selectors"]) {
  return FORM_FIELDS.map((field) => [field, selectors[`${field}InputName`]] as const);
}

export default getFormFieldMappings;
