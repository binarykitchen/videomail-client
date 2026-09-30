import mergeWithDefaultOptions from "../../../options/mergeWithDefaultOptions";
import limitWidth from "../limitWidth";

function createRect(width: number): DOMRect {
  return {
    bottom: 0,
    height: 0,
    left: 0,
    right: width,
    top: 0,
    width,
    x: 0,
    y: 0,
    toJSON: () => undefined,
  };
}

describe("limitWidth", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("limits a width to the element width", () => {
    const options = mergeWithDefaultOptions();
    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(createRect(320));

    expect(limitWidth(element, options, 640)).toEqual({ unit: "px", value: 320 });
  });

  it("keeps a width smaller than the element width", () => {
    const options = mergeWithDefaultOptions();
    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(createRect(800));

    expect(limitWidth(element, options, 640)).toEqual({ unit: "px", value: 640 });
  });

  it("uses the element width when no width is supplied", () => {
    const options = mergeWithDefaultOptions();
    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(createRect(320));

    expect(limitWidth(element, options)).toEqual({ unit: "px", value: 320 });
  });

  it("rejects an unmeasurable width", () => {
    const options = mergeWithDefaultOptions();
    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(createRect(0));
    vi.spyOn(document.body, "getBoundingClientRect").mockReturnValue(createRect(0));

    expect(() => limitWidth(element, options)).toThrow(
      "Limited width cannot be less than 1!",
    );
  });
});
