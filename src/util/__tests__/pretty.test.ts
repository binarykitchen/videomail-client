import pretty from "../string/pretty";

describe("pretty", () => {
  it("should return element ID with # prefix for HTML elements with ID", () => {
    const div = document.createElement("div");
    div.id = "test-id";
    expect(pretty(div)).toEqual("#test-id");
  });

  it("should return class name with . prefix for HTML elements with class", () => {
    const div = document.createElement("div");
    div.className = "test-class";
    expect(pretty(div)).toEqual(".test-class");
  });

  it("should return fallback message for HTML elements without ID or class", () => {
    const div = document.createElement("div");
    expect(pretty(div)).toEqual("(No HTML identifier available)");
  });

  it("formats plain objects as JSON", () => {
    const obj = { test: "value" };
    expect(pretty(obj)).toEqual('{"test":"value"}');
  });

  it.each([
    [null, "null"],
    [undefined, "undefined"],
  ])("should format %s as %s", (value, expected) => {
    expect(pretty(value)).toEqual(expected);
  });

  it("should handle arrays", () => {
    expect(pretty([1, 2, 3])).toEqual("[1,2,3]");
  });

  it("should handle nested objects", () => {
    const nested = { a: { b: "c" } };
    expect(pretty(nested)).toEqual('{"a":{"b":"c"}}');
  });

  it("should include useful details for browser events", () => {
    const event = new Event("error");

    const output = pretty(event);

    expect([
      output.includes('"type":"error"'),
      output.includes('"isTrusted":false'),
    ]).toEqual([true, true]);
  });

  it("spells out errors with their cause", () => {
    const error = new Error("Hello I am an error", { cause: "because of me" });

    expect(pretty(error)).toBe('Error: Hello I am an error (cause: "because of me")');
  });

  it("marks circular references instead of failing", () => {
    const loop: Record<string, unknown> = { name: "loop" };
    loop.self = loop;

    expect(pretty(loop)).toBe('{"name":"loop","self":"[Circular]"}');
  });

  it("caps very long output", () => {
    const output = pretty("x".repeat(5_000));

    expect({ length: output.length, ending: output.slice(-2) }).toEqual({
      length: 1_002,
      ending: " …",
    });
  });
});
