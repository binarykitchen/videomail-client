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

  it.each([
    { description: "a missing response", response: undefined },
    { description: "a null response", response: null },
    { description: "a non-object response", response: "Bad gateway" },
    { description: "a missing response body", response: {} },
    { description: "an empty response body", response: { body: null } },
    {
      description: "an HTML response body",
      response: { body: "<h1>Bad gateway</h1>" },
    },
    { description: "a null server error", response: { body: { error: null } } },
    {
      description: "a non-object server error",
      response: { body: { error: "Bad gateway" } },
    },
    {
      description: "a missing server message",
      response: { body: { error: { status: 502 } } },
    },
    {
      description: "an invalid server message",
      response: { body: { error: { message: 502 } } },
    },
  ])("preserves the original request failure for $description", ({ response }) => {
    const original = Object.assign(new Error("Bad gateway"), { response, status: 502 });

    expect(findOriginalExc(original)).toBe(original);
  });

  it("ignores invalid optional fields in an otherwise usable server error", () => {
    const original = Object.assign(new Error("request failed"), {
      response: {
        body: {
          error: {
            code: 502,
            explanation: ["Unavailable"],
            message: "Bad gateway",
            name: 502,
            stack: {},
            status: "502",
          },
        },
      },
    });

    expect(findOriginalExc(original)).toMatchObject({
      code: undefined,
      explanation: undefined,
      message: "Bad gateway",
      name: "VideomailError",
      stack: expect.any(String),
      status: undefined,
    });
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
