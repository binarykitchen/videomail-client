import { UAParser } from "ua-parser-js";

import type { FullVideomailErrorData } from "../../../types/error";
import sanitizeErrorReport from "../sanitizeErrorReport";

const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";

function createReport(overrides?: Partial<FullVideomailErrorData>) {
  const parser = new UAParser(USER_AGENT);
  const report: FullVideomailErrorData = {
    browser: parser.getBrowser(),
    engine: parser.getEngine(),
    location: "https://www.videomail.io/record?token=page-secret#preview",
    message: "Recording failed",
    screen: "1920x1080x24",
    title: "Videomail error",
    ...overrides,
  };

  return report;
}

describe("sanitizeErrorReport", () => {
  it("preserves diagnostic metadata and the page origin and path", () => {
    const report = createReport({ whitelistKey: "videomail-client-demo", status: 503 });

    expect(sanitizeErrorReport(report)).toMatchObject({
      browser: { name: "Chrome", version: "140.0.0.0" },
      engine: { name: "Blink" },
      location: "https://www.videomail.io/record",
      message: report.message,
      screen: report.screen,
      title: report.title,
      whitelistKey: "videomail-client-demo",
      status: 503,
    });
  });

  it.each([
    "Cookie",
    "Set-Cookie",
    "Authorization",
    "Proxy-Authorization",
    "password",
    "client_secret",
    "accessToken",
    "sessionToken",
    "X-CSRF-Token",
    "X-XSRF-Token",
    "X-API-Key",
    "email",
    "to",
    "bcc",
  ])("redacts %s in nested payloads and logs", (field) => {
    const report = createReport({
      cause: { payload: [{ [field]: "private-value", frames: 18 }] },
      logLines: [`[debug] { '${field}': 'private-value', frames: 18 }`],
    });

    expect(sanitizeErrorReport(report)).toMatchObject({
      cause: { payload: [{ [field]: "[redacted]", frames: 18 }] },
      logLines: [`[debug] { '${field}': [redacted], frames: 18 }`],
    });
  });

  it("redacts whole private values regardless of their runtime type", () => {
    const report = createReport({
      cause: {
        token: { value: "secret", valid: true },
        recipients: ["one@example.com", "two@example.com"],
        session: 12345,
      },
    });

    expect(sanitizeErrorReport(report)).toMatchObject({
      cause: { token: "[redacted]", recipients: "[redacted]", session: "[redacted]" },
    });
  });

  it("redacts private message strings but keeps structured server response bodies", () => {
    const report = createReport({
      cause: {
        payload: { subject: "Private subject", body: "Private message" },
        response: { body: { code: "ENCODING_FAILED", frames: 18 } },
      },
    });

    expect(sanitizeErrorReport(report)).toMatchObject({
      cause: {
        payload: { subject: "[redacted]", body: "[redacted]" },
        response: { body: { code: "ENCODING_FAILED", frames: 18 } },
      },
    });
  });

  it.each([
    ["/api/videomail?token=secret#preview", "https://www.videomail.io/api/videomail"],
    [
      "https://user:password@example.com/api?token=secret#preview",
      "https://example.com/api",
    ],
    ["wss://example.com/socket?token=secret#preview", "wss://example.com/socket"],
    ["https://[invalid?token=secret", "[redacted]"],
  ])("sanitizes the request URL %s", (url, expected) => {
    expect(sanitizeErrorReport(createReport({ cause: { url } }))).toMatchObject({
      cause: { url: expected },
    });
  });

  it("retains stack positions when stripping URL tokens", () => {
    const report = createReport({
      stack:
        "Error: Recording failed\n    at record (https://example.com/client.js?token=secret:12:4)",
    });

    expect(sanitizeErrorReport(report)).toMatchObject({
      stack:
        "Error: Recording failed\n    at record (https://example.com/client.js:12:4)",
    });
  });

  it("redacts quoted JSON fields, authorization values and addresses in free text", () => {
    const report = createReport({
      logLines: [
        '[debug] {"body":"A private \\"quoted\\" message","frames":18}',
        "[debug] Authorization: Bearer private-token",
        "[debug] Request for signer@example.com failed",
      ],
    });

    expect(sanitizeErrorReport(report)).toMatchObject({
      logLines: [
        '[debug] {"body":[redacted],"frames":18}',
        "[debug] Authorization: [redacted]",
        "[debug] Request for [redacted] failed",
      ],
    });
  });

  it("retains nested error details while filtering their causes", () => {
    const error = new Error("Encoder unavailable", { cause: { token: "nested-secret" } });

    expect(sanitizeErrorReport(createReport({ cause: error }))).toMatchObject({
      cause: {
        name: "Error",
        message: "Encoder unavailable",
        stack: expect.any(String),
        cause: { token: "[redacted]" },
      },
    });
  });

  it("preserves device labels and identifiers exposed by toJSON", () => {
    const device: MediaDeviceInfo = {
      deviceId: "camera-id",
      groupId: "camera-group",
      kind: "videoinput",
      label: "Logitech BRIO",
      toJSON() {
        return {
          deviceId: this.deviceId,
          groupId: this.groupId,
          kind: this.kind,
          label: this.label,
        };
      },
    };
    const report = createReport({
      enumerateDevices: [device],
      usedConstraints: { video: { deviceId: { exact: device.deviceId }, width: 400 } },
    });

    expect(sanitizeErrorReport(report)).toMatchObject({
      enumerateDevices: [
        {
          deviceId: "camera-id",
          groupId: "camera-group",
          kind: "videoinput",
          label: "Logitech BRIO",
        },
      ],
      usedConstraints: report.usedConstraints,
    });
  });

  it("preserves circular-reference diagnostics", () => {
    const cause: Record<string, unknown> = { frames: 18, token: "secret" };
    cause.self = cause;

    expect(sanitizeErrorReport(createReport({ cause }))).toMatchObject({
      cause: { frames: 18, token: "[redacted]", self: "[Circular]" },
    });
  });

  it("does not mutate frozen inputs or their nested diagnostics", () => {
    const report = createReport({
      cause: Object.freeze({ token: "local-secret", frames: 18 }),
      logLines: ["[debug] token=local-secret"],
    });
    Object.freeze(report.logLines);
    Object.freeze(report);

    sanitizeErrorReport(report);

    expect(report).toEqual({
      ...report,
      cause: { token: "local-secret", frames: 18 },
      logLines: ["[debug] token=local-secret"],
    });
  });

  it.each([null, false, 0, "invalid"])(
    "rejects a report whose custom toJSON returns %s",
    (value) => {
      const report = Object.assign(createReport(), { toJSON: () => value });

      expect(() => sanitizeErrorReport(report)).toThrow(
        "An error report must serialize to an object.",
      );
    },
  );
});
