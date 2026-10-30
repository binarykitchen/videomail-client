import { VideomailClientOptions } from "../types/options";
import Browser from "./Browser";
import getBrowser from "./getBrowser";

class CollectLogger {
  private readonly browser: Browser;
  private readonly logger;
  private readonly stack: string[] = [];
  private readonly options: VideomailClientOptions;

  public constructor(options: VideomailClientOptions) {
    this.options = options;
    this.browser = getBrowser(options);
    this.logger = options.logger;
  }

  private lifo(level: string, parameters: string[]) {
    const line = parameters.join();

    if (this.stack.length >= this.options.logStackSize) {
      this.stack.shift();
    }

    this.stack.push(`[${level}] ${line}`);

    return line;
  }

  // A grouped trace keeps the caller's file and line visible through this wrapper.
  public debug(...args) {
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
        // Custom loggers may lack debug support.
        console.log(output);
      }
    }
  }

  public error(...args) {
    this.logger.error(this.lifo("error", args));
  }

  public warn(...args) {
    this.logger.warn(this.lifo("warn", args));
  }

  public info(...args) {
    this.logger.info(this.lifo("info", args));
  }

  public getLines() {
    return this.stack;
  }
}

export default CollectLogger;
