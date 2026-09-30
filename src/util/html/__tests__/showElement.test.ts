import showElement from "../showElement";

describe("showElement", () => {
  it("removes an inline display rule", () => {
    const element = document.createElement("div");
    element.style.setProperty("display", "none", "important");

    showElement(element);

    expect(element.style.getPropertyValue("display")).toBe("");
  });

  it.each([undefined, null])("accepts an absent element value of %s", (element) => {
    expect(() => {
      showElement(element);
    }).not.toThrow();
  });
});
