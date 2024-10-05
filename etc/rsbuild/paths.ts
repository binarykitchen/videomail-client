import fs from "fs";
import path from "path";

const rootDir = fs.realpathSync(process.cwd());

const resolvePath = (relativePath: string) => path.resolve(rootDir, relativePath);

const srcDir = resolvePath("src");
const tsEntry = resolvePath(path.join(srcDir, "index.ts"));

export { tsEntry };
