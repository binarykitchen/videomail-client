import mergeWithDefaultOptions from "../../options/mergeWithDefaultOptions";
import createError from "../createError";
import VideomailError from "../VideomailError";

describe("createError", () => {
  test("a default videomail error can be created", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const error = createError({ options: defaultOptions });

    expect(error.message).toBe("(undefined message)");
    expect(error.explanation).toBeUndefined();
  });

  test("a videomail error with a custom message and explanation can be created", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const error = createError({
      options: defaultOptions,
      message: "i am message",
      explanation: "i am explanation",
    });

    expect(error.message).toEqual("i am message");
    expect(error.explanation).toEqual("i am explanation");
  });

  test("a videomail error does not re-create a videomail error", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const error = createError({
      options: defaultOptions,
      err: new VideomailError("i am another message", defaultOptions),
    });

    expect(error.message).toEqual("i am another message");
    expect(error.explanation).toBeUndefined();
  });
});
