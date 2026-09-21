import type { Config } from "release-it";

const config: Config = {
  // TODO Consider later once all is stable
  // github: {
  //   release: true,
  // }
  // https://github.com/release-it/release-it/tree/main?tab=readme-ov-file#hooks
  hooks: {
    "after:init": [
      "node --run prettier",
      "node --run lint",
      "node --run types",
      "node --run audit",
      "node --run test",
    ],
    "after:bump": "node --run build:prod",
  },
};

export default config;
