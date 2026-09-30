const EMAIL_SEPARATOR_REGEX = /[ ,]+/gu;

// fixes https://github.com/binarykitchen/videomail-client/issues/71
function trimEmail(email: string) {
  return email.replace(EMAIL_SEPARATOR_REGEX, "");
}

function trimEmails(emails: string) {
  const trimmedEmails = emails
    .split(EMAIL_SEPARATOR_REGEX)
    .map((item) => item.trim())
    .filter(Boolean);

  return trimmedEmails;
}

export { trimEmail, trimEmails };
