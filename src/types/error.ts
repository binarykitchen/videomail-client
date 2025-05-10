import { ErrorObject } from "serialize-error";
import type { IBrowser, ICPU, IDevice, IEngine, IOS } from "ua-parser-js";

export interface VideomailErrorData {
  cause?: any;
  err?: ErrorObject | undefined;
  explanation?: string | undefined;
  logLines?: string[] | undefined;
  message: string;
  // this is for events, such as unhandled promises
  event?: Event;
  siteName?: string | undefined;
  title: string;
  trace?: string | undefined;
  code?: string | undefined;
  status?: number | undefined;
  stack?: string | undefined;
  errType?: string | undefined;
}

interface VideomailErrorVersions {
  videomailNinjaFormPlugin?: string | undefined;
  videomailClient: string;
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
  versions?: VideomailErrorVersions | undefined;
  clientIp?: string | null | undefined;
}
