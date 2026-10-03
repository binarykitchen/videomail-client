import mergeWithDefaultOptions from "../../../options/mergeWithDefaultOptions";
import figureMinHeight from "../figureMinHeight";

describe("figureMinHeight", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses the smaller supplied height", () => {
    const options = mergeWithDefaultOptions({ video: { height: 480 } });

    expect(figureMinHeight(360, options)).toBe(360);
  });

  it("uses the configured height when it is smaller", () => {
    const options = mergeWithDefaultOptions({ video: { height: 480 } });

    expect(figureMinHeight(720, options)).toBe(480);
  });

  it("uses the configured height when no height is supplied", () => {
    const options = mergeWithDefaultOptions({ video: { height: 480 } });

    expect(figureMinHeight(undefined, options)).toBe(480);
  });

  it("preserves a supplied height when no height is configured", () => {
    const options = mergeWithDefaultOptions();

    expect(figureMinHeight(360, options)).toBe(360);
  });

  it("rejects a configured height smaller than one pixel", () => {
    const options = mergeWithDefaultOptions({ video: { height: -1 } });

    expect(() => figureMinHeight(undefined, options)).toThrow(
      "Got a min height less than 1 (-1)!",
    );
  });
});
