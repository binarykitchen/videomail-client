import pad from "../pad";

describe("pad", () => {
  it.each([
    [0, "00"],
    [1, "01"],
    [9, "09"],
  ])("pads the single digit number %i as %s", (number, expected) => {
    expect(pad(number)).toBe(expected);
  });

  it.each([
    [10, "10"],
    [42, "42"],
    [99, "99"],
  ])("converts the double digit number %i to %s", (number, expected) => {
    expect(pad(number)).toBe(expected);
  });

  it.each([
    [100, "100"],
    [999, "999"],
  ])("converts the larger number %i to %s", (number, expected) => {
    expect(pad(number)).toBe(expected);
  });

  it.each([
    [-1, "-01"],
    [-9, "-09"],
    [-10, "-10"],
  ])("formats the negative number %i as %s", (number, expected) => {
    expect(pad(number)).toBe(expected);
  });
});
