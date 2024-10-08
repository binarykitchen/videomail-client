import type { Config } from "release-it";

const config: Config = {
  git: {
    commit: true,
    tag: true,
    push: true,
  },
  github: {
    release: true,
  },
  npm: {
    publish: true,
  },
};

export default config;
