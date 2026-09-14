import { describe, expect, test, vi } from "vitest";

import defaultOptions from "../../options";
import CollectLogger from "../CollectLogger";

describe("CollectLogger", () => {
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
});
