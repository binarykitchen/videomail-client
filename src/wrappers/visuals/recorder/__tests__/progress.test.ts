import mergeWithDefaultOptions from "../../../../util/options/mergeWithDefaultOptions";
import { calculateProgress, getConfirmedProgressNumber } from "../progress";

describe("calculateProgress", () => {
  it("formats progress to two decimal places", () => {
    expect(calculateProgress(1, 3)).toBe("33.33%");
  });

  it("starts at zero when no items have been recorded", () => {
    expect(calculateProgress(0, 0)).toBe("0.00%");
  });
});

describe("getConfirmedProgressNumber", () => {
  it("reads a confirmed frame number", () => {
    expect(
      getConfirmedProgressNumber({
        args: { frame: 7 },
        kind: "frame",
        options: mergeWithDefaultOptions(),
      }),
    ).toBe(7);
  });

  it("rejects commands without a confirmed sample number", () => {
    expect(() =>
      getConfirmedProgressNumber({
        args: {},
        kind: "sample",
        options: mergeWithDefaultOptions(),
      }),
    ).toThrow("The audio sample number is missing");
  });
});
