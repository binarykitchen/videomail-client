import deepmerge from "deepmerge";
import CollectLogger from "./collectLogger";
import defaultOptions from "./../options";
import addOptionsFunctions from "./addOptionsFunctions";

function adjustOptions(options = {}) {
  const localOptions = deepmerge(defaultOptions, options, {
    arrayMerge(_destination, source) {
      return source;
    },
  });

  const collectLogger = new CollectLogger(localOptions);

  localOptions.logger = collectLogger;
  localOptions.debug = localOptions.logger.debug;

  const localOptionsWithFunctions = addOptionsFunctions(localOptions);

  return localOptionsWithFunctions;
}

export default adjustOptions;
