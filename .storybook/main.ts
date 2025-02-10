import type { StorybookConfig } from "storybook-html-rsbuild";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "storybook-html-rsbuild",
    options: { builder: { rsbuildConfigPath: "rslib.config.ts" } },
  },
  staticDirs: ["./public"],
  // Useful trick to alter HTTP header if needed
  // rsbuildFinal: (config) => {
  //   if (config.server) {
  //     config.server.headers = { "permissions-policy": "microphone=(), camera=()" };
  //   }

  //   return config;
  // },
};

export default config;
