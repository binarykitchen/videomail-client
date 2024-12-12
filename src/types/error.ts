import type { IBrowser, ICPU, IDevice, IEngine, IOS } from "ua-parser-js";

export interface VideomailErrorData {
  cause?: any;
  err?: Error | undefined;
  explanation?: string | undefined;
  logLines?: string[] | undefined;
  message: string;
  promise?: Promise<any> | undefined;
  reason?: any;
  siteName?: string | undefined;
  title: string;
  trace?: string | undefined;
  code?: string | undefined;
  status?: number | undefined;
  stack?: string | undefined;

  // These are weird and probably not needed but help with narrowing down issues.
  // They come mostly from Videomail's proprietary UI code
  errStringified?: string | undefined;
  event?: Event | undefined;
  eventStringified?: string | undefined;
}

export interface FullVideomailErrorData extends VideomailErrorData {
  browser: IBrowser;
  cookie?: string | undefined;
  cpu?: ICPU | undefined;
  device?: IDevice | undefined;
  engine: IEngine;
  location: string;
  orientation?: string | undefined;
  os?: IOS | undefined;
  screen: string;
}
