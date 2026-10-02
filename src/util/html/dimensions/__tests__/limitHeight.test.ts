import Resource from "../../../../resource";
import mergeWithDefaultOptions from "../../../options/mergeWithDefaultOptions";
import limitHeight from "../limitHeight";

describe("limitHeight", () => {
  beforeEach(() => {
    vi.spyOn(Resource.prototype, "reportError").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps a height smaller than the viewport", () => {
    const options = mergeWithDefaultOptions();
    vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(800);

    expect(limitHeight(600, options, "test")).toEqual({
      unit: "px",
      value: 600,
    });
  });

  it("limits a height to the viewport", () => {
    const options = mergeWithDefaultOptions();
    vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(600);

    expect(limitHeight(800, options, "test")).toEqual({
      unit: "px",
      value: 600,
    });
  });

  it("uses the viewport when no height is supplied", () => {
    const options = mergeWithDefaultOptions();
    vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(600);

    expect(limitHeight(undefined, options, "test")).toEqual({
      unit: "px",
      value: 600,
    });
  });

  it("rejects a viewport height smaller than one pixel", () => {
    const options = mergeWithDefaultOptions();
    vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(0);

    expect(() => limitHeight(undefined, options, "unit test")).toThrow(
      "Limited height 0 cannot be less than 1! (Called from unit test)",
    );
  });
});
