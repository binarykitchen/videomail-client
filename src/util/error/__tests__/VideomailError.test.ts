import mergeWithDefaultOptions from "../../options/mergeWithDefaultOptions";
import VideomailError from "../VideomailError";

describe("videomailError class", () => {
  it("a simple error can be constructed", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const error = new VideomailError("i am error", defaultOptions);

    expect(error.message).toBe("i am error");
    expect(error.explanation).toBeUndefined();
    expect(error.getClassList()).toBeUndefined();
    expect(error instanceof Error).toBe(true);
    expect(error instanceof VideomailError).toBe(true);
  });

  it("an explanation can be passed over", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const error = new VideomailError(
      "i am error with explanation",
      defaultOptions,
      undefined,
      { explanation: "i am explanation" },
    );

    expect(error.message).toBe("i am error with explanation");
    expect(error.explanation).toBe("i am explanation");
  });
});
