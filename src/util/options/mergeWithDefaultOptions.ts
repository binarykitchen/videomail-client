import deepmerge from "deepmerge";

import defaultOptions from "../../options";
import {
  PartialVideomailClientOptions,
  VideomailClientOptions,
} from "../../types/options";
import CollectLogger from "../CollectLogger";
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
