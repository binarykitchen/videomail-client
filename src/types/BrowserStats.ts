import type { IBrowser, ICPU, IDevice, IEngine, IOS } from "ua-parser-js";

/*
 * What the user agent parser found, as plain data. Videos and error reports carry it as
 * JSON, which drops the parser's helper methods like is() or withClientHints().
 */
interface BrowserStats {
  ua: string;
  browser: Pick<IBrowser, "name" | "version" | "major" | "type">;
  cpu: Pick<ICPU, "architecture">;
  device: Pick<IDevice, "type" | "vendor" | "model">;
  engine: Pick<IEngine, "name" | "version">;
  os: Pick<IOS, "name" | "version">;
}

export type { BrowserStats };
