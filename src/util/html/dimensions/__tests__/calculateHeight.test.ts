import mergeWithDefaultOptions from "../../../options/mergeWithDefaultOptions";
import calculateHeight from "../calculateHeight";

describe("calculateHeight", () => {
  it("calculates a pixel height from the supplied width and ratio", () => {
    const options = mergeWithDefaultOptions();

    expect(calculateHeight(false, 640, options, 0.75)).toEqual({
      unit: "px",
      value: 480,
    });
  });

  it("limits the calculated height to the configured video height", () => {
    const options = mergeWithDefaultOptions({ video: { height: 300 } });

    expect(calculateHeight(false, 640, options, 0.75)).toEqual({
      unit: "px",
      value: 300,
    });
  });

  it("uses the element width for responsive video dimensions", () => {
    const options = mergeWithDefaultOptions();
    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
      bottom: 0,
      height: 0,
      left: 0,
      right: 320,
      top: 0,
      width: 320,
      x: 0,
      y: 0,
      toJSON: () => undefined,
    });

    expect(calculateHeight(true, 640, options, 0.75, element)).toEqual({
      unit: "px",
      value: 240,
    });
  });
});
