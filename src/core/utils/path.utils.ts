import { path } from "zx";

export function toPosix(originalPath: string) {
  return originalPath
    .replace("C:", "")
    .replace("c:", "")
    .split(path.sep)
    .join(path.posix.sep);
}

export function toWin(originalPath: string) {
  return originalPath.split(path.sep).join(path.win32.sep);
}
