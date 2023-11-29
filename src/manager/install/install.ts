import { pipeline } from "stream/promises";
import { extract } from "tar-fs";
import { v4 } from "uuid";
import { createGunzip } from "zlib";
import { $, chalk, fs, path } from "zx";
import { ZxUtilsPackageJson } from "../../core/script/zx-utils-package-json.js";
import { decryptor } from "../crypto/crypto.utils.js";
import { getLocalScriptsRepoDir } from "../utils.js";
import { InstallArgs, InstallEncryptedArgs } from "./install-args.js";

type PipelineTransform =
  | NodeJS.ReadableStream
  | NodeJS.WritableStream
  | NodeJS.ReadWriteStream;

interface TarballPipelineOpts {
  transforms: PipelineTransform[];
  tempDir: string;
}

export async function install(
  scriptPath: string,
  args: InstallArgs
): Promise<void> {
  const localScriptsDir = getLocalScriptsRepoDir();

  console.log(chalk.cyan(`Install scripts from source '${scriptPath}'.`));

  if (!(await fs.exists(localScriptsDir))) {
    await fs.ensureDir(localScriptsDir);
  }

  const scriptFullExt = getScriptFullExt(scriptPath);
  const supportedFormats = [".tgz", ".tar.gz", ".tgz.enc", ".tar.gz.enc"];

  if (!supportedFormats.includes(scriptFullExt)) {
    console.error(chalk.red(`Unsupported script format '${scriptFullExt}'`));
    process.exit(1);
  }

  const pipelineOpts: TarballPipelineOpts = {
    transforms: [],
    tempDir: "",
  };

  let ext: string;
  let scriptFilename = path.basename(scriptPath);
  while ((ext = getExtPart(scriptFilename))) {
    updatePipelineOpts(ext, args, pipelineOpts);
    scriptFilename = path.parse(scriptFilename).name;
  }

  await installFromTarball(scriptPath, pipelineOpts);

  console.log(chalk.green(`Script installed!`));
}

function getScriptFullExt(filename: string) {
  const ext = getExtPart(filename);
  if (ext) {
    return getScriptFullExt(path.parse(filename).name) + ext;
  }

  return ext;
}

function getExtPart(filename: string) {
  const ext = path.extname(filename);
  if (!isNaN(parseInt(ext.substring(1)))) {
    return "";
  }

  return ext;
}

function getTempDestDir(): string {
  const randomSuffix = v4();
  const destTempDir = path.join(
    getLocalScriptsRepoDir(),
    "temp-" + randomSuffix
  );
  return destTempDir;
}

function updatePipelineOpts(
  ext: string,
  args: InstallArgs,
  opts: TarballPipelineOpts
): void {
  let tempDir = "";
  switch (ext) {
    case ".tar":
      tempDir = getTempDestDir();
      opts.transforms.push(extract(tempDir, { strip: 1 }));
      opts.tempDir = tempDir;
      break;
    case ".gz":
      opts.transforms.push(createGunzip());
      break;
    case ".tgz":
      tempDir = getTempDestDir();
      opts.transforms.push(createGunzip(), extract(tempDir, { strip: 1 }));
      opts.tempDir = tempDir;
      break;
    case ".enc":
      const encArgs = args as InstallEncryptedArgs;
      opts.transforms.push(decryptor(encArgs.password));
      break;
    default:
      return;
  }
}

async function installFromTarball(
  scriptPath: string,
  opts: TarballPipelineOpts
): Promise<void> {
  await pipeline([fs.createReadStream(scriptPath), ...opts.transforms]);
  await finalizeTempDirInstallation(opts.tempDir);
}

async function finalizeTempDirInstallation(tempDir: string) {
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
    const destFinalDir = path.join(getLocalScriptsRepoDir(), scriptId);

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
