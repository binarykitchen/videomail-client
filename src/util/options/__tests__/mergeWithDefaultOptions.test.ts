import defaultOptions from "../../../options";
import CollectLogger from "../../CollectLogger";
import mergeWithDefaultOptions from "../mergeWithDefaultOptions";

describe("mergeWithDefaultOptions", () => {
  it("returns the default values when no overrides are supplied", () => {
    const options = mergeWithDefaultOptions();

    expect(options.selectors.containerClass).toBe("videomail");
  });

  it("deeply merges nested overrides with their defaults", () => {
    const options = mergeWithDefaultOptions({ video: { height: 480 } });

    expect({ height: options.video.height, fps: options.video.fps }).toEqual({
      height: 480,
      fps: 15,
    });
  });

  it("replaces default arrays with supplied arrays", () => {
    const options = mergeWithDefaultOptions({ image: { types: ["jpeg"] } });

    expect(options.image.types).toEqual(["jpeg"]);
  });

  it("wraps the configured logger with a collecting logger", () => {
    const options = mergeWithDefaultOptions();

    expect(options.logger).toBeInstanceOf(CollectLogger);
  });

  it("disables verbose logging in the test environment", () => {
    const options = mergeWithDefaultOptions({ verbose: true });

    expect(options.verbose).toBe(false);
  });

  it("does not mutate default option arrays", () => {
    mergeWithDefaultOptions({ image: { types: ["jpeg"] } });

    expect(defaultOptions.image.types).toEqual(["webp", "jpeg"]);
  });
});
