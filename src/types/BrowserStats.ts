/*
 * What the user agent parser found, as plain data. Videos and error reports carry it as
 * JSON, so it stays free of any parser library's types and helper methods.
 *
 * The parser is bowser now (MIT). It replaced ua-parser-js, whose AGPL licence clashed
 * with embedding this package in other websites and apps.
 */
interface BrowserStats {
  ua: string;
  browser: {
    name?: string | undefined;
    version?: string | undefined;
  };
  // Such as "mobile", "tablet", "desktop" or "tv"
  device: {
    type?: string | undefined;
    vendor?: string | undefined;
    model?: string | undefined;
  };
  engine: {
    name?: string | undefined;
    version?: string | undefined;
  };
  os: {
    name?: string | undefined;
    version?: string | undefined;
  };
}

export type { BrowserStats };
