import { describe, expect, test } from "vitest";

import getAutomationSignals from "../getAutomationSignals";
import isAutomatedUserAgent from "../isAutomatedUserAgent";

describe("isAutomatedUserAgent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  test.each([true, false])(
    "keeps webdriver=%s distinct from user-agent detection",
    (webdriver) => {
      vi.stubGlobal("navigator", {
        userAgent: "Mozilla/5.0 Chrome/156.0.0.0",
        webdriver,
      });

      expect(getAutomationSignals()).toEqual({ webdriver, userAgentMatched: false });
    },
  );
});
