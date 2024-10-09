import deepmerge from "deepmerge";
import CollectLogger from "../CollectLogger";
import defaultOptions from "../../options";
import { VideomailClientOptions } from "../../types/options";

function mergeWithDefaultOptions(options: VideomailClientOptions) {
  const newOptions = deepmerge(defaultOptions, options, {
    arrayMerge(_destination, source) {
      return source;
    },
  });

  if (!newOptions.logger) {
    const collectLogger = new CollectLogger(newOptions);
    newOptions.logger = collectLogger;
  }

  return newOptions;
}

export default mergeWithDefaultOptions;
