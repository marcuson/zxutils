import jszip from "jszip";
import { fs, path } from "zx";

export async function extractZip(archiveFile: jszip, targetDir: string) {
  Object.values(archiveFile.files).forEach(async (file) => {
    const fullpath = path.join(targetDir, file.name);

    if (file.dir) {
      await fs.ensureDir(fullpath);
      return;
    }

    const buff = await file.async("nodebuffer");
    await fs.writeFile(fullpath, buff);
  });
}
