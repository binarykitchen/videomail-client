import hideElement from "../hideElement";

describe("hideElement", () => {
  it("hides an element with an important display rule", () => {
    const element = document.createElement("div");

    hideElement(element);

    expect([element.style.display, element.style.getPropertyPriority("display")]).toEqual(
      ["none", "important"],
    );
  });

  it.each([undefined, null])("accepts an absent element value of %s", (element) => {
    expect(() => {
      hideElement(element);
    }).not.toThrow();
  });
});
