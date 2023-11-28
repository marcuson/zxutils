import { getInstalledScripts } from "./utils.js";

export async function run(): Promise<void> {
  const installedScripts = await getInstalledScripts();

  const scriptIdOrPath = process.argv[3];
  const scriptPath =
    installedScripts.find((x) => x.scriptId === scriptIdOrPath)
      ?.scriptMainPath ?? scriptIdOrPath;

  process.argv = ["", "", scriptPath].concat(...process.argv.slice(4));

  await import("zx/cli");
}
