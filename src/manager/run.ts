import { getScriptPath } from "./utils.js";

export async function run(): Promise<void> {
  const scriptIdOrPath = process.argv[3];
  const scriptPath = await getScriptPath(scriptIdOrPath);

  if (scriptPath === undefined) {
    throw new Error(
      `Cannot find script "${scriptIdOrPath}" at given path or in install location.`
    );
  }

  process.argv = ["", "", scriptPath].concat(...process.argv.slice(4));

  await import("zx/cli");
}
