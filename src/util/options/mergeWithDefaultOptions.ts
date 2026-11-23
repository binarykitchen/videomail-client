import deepmerge from "deepmerge";

import defaultOptions from "../../options";
import {
  PartialVideomailClientOptions,
  VideomailClientOptions,
} from "../../types/options";
import CollectLogger from "../CollectLogger";
import isTest from "../env/isTest";

function isPlainObject(value: unknown) {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const prototype: unknown = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}

/*
 * Only arrays and plain objects get merged. Anything else, like a class-based
 * logger, is taken as it is: cloning it would drop its prototype methods.
 */
function isMergeable(value: unknown) {
  return Array.isArray(value) || isPlainObject(value);
}

function mergeWithDefaultOptions(options: PartialVideomailClientOptions = {}) {
  const newOptions = deepmerge(defaultOptions, options, {
    arrayMerge(_destination, source) {
      return source;
    },
    isMergeableObject: isMergeable,
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
