import mergeWithDefaultOptions from "../../options/mergeWithDefaultOptions";
import createError from "../createError";
import VideomailError from "../VideomailError";

describe("createError fn", () => {
  it("a default videomail error can be created", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const error = createError({ options: defaultOptions });

    expect(error.message).toBe("(undefined message)");
    expect(error.explanation).toBeUndefined();
  });

  it("a videomail error with a custom message and explanation can be created", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const error = createError({
      options: defaultOptions,
      message: "i am message",
      explanation: "i am explanation",
    });

    expect(error.message).toBe("i am message");
    expect(error.explanation).toBe("i am explanation");
  });

  it("a videomail error does not re-create a videomail error", () => {
    const defaultOptions = mergeWithDefaultOptions();
    const error = createError({
      options: defaultOptions,
      err: new VideomailError("i am another message", defaultOptions),
    });

    expect(error.message).toBe("i am another message");
    expect(error.explanation).toBeUndefined();
  });
});
