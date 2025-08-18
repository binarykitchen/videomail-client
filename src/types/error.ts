import { ErrorObject } from "serialize-error";
import type { IBrowser, ICPU, IDevice, IEngine, IOS } from "ua-parser-js";

// Make sure these are only native, primitive types, not fully bloated objects
export interface VideomailErrorData {
  // These two are for unhandled promise rejection events.
  // Any other error causes, they shall go into the err (ErrorObject)
  cause?: any;
  // TODO Not sure if this can be reported via API. Needs experimenting. Hence any for now.
  promise?: any;

  err?: ErrorObject | undefined;
  name?: string;
  explanation?: string | undefined;
  logLines?: string[] | undefined;
  message: string;
  siteName?: string | undefined;
  title: string;
  trace?: string | undefined;
  code?: string | undefined;
  status?: number | undefined;
  stack?: string | undefined;
  type?: string | undefined;
}

interface VideomailErrorVersions {
  videomailNinjaFormPlugin?: string | undefined;
  videomailClient: string;
}

export interface FullVideomailErrorData extends VideomailErrorData {
  browser: IBrowser;
  cookie?: string[] | undefined;
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
