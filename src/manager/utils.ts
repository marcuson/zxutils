import { fs, glob, os, path } from "zx";
import { ZxUtilsPackageJson } from "../core/script/zx-utils-package-json.js";
import { toPosix } from "../core/utils/path.utils.js";

export function getLocalRootDir(): string {
  return path.join(os.homedir(), ".zxutils");
}

export function getLocalScriptsRepoDir(): string {
  return path.join(getLocalRootDir(), "scripts");
}

export interface InstalledScriptInfo {
  scriptId: string;
  scriptPath: string;
  scriptMainPath: string;
}

export async function getInstalledScripts(): Promise<InstalledScriptInfo[]> {
  const localScriptsDir = getLocalScriptsRepoDir();
  const globToScan = toPosix(
    path.posix.join(localScriptsDir, "*", "package.json")
  );
  const packages = await glob([globToScan]);

  const res = await Promise.all(
    packages.map((x) =>
      fs
        .readFile(x, "utf-8")
        .then((p) => JSON.parse(p))
        .then((pJson) => {
          const scriptId = (pJson.zxUtils as ZxUtilsPackageJson).id;
          const scriptPath = path.dirname(x);
          const scriptMainPath = path.join(scriptPath, pJson.main);

          const info: InstalledScriptInfo = {
            scriptId,
            scriptMainPath,
            scriptPath,
          };
          return info;
        })
    )
  );

  return res;
}
