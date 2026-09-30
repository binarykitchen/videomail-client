import enableElement from "../enableElement";

describe("enableElement", () => {
  it.each(["button", "input"])("enables a %s element", (tagName) => {
    const element = document.createElement(tagName);
    element.setAttribute("disabled", "true");

    enableElement(element);

    expect(element.hasAttribute("disabled")).toBe(false);
  });

  it("removes a disabled class from an ordinary element", () => {
    const element = document.createElement("div");
    element.classList.add("disabled");

    enableElement(element);

    expect(element.classList.contains("disabled")).toBe(false);
  });

  it("accepts an absent element", () => {
    expect(() => {
      enableElement();
    }).not.toThrow();
  });
});
