import { os, path } from "zx";

export function getLocalRootDir(): string {
  return path.join(os.homedir(), ".zxutils");
}

export function getLocalScriptsRepoDir(): string {
  return path.join(getLocalRootDir(), "scripts");
}
