import getNodeEnv from "./getNodeEnv";
import { NodeEnvType } from "./../types/env";

function isProductionMode() {
  return getNodeEnv() === NodeEnvType.PRODUCTION;
}

export default isProductionMode;
