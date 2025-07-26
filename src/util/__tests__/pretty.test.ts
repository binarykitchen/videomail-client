import pretty from "../pretty";

describe("pretty", () => {
  it("should return element ID with # prefix for HTML elements with ID", () => {
    const div = document.createElement("div");
    div.id = "test-id";
    expect(pretty(div)).toBe("#test-id");
  });

  it("should return class name with . prefix for HTML elements with class", () => {
    const div = document.createElement("div");
    div.className = "test-class";
    expect(pretty(div)).toBe(".test-class");
  });

  it("should return fallback message for HTML elements without ID or class", () => {
    const div = document.createElement("div");
    expect(pretty(div)).toBe("(No HTML identifier available)");
  });

  it("should handle non-HTML elements using inspect", () => {
    const obj = { test: "value" };
    expect(pretty(obj)).toMatch(/\{ test: ["']value["'] \}/u);
  });

  it("should handle null and undefined", () => {
    expect(pretty(null)).toBe("null");
    expect(pretty(undefined)).toBe("undefined");
  });

  it("should handle arrays", () => {
    expect(pretty([1, 2, 3])).toMatch(/\[ 1, 2, 3 \]/u);
  });

  it("should handle nested objects", () => {
    const nested = { a: { b: "c" } };
    expect(pretty(nested)).toMatch(/\{ a: \{ b: ["']c["'] \} \}/u);
  });
});
