import type { PartialVideomail } from "../types/Videomail";

type Recipients = Pick<PartialVideomail, "bcc" | "cc" | "to">;

function isRecipientSelectionValid(recipients: Recipients) {
  const hasTo = Boolean(recipients.to?.length);
  const hasCc = Boolean(recipients.cc?.length);
  const hasBcc = Boolean(recipients.bcc?.length);
  const hasConfiguredTo = "to" in recipients;
  const hasConfiguredCc = "cc" in recipients;
  const hasConfiguredBcc = "bcc" in recipients;

  let isValid = true;

  if (hasConfiguredTo) {
    isValid = hasTo || (hasConfiguredCc && hasCc) || (hasConfiguredBcc && hasBcc);
  } else if (hasConfiguredCc) {
    isValid = hasCc || !hasConfiguredBcc || hasBcc;
  }

  return isValid;
}

export default isRecipientSelectionValid;
