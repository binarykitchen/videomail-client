import { defineConfig } from "@rsbuild/core";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { pluginStylus } from "@rsbuild/plugin-stylus";

import { tsEntry } from "./paths";
import { NodeEnvType } from "../../src/types/env";
import isProductionMode from "../../src/util/isProductionMode";

export default defineConfig({
  mode: isProductionMode() ? NodeEnvType.PRODUCTION : NodeEnvType.DEVELOPMENT,
  output: {
    target: "web",
    filenameHash: false,
    injectStyles: true,
    legalComments: "none",
  },
  source: {
    entry: {
      index: tsEntry,
    },
  },
  plugins: [pluginStylus(), pluginNodePolyfill()],
  tools: {
    htmlPlugin: false,
  },
  performance: {
    chunkSplit: {
      strategy: "all-in-one",
    },
  },
});
