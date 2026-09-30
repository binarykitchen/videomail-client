import findOriginalExc from "../findOriginalExc";

describe("findOriginalExc", () => {
  it("preserves a value that is not an error", () => {
    const original = { message: "request failed" };

    expect(findOriginalExc(original)).toBe(original);
  });

  it("preserves an error without a response", () => {
    const original = new Error("request failed");

    expect(findOriginalExc(original)).toBe(original);
  });

  it("preserves an error when its response has no nested error", () => {
    const original = Object.assign(new Error("request failed"), {
      response: { body: { result: "failed" } },
    });

    expect(findOriginalExc(original)).toBe(original);
  });

  it("reconstructs an HTTP error returned by the API", () => {
    const cause = new Error("database unavailable");
    const original = Object.assign(new Error("request failed"), {
      response: {
        body: {
          error: {
            cause,
            code: "INVALID_RECIPIENT",
            explanation: "Check the recipient address",
            message: "Delivery failed",
            name: "DeliveryError",
            stack: "remote stack",
            status: 422,
          },
        },
      },
    });

    expect(findOriginalExc(original)).toMatchObject({
      cause,
      code: "INVALID_RECIPIENT",
      explanation: "Check the recipient address",
      message: "Delivery failed",
      name: "DeliveryError",
      stack: "remote stack",
      status: 422,
    });
  });
});
