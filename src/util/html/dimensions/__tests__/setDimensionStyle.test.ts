import setDimensionStyle from "../setDimensionStyle";

describe("setDimensionStyle", () => {
  it("applies a size with its unit", () => {
    const element = document.createElement("div");

    setDimensionStyle(element, "width", { unit: "px", value: 320 });

    expect(element.style.width).toBe("320px");
  });

  it("removes the inline size when the dimension has no value", () => {
    const element = document.createElement("div");
    element.style.height = "240px";

    setDimensionStyle(element, "height", { unit: "px", value: undefined });

    expect(element.style.height).toBe("");
  });
});
