import { trimEmails } from "../trimEmail";

describe("trimEmail", () => {
  suite("trimEmails()", () => {
    test("converts a single string into a set", () => {
      expect(trimEmails("a@here.com")).toStrictEqual(["a@here.com"]);
    });

    test("trims white spaces between commas", () => {
      expect(
        trimEmails("     a, b,c,  ,     d,,  ,                     , "),
      ).toStrictEqual(["a", "b", "c", "d"]);
    });

    test("converts an array of string email addresses into a Set", () => {
      expect(trimEmails("a@here.com, b@there.com")).toStrictEqual([
        "a@here.com",
        "b@there.com",
      ]);
    });

    test("keeps special characters but removes empty entries", () => {
      expect(trimEmails("a@here.com<>,, , b@\nthe\rre.com")).toStrictEqual([
        "a@here.com<>",
        "b@\nthe\rre.com",
      ]);
    });

    test("removes duplicate entries", () => {
      expect(
        trimEmails(
          "a@infernaldarkness.com, \nb@infernaldarkness.com,\nc@infernaldarkness.com,\rd@infernaldarkness.com",
        ),
      ).toStrictEqual([
        "a@infernaldarkness.com",
        "b@infernaldarkness.com",
        "c@infernaldarkness.com",
        "d@infernaldarkness.com",
      ]);
    });
  });
});
