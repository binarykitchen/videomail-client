import path from "node:path";

import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { pluginStylus } from "@rsbuild/plugin-stylus";
import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";
import { defineConfig } from "@rslib/core";

import { NodeEnvType } from "./src/types/env.ts";
import isProductionMode from "./src/util/isProductionMode.ts";

const rootDir = process.cwd();

const resolvePath = (relativePath: string) => path.resolve(rootDir, relativePath);

const srcDir = resolvePath("src");
const tsConfig = resolvePath("tsconfig.build.json");
const tsEntry = resolvePath(path.join(srcDir, "index.ts"));

export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: "es2020",
      dts: true,
      output: {
        distPath: {
          root: "./dist/esm/",
        },
      },
    },
    {
      format: "cjs",
      syntax: "es2015",
      output: {
        // This will include all the JS code into one single file without
        // the use of require()
        autoExternal: false,
        distPath: {
          root: "./dist/cjs/",
        },
      },
    },
    {
      format: "umd",
      umdName: "VideomailClient",
      output: {
        // This will include all the JS code into one single file without
        // the use of require()
        autoExternal: false,
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
    tsconfigPath: tsConfig,
  },
  plugins: [pluginStylus(), pluginNodePolyfill()],
  tools: {
    htmlPlugin: false,
    rspack: (config, { appendPlugins }) => {
      config.module.rules?.unshift({
        test: /pcm-processor\.worklet\.ts$/u,
        type: "asset/resource",
        generator: { filename: "static/assets/pcm-processor.worklet.js" },
        use: [
          {
            loader: "builtin:swc-loader",
            options: { jsc: { parser: { syntax: "typescript" } } },
          },
        ],
      });

      // To run this, use the `npm run build:prod:doc` command
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
