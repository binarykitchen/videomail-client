import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { pluginStylus } from "@rsbuild/plugin-stylus";
import { defineConfig } from "@rslib/core";

import { NodeEnvType } from "../src/types/env.ts";
import isProduction from "../src/util/env/isProduction.ts";

export default defineConfig({
  plugins: [pluginStylus(), pluginNodePolyfill()],
  mode: isProduction() ? NodeEnvType.PRODUCTION : NodeEnvType.DEVELOPMENT,
});
