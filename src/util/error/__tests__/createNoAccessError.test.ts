import mergeWithDefaultOptions from "../../options/mergeWithDefaultOptions";
import createNoAccessError from "../createNoAccessError";

describe("createNoAccessError fn", () => {
  it("explains that the system blocks webcam access", () => {
    const options = mergeWithDefaultOptions({ reportErrors: false });

    expect(createNoAccessError(options)).toMatchObject({
      explanation: "Your system does not let your browser access your webcam",
      message: "Unable to access webcam",
    });
  });
});
