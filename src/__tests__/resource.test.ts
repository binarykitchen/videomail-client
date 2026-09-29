import Resource from "../resource";
import mergeWithDefaultOptions from "../util/options/mergeWithDefaultOptions";

describe("Resource class", () => {
  it("constructor with default options can be instantiated", () => {
    expect(() => {
      const defaultOptions = mergeWithDefaultOptions();
      new Resource(defaultOptions);
    }).not.toThrow();
  });

  it("rejects an update without a videomail key", async () => {
    const defaultOptions = mergeWithDefaultOptions({ reportErrors: false });
    const resource = new Resource(defaultOptions);

    await expect(resource.put({})).rejects.toThrow(
      "A videomail key is required when updating a videomail.",
    );
  });
});
