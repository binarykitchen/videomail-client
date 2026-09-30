import isNotButton from "../isNotButton";

describe("isNotButton", () => {
  it.each([
    ["button", undefined, false],
    ["input", "submit", false],
    ["input", "button", true],
    ["div", undefined, true],
  ])("returns %s for a %s element with type %s", (tagName, type, expected) => {
    const element = document.createElement(tagName);
    if (type) {
      element.setAttribute("type", type);
    }

    expect(isNotButton(element)).toBe(expected);
  });
});
