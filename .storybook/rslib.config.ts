import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { pluginStylus } from "@rsbuild/plugin-stylus";
import { defineConfig } from "@rslib/core";

import { NodeEnvType } from "../src/types/env.ts";

export default defineConfig({
  plugins: [pluginStylus(), pluginNodePolyfill()],
  mode: NodeEnvType.DEVELOPMENT,
});
