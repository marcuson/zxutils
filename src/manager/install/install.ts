import { exec as cpExec } from "child_process";
import jszip from "jszip";
import { promisify } from "util";
import { chalk, fs, path } from "zx";
import { ZxUtilsPackageJson } from "../../core/script/zx-utils-package-json.js";
import { extractZip } from "../../core/utils/zip.utils.js";
import { getLocalScriptsRepoDir } from "../utils.js";
import { InstallArgs, InstallZipArgs } from "./install-args.js";

const exec = promisify(cpExec);

export async function install(
  scriptPath: string,
  args: InstallArgs
): Promise<void> {
  const localScriptsDir = getLocalScriptsRepoDir();

  console.log(chalk.cyan(`Install scripts from source '${scriptPath}'.`));

  if (!(await fs.exists(localScriptsDir))) {
    await fs.ensureDir(localScriptsDir);
  }

  const ext = getExt(scriptPath);
  switch (ext) {
    case ".zip":
      await installFromZip(scriptPath, localScriptsDir, args as InstallZipArgs);
      break;
    default:
      console.error(chalk.red(`Unsupported script format '${ext}'`));
      process.exit(1);
  }

  console.log(chalk.green(`Script installed!`));
}

function getExt(filePath: string): string {
  return path.extname(filePath);
}

async function installFromZip(
  scriptPath: string,
  localScriptsDir: string,
  args: InstallZipArgs
): Promise<void> {
  const archiveFileData = await fs.readFile(scriptPath);
  const archiveFile = await jszip.loadAsync(archiveFileData);

  const packageJsonZipped = archiveFile.file("package.json");
  if (!packageJsonZipped) {
    console.error(
      chalk.red("Cannot find package.json file in root of script archive.")
    );
    process.exit(1);
  }

  const packageJson = JSON.parse(await packageJsonZipped.async("string"));

  const zxUtilsDef: ZxUtilsPackageJson | undefined = packageJson.zxUtils;
  if (!zxUtilsDef) {
    console.error(
      chalk.red(
        "Package.json should have 'zxUtils' property properly defined and populated."
      )
    );
    process.exit(1);
  }

  const scriptId = zxUtilsDef.id;
  const destTempDir = path.join(localScriptsDir, scriptId + "-temp");
  const destFinalDir = path.join(localScriptsDir, scriptId);

  await extractZip(archiveFile, destTempDir);

  try {
    await exec("npm ci --omit=dev", { cwd: destTempDir });
  } catch (e) {
    console.error(chalk.red(e));
    process.exit(1);
  }

  if (await fs.exists(destFinalDir)) {
    await fs.remove(destFinalDir);
  }

  await fs.rename(destTempDir, destFinalDir);
}
