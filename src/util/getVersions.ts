import { version as videomailClientVersion } from "../../package.json";
import type { VideomailClientOptions } from "../types/options";

// Which client and plugin versions were involved, so reports can be traced back. 🔖
function getVersions(options: Pick<VideomailClientOptions, "versions">) {
  return {
    videomailClient: videomailClientVersion,
    videomailNinjaFormPlugin: options.versions?.videomailNinjaFormPlugin,
  };
}

export default getVersions;
