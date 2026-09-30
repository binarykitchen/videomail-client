import getOuterWidth from "../getOuterWidth";

function createRect(left: number, right: number): DOMRect {
  return {
    bottom: 0,
    height: 0,
    left,
    right,
    top: 0,
    width: right - left,
    x: left,
    y: 0,
    toJSON: () => undefined,
  };
}

describe("getOuterWidth", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the element bounding width", () => {
    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(createRect(10, 330));

    expect(getOuterWidth(element)).toBe(320);
  });

  it("falls back to the body width for an unmeasured element", () => {
    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(createRect(0, 0));
    vi.spyOn(document.body, "getBoundingClientRect").mockReturnValue(createRect(0, 640));

    expect(getOuterWidth(element)).toBe(640);
  });
});
