import formatUtil from "format-util";
import Browser from "./browser";

export default function (localOptions = {}) {
  const browser = new Browser(localOptions);
  const logger = localOptions.logger || console;
  const stack = [];

  function lifo(level, parameters) {
    const line = formatUtil(...parameters);

    if (stack.length > localOptions.logStackSize) {
      stack.pop();
    }

    stack.push(`[${level}] ${line}`);

    return line;
  }

  /*
   * workaround: since we cannot overwrite console.log without having the correct file and line number
   * we'll use groupCollapsed() and trace() instead to get these.
   */
  this.debug = function () {
    const args = [].slice.call(arguments, 0);
    const output = lifo("debug", args);

    if (localOptions.verbose) {
      if (browser.isFirefox()) {
        logger.debug(output);
      } else if (logger.groupCollapsed) {
        logger.groupCollapsed(output);
        logger.trace("Trace");
        logger.groupEnd();
      } else if (logger.debug) {
        logger.debug(output);
      } else {
        // last resort if everything else fails for any weird reasons
        console.log(output);
      }
    }
  };

  this.error = function () {
    const args = [].slice.call(arguments, 0);
    logger.error(lifo("error", args));
  };

  this.warn = function () {
    const args = [].slice.call(arguments, 0);
    logger.warn(lifo("warn", args));
  };

  this.getLines = function () {
    return stack;
  };
}
