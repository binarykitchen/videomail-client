import formatUtil from "format-util";
import { VideomailClientOptions } from "../types/options";
import getBrowser from "./getBrowser";

class CollectLogger {
  private browser;
  private logger;
  private stack = [];
  private options;

  public constructor(options: VideomailClientOptions) {
    this.options = options;
    this.browser = getBrowser(options);
    this.logger = options.logger || console;
  }

  private lifo(level: string, parameters) {
    // @ts-ignore Fix later
    const line = formatUtil(...parameters);

    if (this.stack.length > this.options.logStackSize) {
      this.stack.pop();
    }

    // @ts-ignore Fix later
    this.stack.push(`[${level}] ${line}`);

    return line;
  }

  /*
   * workaround: since we cannot overwrite console.log without having the correct file and line number
   * we'll use groupCollapsed() and trace() instead to get these.
   */
  public debug() {
    const args = [].slice.call(arguments, 0);
    const output = this.lifo("debug", args);

    if (this.options.verbose) {
      if (this.browser.isFirefox()) {
        this.logger.debug(output);
      } else if (this.logger.groupCollapsed) {
        this.logger.groupCollapsed(output);
        this.logger.trace("Trace");
        this.logger.groupEnd();
      } else if (this.logger.debug) {
        this.logger.debug(output);
      } else {
        // last resort if everything else fails for any weird reasons
        console.log(output);
      }
    }
  }

  public error() {
    const args = [].slice.call(arguments, 0);
    this.logger.error(this.lifo("error", args));
  }

  public warn() {
    const args = [].slice.call(arguments, 0);
    this.logger.warn(this.lifo("warn", args));
  }

  public getLines() {
    return this.stack;
  }
}

export default CollectLogger;
