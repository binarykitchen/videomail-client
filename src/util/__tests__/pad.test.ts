import pad from "../pad";

describe("pad", () => {
  it("should pad single digit numbers with leading zero", () => {
    expect(pad(0)).toBe("00");
    expect(pad(1)).toBe("01");
    expect(pad(9)).toBe("09");
  });

  it("should convert double digit numbers to strings", () => {
    expect(pad(10)).toBe("10");
    expect(pad(42)).toBe("42");
    expect(pad(99)).toBe("99");
  });

  it("should handle larger numbers as strings", () => {
    expect(pad(100)).toBe("100");
    expect(pad(999)).toBe("999");
  });

  it("should handle negative numbers", () => {
    expect(pad(-1)).toBe("-01");
    expect(pad(-9)).toBe("-09");
    expect(pad(-10)).toBe("-10");
  });
});
