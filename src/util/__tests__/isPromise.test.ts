import isPromise from "../isPromise";

describe("isPromise", () => {
  it("should return true for a Promise instance", () => {
    const promise = new Promise((resolve) => {
      resolve(true);
    });
    expect(isPromise(promise)).toBe(true);
  });

  it("should return true for a Promise.resolve()", () => {
    const promise = Promise.resolve("test");
    expect(isPromise(promise)).toBe(true);
  });

  it("should return false for null", () => {
    expect(isPromise(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isPromise(undefined)).toBe(false);
  });

  it("should return false for non-promise objects", () => {
    expect(isPromise({})).toBe(false);
    expect(isPromise({ then: () => {} })).toBe(false);
    expect(isPromise([])).toBe(false);
    expect(isPromise(42)).toBe(false);
    expect(isPromise("string")).toBe(false);
  });

  it("should return false when Promise is undefined", () => {
    const originalPromise = global.Promise;
    global.Promise = undefined as any;

    expect(isPromise({})).toBe(false);

    global.Promise = originalPromise;
  });
});
