import { fs } from "zx";

export async function version(): Promise<void> {
  const packageJsonFile = new URL("../../package.json", import.meta.url);

  const packageJson = JSON.parse(await fs.readFile(packageJsonFile, "utf-8"));
  console.log(packageJson.version);
}
