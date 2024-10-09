// fixes https://github.com/binarykitchen/videomail-client/issues/71
function trimEmail(email: string) {
  return email.replace(/^[\s,]+|[\s,]+$/gu, "");
}

function trimEmails(emails: string[]) {
  return emails.map((email) => trimEmail(email));
}

export { trimEmail, trimEmails };
