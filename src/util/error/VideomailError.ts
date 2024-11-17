import { IBrowser, ICPU, IDevice, IEngine, IOS } from "ua-parser-js";
import { VideomailClientOptions } from "../../types/options";
import getBrowser from "../getBrowser";
import HTTPError from "./HTTPError";

export interface ErrData extends ErrorOptions {
  explanation: string | undefined;
  logLines?: string[] | undefined;
  err?: Error | undefined;
}

class VideomailError extends HTTPError {
  public readonly title = "videomail-client error";
  public readonly location = window.location.href;

  public explanation: string | undefined;
  public logLines?: string[] | undefined;
  public siteName: string | undefined;
  public cookies: string | undefined;
  public err?: Error | undefined;
  public promise?: Promise<any> | undefined;
  public reason?: any;
  public browser: IBrowser | undefined;
  public cpu?: ICPU | undefined;
  public device?: IDevice | undefined;
  public engine?: IEngine | undefined;
  public os?: IOS | undefined;
  public screen?: string | undefined;
  public orientation?: string | undefined;

  private readonly classList?: string[] | undefined;

  public static readonly PERMISSION_DENIED = "PERMISSION_DENIED";
  public static readonly NOT_ALLOWED_ERROR = "NotAllowedError";
  public static readonly DOM_EXCEPTION = "DOMException";
  public static readonly STARTING_FAILED = "Starting video failed";
  public static readonly MEDIA_DEVICE_NOT_SUPPORTED = "MediaDeviceNotSupported";
  public static readonly BROWSER_PROBLEM = "browser-problem";
  public static readonly WEBCAM_PROBLEM = "webcam-problem";
  public static readonly OVERCONSTRAINED = "OverconstrainedError";
  public static readonly NOT_READABLE_ERROR = "NotReadableError";
  public static readonly SECURITY_ERROR = "SecurityError";
  public static readonly TRACK_START_ERROR = "TrackStartError";
  public static readonly INVALID_STATE_ERROR = "InvalidStateError";

  public constructor(
    message: string,
    options: VideomailClientOptions,
    classList?: string[],
    errData?: ErrData,
  ) {
    super(message, errData);

    this.explanation = errData?.explanation;
    this.logLines = errData?.logLines;
    this.siteName = options.siteName;

    this.classList = classList;

    const browser = getBrowser(options);
    const usefulClientData = browser.getUsefulData();

    this.browser = usefulClientData.browser;
    this.cpu = usefulClientData.cpu;
    this.device = usefulClientData.device;
    this.engine = usefulClientData.engine;
    this.os = usefulClientData.os;

    const cookies = global.document.cookie.split("; ");
    this.cookies = cookies.length > 0 ? cookies.join(",\n") : undefined;

    this.screen = [screen.width, screen.height, screen.colorDepth].join("×");

    // Needed for unit tests
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (screen.orientation) {
      this.orientation = screen.orientation.type.toString();
    }

    this.err = errData?.err;

    const stackTarget = errData?.cause || errData?.err;

    if (stackTarget) {
      // Maintains proper stack trace for where our error was thrown (only available on V8)
      Error.captureStackTrace(stackTarget, VideomailError);
    }
  }

  private hasClass(name: string) {
    return this.classList?.includes(name);
  }

  public isBrowserProblem() {
    return this.hasClass(VideomailError.BROWSER_PROBLEM);
  }

  // this one is useful so that the notifier can have different css classes
  public getClassList() {
    return this.classList;
  }
}

export default VideomailError;
