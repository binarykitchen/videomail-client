// enhances options with useful functions we can reuse everywhere
import deepmerge from "deepmerge";

export default {
  /*
   * not very elegant but works! and if you here are reading this, and
   * start to doubt, rest assured, it's solid and run thousand times over
   * and over again each day. and other large sites out there have their own
   * tech debts. hope i have shattered your illusion on perfection?
   */
  merge(defaultOptions, newOptions) {
    const options = deepmerge(defaultOptions, newOptions, {
      arrayMerge(_destination, source) {
        return source;
      },
    });

    return options;
  },
};
