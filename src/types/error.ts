import { ErrorObject } from "serialize-error";
import type { IBrowser, ICPU, IDevice, IEngine, IOS } from "ua-parser-js";

export interface VideomailErrorVersions {
  videomailNinjaFormPlugin?: string | undefined;
  videomailClient: string;
  // Added by the private Videomail app.
  videomailUI?: string | undefined;
  videomailServer?: string | undefined;
}

// Keep report data serializable; avoid passing live browser objects.
export interface VideomailErrorData {
  // cause and promise describe unhandled rejections. Other errors go in err.
  cause?: any;

  // TODO Check how promise data can be sent through the API.
  promise?: any;

  err?: ErrorObject | undefined;
  name?: string | undefined;
  explanation?: string | undefined;
  logLines?: string[] | undefined;
  message: string;
  whitelistKey?: string | undefined;
  title: string;
  trace?: string | undefined;
  code?: string | undefined;
  status?: number | undefined;
  stack?: string | undefined;
  type?: string | undefined;
  versions?: VideomailErrorVersions | undefined;

  // Content security policy violations.
  blockedURI?: string | undefined;
  effectiveDirective?: string | undefined;
  violatedDirective?: string | undefined;
  originalPolicy?: string | undefined;
}

export interface FullVideomailErrorData extends VideomailErrorData {
  browser: IBrowser;
  cpu?: ICPU | undefined;
  device?: IDevice | undefined;
  engine: IEngine;
  location: string;
  orientation?: string | undefined;
  os?: IOS | undefined;
  screen: string;
  clientIp?: string | null | undefined;
  userAgent?: string | null | undefined;
  isBot?: boolean | undefined;
  supportedConstraints?: MediaTrackSupportedConstraints | undefined;
  enumerateDevices?: MediaDeviceInfo[] | undefined;
  usedConstraints?: MediaStreamConstraints | undefined;
}
