import { afterEach, describe, expect, test, vi } from "vitest";

import defaultOptions from "../../options";
import CollectLogger from "../CollectLogger";

describe("CollectLogger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test("keeps the newest lines within the configured limit", () => {
    const logger = new CollectLogger({
      ...defaultOptions,
      logger: {
        debug: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
      },
      logStackSize: 2,
      verbose: false,
    });

    logger.debug("first");
    logger.debug("second");
    logger.debug("diagnostic");

    expect(logger.getLines()).toEqual(["[debug] second", "[debug] diagnostic"]);
  });

  test("hands out snapshots that later lines do not change", () => {
    const logger = new CollectLogger({ ...defaultOptions, verbose: false });
    logger.debug("before the error");
    const lines = logger.getLines();

    logger.debug("after the error");

    expect(lines).toEqual(["[debug] before the error"]);
  });

  test("falls back to the console for methods a custom logger lacks", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const logger = new CollectLogger({
      ...defaultOptions,
      logger: { debug: vi.fn() } as unknown as typeof defaultOptions.logger,
    });

    logger.error("Camera failed");

    expect(consoleError).toHaveBeenCalledExactlyOnceWith("Camera failed");
  });
});
