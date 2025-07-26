import fs from "fs";
import path from "path";

import { defineConfig } from "@rslib/core";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { pluginStylus } from "@rsbuild/plugin-stylus";
import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";

import { NodeEnvType } from "./src/types/env";
import isProductionMode from "./src/util/isProductionMode";

const rootDir = fs.realpathSync(process.cwd());

const resolvePath = (relativePath: string) => path.resolve(rootDir, relativePath);

const srcDir = resolvePath("src");
const tsConfig = resolvePath("tsconfig.json");
const tsConfigProd = resolvePath("tsconfig.prod.json");
const tsEntry = resolvePath(path.join(srcDir, "index.ts"));

export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: "es2022",
      dts: true,
      output: {
        distPath: {
          root: "./dist/esm/",
        },
      },
    },
    {
      format: "cjs",
      // This will include all the JS code into one single file without
      // the use of require()
      autoExternal: false,
      syntax: "es2015",
      output: {
        distPath: {
          root: "./dist/cjs/",
        },
      },
    },
    {
      format: "umd",
      // This will include all the JS code into one single file without
      // the use of require()
      autoExternal: false,
      umdName: "VideomailClient",
      output: {
        distPath: {
          root: "./dist/umd/",
        },
      },
    },
  ],
  mode: isProductionMode() ? NodeEnvType.PRODUCTION : NodeEnvType.DEVELOPMENT,
  output: {
    target: "web",
    injectStyles: true,
    legalComments: "none",
  },
  source: {
    entry: {
      index: tsEntry,
    },
    tsconfigPath: isProductionMode() ? tsConfigProd : tsConfig,
  },
  plugins: [pluginStylus(), pluginNodePolyfill()],
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
});
