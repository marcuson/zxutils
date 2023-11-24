import { chalk, fs } from "zx";
import { isOsPlatformAnyOf } from "../../core/script/utils.js";
import { ZxPlugin, createPlugin } from "../zx-plugin.js";

class BasicPluginClz implements ZxPlugin {
  name = "Basic";

  isCurrentOsSupported(): boolean {
    return isOsPlatformAnyOf(["win32"]);
  }

  async echo(text: string): Promise<void> {
    console.log(text);
  }

  async createDirIfNotExist(dir: string): Promise<void> {
    console.log(`Create dir '${dir}'.`);
    const exists = await fs.exists(dir);
    if (exists) {
      console.log(chalk.yellow(`Dir '${dir} already exists, skipping.`));
      return;
    }

    await fs.ensureDir(dir);
    console.log(chalk.green(`Dir '${dir}' created.`));
  }

  async copyDir(dirSource: string, dirTarget: string): Promise<void> {
    console.log(`Copy dir '${dirSource}' to '${dirTarget}'.`);
    await fs.copy(dirSource, dirTarget);
    console.log(chalk.green(`Copy dir finished.`));
  }
}

export const BasicPlugin = createPlugin(BasicPluginClz);
