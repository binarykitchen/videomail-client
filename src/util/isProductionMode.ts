import { NodeEnvType } from "./../types/env.ts";
import getNodeEnv from "./getNodeEnv.ts";

function isProductionMode() {
  return getNodeEnv() === NodeEnvType.PRODUCTION;
}

export default isProductionMode;
