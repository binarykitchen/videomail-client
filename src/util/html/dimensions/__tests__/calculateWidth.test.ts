import Resource from "../../../../resource";
import mergeWithDefaultOptions from "../../../options/mergeWithDefaultOptions";
import calculateWidth from "../calculateWidth";

describe("calculateWidth", () => {
  beforeEach(() => {
    vi.spyOn(Resource.prototype, "reportError").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calculates a pixel width from the supplied height and ratio", () => {
    const options = mergeWithDefaultOptions();

    expect(calculateWidth(false, options, 480, 0.75)).toEqual({
      unit: "px",
      value: 640,
    });
  });

  it("limits responsive dimensions to the viewport height", () => {
    const options = mergeWithDefaultOptions();
    vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(300);

    expect(calculateWidth(true, options, 480, 0.75)).toEqual({
      unit: "px",
      value: 400,
    });
  });

  it("rejects a missing height", () => {
    const options = mergeWithDefaultOptions();

    expect(() => calculateWidth(false, options)).toThrow(
      "Height undefined cannot be smaller than 1 when calculating width.",
    );
  });

  it("rejects a calculated width smaller than one pixel", () => {
    const options = mergeWithDefaultOptions();

    expect(() => calculateWidth(false, options, 1, 3)).toThrow(
      "Calculated width cannot be smaller than 1!",
    );
  });
});
