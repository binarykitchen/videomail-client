import Resource from "../resource";
import mergeWithDefaultOptions from "../util/options/mergeWithDefaultOptions";

describe("Resource", () => {
  test("Constructor with default options can be instantiated", () => {
    const defaultOptions = mergeWithDefaultOptions();
    new Resource(defaultOptions);
  });
});
