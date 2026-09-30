import useFullWidth from "../useFullWidth";

describe("useFullWidth", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns no dimension when no breakpoint is configured", () => {
    expect(useFullWidth()).toBeUndefined();
  });

  it("returns a full-width percentage below the breakpoint", () => {
    vi.stubGlobal("innerWidth", 479);

    expect(useFullWidth(480)).toEqual({ unit: "%", value: 100 });
  });

  it("returns no dimension at the breakpoint", () => {
    vi.stubGlobal("innerWidth", 480);

    expect(useFullWidth(480)).toBeUndefined();
  });
});
