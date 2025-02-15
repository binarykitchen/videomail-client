const REGEX = /[ ,]+/u;

// fixes https://github.com/binarykitchen/videomail-client/issues/71
function trimEmail(email: string) {
  return email.replace(REGEX, "");
}

function trimEmails(emails: string) {
  const uniqueAddresses = emails
    .split(REGEX)
    .map((item) => item.trim())
    .filter(Boolean);

  return new Set(uniqueAddresses);
}

export { trimEmail, trimEmails };
