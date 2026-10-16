import superagent from "superagent";

import Resource from "../resource";
import CollectLogger from "../util/CollectLogger";
import VideomailError from "../util/error/VideomailError";
import mergeWithDefaultOptions from "../util/options/mergeWithDefaultOptions";

const { reportRequest } = vi.hoisted(() => {
  vi.resetModules();

  return {
    reportRequest: {
      query: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      withCredentials: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      timeout: vi.fn().mockResolvedValue(undefined),
    },
  };
});

vi.mock("superagent", () => ({ default: vi.fn(() => reportRequest) }));

const ORIGINAL_LOCATION = window.location.href;

function createReportFixture() {
  const options = mergeWithDefaultOptions({ reportErrors: false });
  const resource = new Resource(options);
  const error = new VideomailError("Recording failed", options);

  return { resource, options, error };
}

describe("Resource class", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    window.history.replaceState(null, "", ORIGINAL_LOCATION);
  });

  it("constructor with default options can be instantiated", () => {
    expect(() => {
      const defaultOptions = mergeWithDefaultOptions();
      new Resource(defaultOptions);
    }).not.toThrow();
  });

  it("does not read host cookies while constructing errors", () => {
    const readCookies = vi
      .spyOn(document, "cookie", "get")
      .mockReturnValue("session=synthetic-session-secret");

    new VideomailError("Example error", mergeWithDefaultOptions());

    expect(readCookies).not.toHaveBeenCalled();
  });

  it("removes synthetic secrets from the outgoing report", async () => {
    window.history.replaceState(
      null,
      "",
      "/record?token=page-token-secret#page-fragment-secret",
    );
    const { resource, error } = createReportFixture();
    const secrets = [
      "page-token-secret",
      "page-fragment-secret",
      "cookie-secret",
      "authorization-secret",
      "password-secret",
      "csrf-secret",
      "nested-token-secret",
      "subject-secret",
      "body-secret",
      "private-signer@example.com",
      "url-user-secret",
      "url-password-secret",
      "url-query-secret",
      "url-fragment-secret",
      "log-token-secret",
      "log-body-secret",
    ];

    error.cause = {
      headers: {
        Cookie: "session=cookie-secret",
        Authorization: "Bearer authorization-secret",
      },
      payload: {
        password: "password-secret",
        csrf_token: "csrf-secret",
        subject: "subject-secret",
        body: "body-secret",
        from: "private-signer@example.com",
        nested: [{ accessToken: "nested-token-secret" }],
      },
      url: "https://url-user-secret:url-password-secret@example.com/api?token=url-query-secret#url-fragment-secret",
    };
    error.err = new Error(
      "Request failed at https://example.com/api?token=url-query-secret",
      {
        cause: { password: "password-secret", access_token: "nested-token-secret" },
      },
    );
    error.logLines = [
      "[debug] Received { token: 'log-token-secret', body: 'log-body-secret', frames: 18 }",
      '[debug] {"Authorization":"Bearer authorization-secret","from":"private-signer@example.com"}',
    ];

    await resource.reportError(error);

    const outgoing = JSON.stringify(reportRequest.send.mock.lastCall?.[0]);

    expect(secrets.filter((secret) => outgoing.includes(secret))).toEqual([]);
  });

  it.each([
    "sessionToken",
    "X-CSRF-Token",
    "X-XSRF-Token",
    "X-API-Key",
    "Proxy-Authorization",
    "Set-Cookie",
    "client_secret",
    "email",
  ])("redacts the private field %s in nested data and logs", async (field) => {
    const { resource, error } = createReportFixture();
    error.cause = { payload: { [field]: "synthetic-private-value", frames: 18 } };
    error.logLines = [`[debug] { '${field}': 'synthetic-private-value', frames: 18 }`];

    await resource.reportError(error);

    expect(reportRequest.send).toHaveBeenCalledWith(
      expect.objectContaining({
        cause: { payload: { [field]: "[redacted]", frames: 18 } },
        logLines: [`[debug] { '${field}': [redacted], frames: 18 }`],
      }),
    );
  });

  it("keeps the page origin and path and strips secrets from relative request URLs", async () => {
    window.history.replaceState(null, "", "/record?token=page-secret#fragment-secret");
    const { resource, error } = createReportFixture();
    error.cause = { url: "/api/videomail?key=request-secret#request-fragment" };

    await resource.reportError(error);

    expect(reportRequest.send).toHaveBeenCalledWith(
      expect.objectContaining({
        location: `${window.location.origin}/record`,
        cause: { url: `${window.location.origin}/api/videomail` },
      }),
    );
  });

  it("filters debug lines collected when verbose output is disabled", async () => {
    const { resource, options, error } = createReportFixture();
    const logger = new CollectLogger({ ...options, verbose: false });
    logger.debug(
      "payload: { body: 'private message', from: 'signer@example.com', frames: 18 }",
    );
    error.logLines = logger.getLines();

    await resource.reportError(error);

    expect(reportRequest.send).toHaveBeenCalledWith(
      expect.objectContaining({
        logLines: ["[debug] payload: { body: [redacted], from: [redacted], frames: 18 }"],
      }),
    );
  });

  it("keeps structured server response bodies for diagnosis", async () => {
    const { resource, error } = createReportFixture();
    error.cause = {
      response: {
        body: { code: "ENCODING_FAILED", message: "Encoder unavailable", frames: 18 },
      },
    };

    await resource.reportError(error);

    expect(reportRequest.send).toHaveBeenCalledWith(
      expect.objectContaining({
        cause: {
          response: {
            body: { code: "ENCODING_FAILED", message: "Encoder unavailable", frames: 18 },
          },
        },
      }),
    );
  });

  it("preserves device labels, device IDs, constraints and useful payload fields", async () => {
    const device = {
      deviceId: "camera-device-id",
      groupId: "camera-group-id",
      kind: "videoinput",
      label: "Logitech BRIO",
    };
    const supportedConstraints = { width: true, height: true, deviceId: true };
    vi.stubGlobal("navigator", {
      userAgent: navigator.userAgent,
      mediaDevices: {
        getSupportedConstraints: vi.fn(() => supportedConstraints),
        enumerateDevices: vi.fn().mockResolvedValue([{ toJSON: () => device }]),
      },
    });
    const { resource, error } = createReportFixture();
    error.usedConstraints = {
      video: { deviceId: { exact: device.deviceId }, width: 400 },
    };
    error.cause = { payload: { frames: 18, width: 400, height: 300 }, status: 503 };
    error.logLines = ["[debug] Captured 18 frames with Logitech BRIO"];
    error.stack =
      "Error: Recording failed\n    at record (https://example.com/client.js?token=secret:12:4)";

    await resource.reportError(error);

    expect(reportRequest.send).toHaveBeenCalledWith(
      expect.objectContaining({
        browser: error.browser,
        os: error.os,
        screen: error.screen,
        cause: { payload: { frames: 18, width: 400, height: 300 }, status: 503 },
        logLines: error.logLines,
        supportedConstraints,
        usedConstraints: error.usedConstraints,
        enumerateDevices: [device],
        stack:
          "Error: Recording failed\n    at record (https://example.com/client.js:12:4)",
      }),
    );
  });

  it("does not mutate the original error or locally collected logs", async () => {
    const { resource, error } = createReportFixture();
    const cause = { token: "local-token", payload: { body: "Local message" } };
    const logLines = ["[debug] token=local-token"];
    error.cause = cause;
    error.logLines = logLines;

    await resource.reportError(error);

    expect({ cause: error.cause, logLines: error.logLines }).toEqual({
      cause: { token: "local-token", payload: { body: "Local message" } },
      logLines: ["[debug] token=local-token"],
    });
  });

  it("reports errors even when media-device enumeration is denied", async () => {
    vi.stubGlobal("navigator", {
      userAgent: navigator.userAgent,
      mediaDevices: {
        getSupportedConstraints: vi.fn(() => ({ width: true })),
        enumerateDevices: vi.fn().mockRejectedValue(new Error("Permission denied")),
      },
    });
    const { resource, error } = createReportFixture();

    await resource.reportError(error);

    expect(reportRequest.send).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Recording failed" }),
    );
  });

  it("handles circular nested error data without dropping the report", async () => {
    const { resource, error } = createReportFixture();
    const cause: { status: number; self?: unknown } = { status: 503 };
    cause.self = cause;
    error.cause = cause;

    await resource.reportError(error);

    expect(reportRequest.send).toHaveBeenCalledWith(
      expect.objectContaining({ cause: { status: 503, self: "[Circular]" } }),
    );
  });

  it("keeps using the configured client-error endpoint", async () => {
    const { resource, options, error } = createReportFixture();

    await resource.reportError(error);

    expect(superagent).toHaveBeenCalledWith("post", `${options.apiUrl}/client-error/`);
  });

  it("rejects an update without a videomail key", async () => {
    const defaultOptions = mergeWithDefaultOptions({ reportErrors: false });
    const resource = new Resource(defaultOptions);

    await expect(resource.put({})).rejects.toThrow(
      "A videomail key is required when updating a videomail.",
    );
  });
});
