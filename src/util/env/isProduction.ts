import { NodeEnvType } from "../../types/env.ts";
import getNodeEnv from "./getNodeEnv.ts";

function isProduction() {
  return getNodeEnv() === NodeEnvType.PRODUCTION;
}

export default isProduction;
