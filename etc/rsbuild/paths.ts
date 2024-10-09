import fs from "fs";
import path from "path";

const rootDir = fs.realpathSync(process.cwd());

const resolvePath = (relativePath: string) => path.resolve(rootDir, relativePath);

const srcDir = resolvePath("src");
const tsConfigProd = resolvePath("tsconfig.prod.json");
const tsEntry = resolvePath(path.join(srcDir, "index.ts"));

export { tsEntry, tsConfigProd };
