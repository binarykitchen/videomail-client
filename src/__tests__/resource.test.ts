import Resource from "../resource";
import mergeWithDefaultOptions from "../util/options/mergeWithDefaultOptions";

describe("resource class", () => {
  it("constructor with default options can be instantiated", () => {
    expect(() => {
      const defaultOptions = mergeWithDefaultOptions();
      new Resource(defaultOptions);
    }).not.toThrow();
  });
});
