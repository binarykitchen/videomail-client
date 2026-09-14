import pretty from "../pretty";

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

  it("should handle non-HTML elements using inspect", () => {
    const obj = { test: "value" };
    expect(pretty(obj)).toEqual("{ test: 'value' }");
  });

  it("should handle null and undefined", () => {
    expect(pretty(null)).toEqual("null");
    expect(pretty(undefined)).toEqual("undefined");
  });

  it("should handle arrays", () => {
    expect(pretty([1, 2, 3])).toEqual("[ 1, 2, 3, [length]: 3 ]");
  });

  it("should handle nested objects", () => {
    const nested = { a: { b: "c" } };
    expect(pretty(nested)).toEqual("{ a: { b: 'c' } }");
  });

  it("should handle errors", () => {
    const error = new Error("Hello I am an error", { cause: "because of me" });

    expect(pretty(error)).toContain("Error: Hello I am an error");
    expect(pretty(error)).toContain("[cause]: 'because of me'");
  });
});
