import { fs, glob, path } from "zx";
import { toPosix } from "../core/utils/path.utils.js";
import { getLocalScriptsRepoDir } from "./utils.js";

export async function list(): Promise<void> {
  const localScriptsDir = getLocalScriptsRepoDir();
  const globToScan = toPosix(
    path.posix.join(localScriptsDir, "*", "package.json")
  );
  const packages = await glob([globToScan]);

  const res = await Promise.all(
    packages.map((x) =>
      fs.readFile(x, "utf-8").then((p) => JSON.parse(p).zxUtils.id)
    )
  );

  res.forEach((x) => {
    console.log(x);
  });
}
