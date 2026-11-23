// Marks removed data, so readers can tell a value existed without seeing it.
export const REDACTED = "[redacted]";

/**
 * Keep where a page or request lives, but drop the parts that can carry secrets or
 * personal data: credentials, the query string and the fragment.
 *
 * @param value - An absolute URL, or a relative one when `base` is given.
 * @param base - Resolves relative URLs, for example against the page location.
 */
function sanitizeUrl(value: string, base?: string) {
  try {
    const url = new URL(value, base);

    url.username = "";
    url.password = "";
    url.search = "";
    url.hash = "";

    return url.href;
  } catch {
    // An unparsable value could contain anything, so never pass it on.
    return REDACTED;
  }
}

export default sanitizeUrl;
