import { NodeEnvType } from "./../types/env.ts";

function getNodeEnv() {
  if (!process.env.NODE_ENV) {
    return NodeEnvType.DEVELOPMENT;
  }

  return process.env.NODE_ENV;
}

export default getNodeEnv;
