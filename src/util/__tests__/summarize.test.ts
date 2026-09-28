import summarize from "../summarize";

describe("summarize", () => {
  it("sorts contents and formats values", () => {
    const contents = {
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
