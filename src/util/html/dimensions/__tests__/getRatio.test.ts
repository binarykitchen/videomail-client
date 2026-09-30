import mergeWithDefaultOptions from "../../../options/mergeWithDefaultOptions";
import getRatio from "../getRatio";

describe("getRatio", () => {
  it("returns a square ratio when no dimensions are available", () => {
    const options = mergeWithDefaultOptions();

    expect(getRatio(options)).toBe(1);
  });

  it("uses configured video dimensions", () => {
    const options = mergeWithDefaultOptions({
      video: { height: 480, width: 640 },
    });

    expect(getRatio(options)).toBe(0.75);
  });

  it("uses smaller source video dimensions", () => {
    const options = mergeWithDefaultOptions({
      video: { height: 480, width: 640 },
    });

    expect(getRatio(options, 240, 320)).toBe(0.75);
  });

  it("prefers configured dimensions for a larger source video", () => {
    const options = mergeWithDefaultOptions({
      video: { height: 300, width: 400 },
    });

    expect(getRatio(options, 1080, 1920)).toBe(0.75);
  });

  it("uses source dimensions when no dimensions are configured", () => {
    const options = mergeWithDefaultOptions();

    expect(getRatio(options, 720, 1280)).toBe(0.5625);
  });
});
