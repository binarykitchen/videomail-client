import isRecipientSelectionValid from "../isRecipientSelectionValid";

describe("isRecipientSelectionValid", () => {
  it("accepts a populated To field", () => {
    expect(isRecipientSelectionValid({ to: ["one@example.com"] })).toBe(true);
  });

  it("rejects an empty To field without another populated recipient", () => {
    expect(isRecipientSelectionValid({ to: [] })).toBe(false);
  });

  it("accepts a populated Cc or Bcc when To is empty", () => {
    expect(
      isRecipientSelectionValid({
        bcc: ["blind-copy@example.com"],
        to: [],
      }),
    ).toBe(true);
  });

  it("rejects empty configured Cc and Bcc when To is empty", () => {
    expect(isRecipientSelectionValid({ bcc: [], cc: [], to: [] })).toBe(false);
  });

  it("keeps Bcc-only recipients optional", () => {
    expect(isRecipientSelectionValid({ bcc: [] })).toBe(true);
  });

  it("does not require recipients when the form has no recipient fields", () => {
    expect(isRecipientSelectionValid({})).toBe(true);
  });
});
