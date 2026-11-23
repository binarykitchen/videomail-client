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

  it("keeps a class-based logger and its prototype methods", () => {
    // Methods on a prototype, like most logging libraries have them.
    class RecordingLogger {
      public readonly lines: unknown[] = [];

      public debug(message: unknown) {
        this.lines.push(message);
      }

      public info(message: unknown) {
        this.lines.push(message);
      }

      public warn(message: unknown) {
        this.lines.push(message);
      }

      public error(message: unknown) {
        this.lines.push(message);
      }
    }
    const logger = new RecordingLogger();
    const options = mergeWithDefaultOptions({ logger });

    options.logger.error("Camera failed");

    expect(logger.lines).toEqual(["Camera failed"]);
  });
});
