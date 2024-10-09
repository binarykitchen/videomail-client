import mergeWithDefaultOptions from "../../options/mergeWithDefaultOptions";
import VideomailError from "../VideomailError";

describe("VideomailError", () => {
  test("a simple error can be constructed", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const error = new VideomailError("i am error", defaultOptions);

    expect(error.message).toEqual("i am error");
    expect(error.explanation).toBeUndefined();
    expect(error.getClassList()).toBeUndefined();
    expect(error instanceof Error).toBeTruthy();
    expect(error instanceof VideomailError).toBeTruthy();
  });

  test("an explanation can be passed over", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const error = new VideomailError(
      "i am error with explanation",
      defaultOptions,
      undefined,
      { explanation: "i am explanation" },
    );

    expect(error.message).toEqual("i am error with explanation");
    expect(error.explanation).toEqual("i am explanation");
  });
});
