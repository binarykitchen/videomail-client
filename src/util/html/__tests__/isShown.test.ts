import isShown from "../isShown";

describe("isShown", () => {
  it.each([undefined, null])(
    "treats an absent element value of %s as not shown",
    (element) => {
      expect(isShown(element)).toBe(false);
    },
  );

  it("identifies an element with display none as not shown", () => {
    const element = document.createElement("div");
    element.style.display = "none";

    expect(isShown(element)).toBe(false);
  });

  it("identifies a visible element as shown", () => {
    const element = document.createElement("div");
    element.style.display = "block";

    expect(isShown(element)).toBe(true);
  });
});
