import { NodeEnvType } from "./../types/env";
import getNodeEnv from "./getNodeEnv";

function isProductionMode() {
  return getNodeEnv() === NodeEnvType.PRODUCTION;
}

export default isProductionMode;
