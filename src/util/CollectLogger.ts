import { VideomailClientOptions } from "../types/options";
import Browser from "./browser/Browser";
import getBrowser from "./browser/getBrowser";

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
    this.output("error", this.lifo("error", args));
  }

  public warn(...args) {
    this.output("warn", this.lifo("warn", args));
  }

  public info(...args) {
    this.output("info", this.lifo("info", args));
  }

  // A custom logger may lack a method. Fall back to the console instead of crashing.
  private output(level: "error" | "warn" | "info", line: string) {
    if (typeof this.logger[level] === "function") {
      this.logger[level](line);
    } else {
      console[level](line);
    }
  }

  public getLines() {
    // A snapshot: later log lines must not change what a report already holds.
    return [...this.stack];
  }
}

export default CollectLogger;
