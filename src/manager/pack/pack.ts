import { pipeline } from "stream/promises";
import { $, fs, path } from "zx";
import { encryptor } from "../crypto/crypto.utils.js";
import { PackArgs } from "./pack-args.js";

export async function pack(opts: PackArgs): Promise<void> {
  const targetDir = "pack";

  await fs.remove(targetDir);
  await fs.ensureDir(targetDir);
  await $`npm pack --pack-destination=${targetDir}`;

  if (!opts.password) {
    return;
  }

  const packedFile = (await fs.readdir(targetDir)).find((x) =>
    x.endsWith(".tgz")
  );

  if (!packedFile) {
    throw new Error("Cannot find packed script!");
  }

  const packedFilePath = path.join(targetDir, packedFile);
  await pipeline(
    fs.createReadStream(packedFilePath),
    encryptor(opts.password),
    fs.createWriteStream(packedFilePath + ".enc")
  );

  await fs.remove(packedFilePath);
}
