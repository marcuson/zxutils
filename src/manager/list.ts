import { getInstalledScripts } from "./utils.js";

export async function list(): Promise<void> {
  const res = await getInstalledScripts();

  res.forEach((x) => {
    console.log(x.scriptId);
  });
}
