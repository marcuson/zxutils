import { pipeline } from "stream/promises";
import { extract } from "tar-fs";
import { v4 } from "uuid";
import { createGunzip } from "zlib";
import { $, chalk, fs, path } from "zx";
import { ZxUtilsPackageJson } from "../../core/script/zx-utils-package-json.js";
import { getLocalScriptsRepoDir } from "../utils.js";
import { InstallArgs, InstallTarballArgs } from "./install-args.js";

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
    case ".tgz":
    case ".tar.gz":
      await installFromTarball(
        scriptPath,
        localScriptsDir,
        args as InstallTarballArgs
      );
      break;
    default:
      console.error(chalk.red(`Unsupported script format '${ext}'`));
      process.exit(1);
  }

  console.log(chalk.green(`Script installed!`));
}

function getExt(filePath: string): string {
  let ext = path.extname(filePath);

  if ([".enc", ".gz"].includes(ext)) {
    const parsedPath = path.parse(filePath);
    ext = getExt(path.join(parsedPath.dir, parsedPath.name)) + ext;
  }

  return ext;
}

async function installFromTarball(
  scriptPath: string,
  localScriptsDir: string,
  args: InstallTarballArgs
): Promise<void> {
  const randomSuffix = v4();
  const destTempDir = path.join(localScriptsDir, "temp-" + randomSuffix);

  await pipeline(
    fs.createReadStream(scriptPath),
    createGunzip(),
    extract(destTempDir, {
      strip: 1,
    })
  );

  await installFromTempDir(destTempDir, localScriptsDir);
}

async function installFromTempDir(tempDir: string, localScriptsDir: string) {
  try {
    const packageJsonPath = path.join(tempDir, "package.json");
    const packageJsonExists = await fs.exists(packageJsonPath);
    if (!packageJsonExists) {
      console.error(chalk.red("Cannot find 'package.json' in install source."));
      process.exit(1);
    }

    const packageJson = JSON.parse(
      await fs.readFile(packageJsonPath, { encoding: "utf-8" })
    );
    const zxUtilsDef: ZxUtilsPackageJson | undefined = packageJson.zxUtils;
    if (!zxUtilsDef) {
      console.error(
        chalk.red(
          "'package.json' should have 'zxUtils' property properly defined and populated."
        )
      );
      process.exit(1);
    }

    const scriptId = zxUtilsDef.id;
    const destFinalDir = path.join(localScriptsDir, scriptId);

    $.cwd = tempDir;
    await $`npm i --omit=dev`;
    $.cwd = undefined;

    if (await fs.exists(destFinalDir)) {
      await fs.remove(destFinalDir);
    }

    await fs.rename(tempDir, destFinalDir);
  } catch (e) {
    console.error(chalk.red(e));
    await fs.remove(tempDir);
    process.exit(1);
  }
}
