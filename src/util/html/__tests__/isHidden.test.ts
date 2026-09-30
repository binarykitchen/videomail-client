import isHidden from "../isHidden";

describe("isHidden", () => {
  it.each([undefined, null])(
    "treats an absent element value of %s as hidden",
    (element) => {
      expect(isHidden(element)).toBe(true);
    },
  );

  it("identifies an element with display none as hidden", () => {
    const element = document.createElement("div");
    element.style.display = "none";

    expect(isHidden(element)).toBe(true);
  });

  it("does not identify a visible element as hidden", () => {
    const element = document.createElement("div");
    element.style.display = "block";

    expect(isHidden(element)).toBe(false);
  });
});
