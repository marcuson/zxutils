import { $, chalk, retry } from "zx";
import { EnsureUNCConnectionOptions } from "./ensure-unc-connection-options.js";

export async function ensureUNCConnectionInternal(
  opts: EnsureUNCConnectionOptions
): Promise<void> {
  console.log("Check if UNC is connected.");
  const isConnected =
    (await $`ls ${opts.uncPath}`.quiet().nothrow().exitCode) === 0;

  if (isConnected) {
    console.log(chalk.green("UNC connection already present."));
    return;
  }

  console.log("Opening window to UNC root, enter credential.");
  const uncRoot = opts.uncPath.split("\\").slice(0, 3).join("\\");
  await $`explorer ${uncRoot}`;

  try {
    console.log("Start check UNC connection.");
    await retry(30, "2s", () => $`ls ${opts.uncPath}`.quiet());
  } catch (e) {
    console.log(chalk.red("Unable to estabilish UNC connection."));
    throw e;
  }

  console.log(chalk.green("UNC connection estabilished."));
}
