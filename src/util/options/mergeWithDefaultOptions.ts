import deepmerge from "deepmerge";
import CollectLogger from "../CollectLogger";
import defaultOptions from "../../options";
import {
  PartialVideomailClientOptions,
  VideomailClientOptions,
} from "../../types/options";

function mergeWithDefaultOptions(options: PartialVideomailClientOptions) {
  const newOptions = deepmerge(defaultOptions, options, {
    arrayMerge(_destination, source) {
      return source;
    },
  }) as VideomailClientOptions;

  if (!newOptions.logger) {
    const collectLogger = new CollectLogger(newOptions);
    newOptions.logger = collectLogger;
  }

  return newOptions;
}

export default mergeWithDefaultOptions;
