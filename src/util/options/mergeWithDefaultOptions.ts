import deepmerge from "deepmerge";
import CollectLogger from "../CollectLogger";
import defaultOptions from "../../options";
import {
  PartialVideomailClientOptions,
  VideomailClientOptions,
} from "../../types/options";
import isTest from "../isTest";

function mergeWithDefaultOptions(options: PartialVideomailClientOptions = {}) {
  const newOptions = deepmerge(defaultOptions, options, {
    arrayMerge(_destination, source) {
      return source;
    },
  }) as VideomailClientOptions;

  // Repack logger instance
  const collectLogger = new CollectLogger(newOptions);
  newOptions.logger = collectLogger;

  if (isTest()) {
    newOptions.verbose = false;
  }

  return newOptions;
}

export default mergeWithDefaultOptions;
