import type { Config } from "release-it";

const config: Config = {
  // TODO Consider later once all is stable
  // github: {
  //   release: true,
  // }
  // https://github.com/release-it/release-it/tree/main?tab=readme-ov-file#hooks
  hooks: {
    "before:init": [
      "npm run prettier",
      "npm run lint",
      "npm run types",
      "npm run audit",
      "npm test",
    ],
    "after:bump": "npm run build:prod",
  },
};

export default config;
