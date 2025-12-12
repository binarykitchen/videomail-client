interface BrowserStats {
  ua: string;
  browser: UAParser.IBrowser;
  cpu: UAParser.ICPU;
  device: UAParser.IDevice;
  engine: UAParser.IEngine;
  os: UAParser.IOS;
}

export type { BrowserStats };
