import { describe, expect, test } from "vitest";

import isAutomatedUserAgent from "../isAutomatedUserAgent";

describe("isAutomatedUserAgent", () => {
  test.each([
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)",
    "Mozilla/5.0 HeadlessChrome/152.0.0.0 Safari/537.36",
  ])("detects %s", (userAgent) => {
    expect(isAutomatedUserAgent(userAgent)).toBe(true);
  });

  test("allows a regular browser", () => {
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36";

    expect(isAutomatedUserAgent(userAgent)).toBe(false);
  });
});
