import disableElement from "../disableElement";

describe("disableElement", () => {
  it.each(["button", "input"])("disables a %s element", (tagName) => {
    const element = document.createElement(tagName);

    disableElement(element);

    expect(element.getAttribute("disabled")).toBe("true");
  });

  it("adds a disabled class to an ordinary element", () => {
    const element = document.createElement("div");

    disableElement(element);

    expect(element.classList.contains("disabled")).toBe(true);
  });

  it("accepts an absent element", () => {
    expect(() => {
      disableElement();
    }).not.toThrow();
  });
});
