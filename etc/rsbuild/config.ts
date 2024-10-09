import { defineConfig } from "@rsbuild/core";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { pluginStylus } from "@rsbuild/plugin-stylus";
import { pluginDts } from "rsbuild-plugin-dts";
import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";

import { tsConfigProd, tsEntry } from "./paths";
import { NodeEnvType } from "../../src/types/env";
import isProductionMode from "../../src/util/isProductionMode";

export default defineConfig({
  mode: isProductionMode() ? NodeEnvType.PRODUCTION : NodeEnvType.DEVELOPMENT,
  output: {
    target: "web",
    filenameHash: false,
    injectStyles: true,
    legalComments: "none",
    distPath: {
      js: "",
    },
  },
  source: {
    entry: {
      index: tsEntry,
    },
    tsconfigPath: tsConfigProd,
  },
  plugins: [pluginStylus(), pluginNodePolyfill(), pluginDts({})],
  tools: {
    htmlPlugin: false,
    rspack: (_config, { appendPlugins }) => {
      // Only register the plugin when RSDOCTOR is true, as the plugin will increase the build time
      // Can be run with RSDOCTOR=true npm run build:prod
      if (process.env.RSDOCTOR) {
        appendPlugins(
          new RsdoctorRspackPlugin({
            // plugin options
          }),
        );
      }
    },
  },
  performance: {
    chunkSplit: {
      strategy: "all-in-one",
    },
  },
});
