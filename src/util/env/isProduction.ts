import { NodeEnvType } from "../../types/env";
import getNodeEnv from "./getNodeEnv";

function isProduction() {
  return getNodeEnv() === NodeEnvType.PRODUCTION;
}

export default isProduction;
