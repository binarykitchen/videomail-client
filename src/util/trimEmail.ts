const REGEX = /^[\s,]+|[\s,]+$/gu;

// fixes https://github.com/binarykitchen/videomail-client/issues/71
function trimEmail(email: string) {
  return email.replace(REGEX, "");
}

function trimEmails(emails: string) {
  return emails.split(REGEX).map((email) => trimEmail(email));
}

export { trimEmail, trimEmails };
