import summarize, { Contents } from "../summarize";

describe("summarize", () => {
  it("sorts contents and formats values", () => {
    const contents: Contents = {
      zebra: true,
      alpha: undefined,
      nested: { value: "test" },
    };

    expect(summarize("Diagnostic", contents)).toBe(
      "🔎 Diagnostic\n" +
        "  • alpha: undefined\n" +
        "  • nested: { value: 'test' }\n" +
        "  • zebra: true",
    );
  });
});
