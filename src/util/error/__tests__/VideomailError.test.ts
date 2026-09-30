import mergeWithDefaultOptions from "../../options/mergeWithDefaultOptions";
import VideomailError from "../VideomailError";

describe("videomailError class", () => {
  it("a simple error can be constructed", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const error = new VideomailError("i am error", defaultOptions);

    expect({
      classList: error.getClassList(),
      explanation: error.explanation,
      isError: error instanceof Error,
      isVideomailError: error instanceof VideomailError,
      message: error.message,
    }).toEqual({
      classList: undefined,
      explanation: undefined,
      isError: true,
      isVideomailError: true,
      message: "i am error",
    });
  });

  it("an explanation can be passed over", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const error = new VideomailError(
      "i am error with explanation",
      defaultOptions,
      undefined,
      { explanation: "i am explanation" },
    );

    expect(error).toMatchObject({
      explanation: "i am explanation",
      message: "i am error with explanation",
    });
  });
});
