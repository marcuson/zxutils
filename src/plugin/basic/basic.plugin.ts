import { $, chalk, fs, os, path, question } from "zx";
import { isOsPlatformAnyOf } from "../../core/script/utils.js";
import { ZxPlugin, createPlugin } from "../zx-plugin.js";

interface AskForRebootOptions {
  timeoutMin?: number;
  defaultChoice?: "y" | "n";
}

const defaultAskForRebootOptions: Partial<AskForRebootOptions> = {
  timeoutMin: 1,
  defaultChoice: "y",
};

class BasicPluginClz implements ZxPlugin {
  name = "Basic";

  isCurrentOsSupported(): boolean {
    return isOsPlatformAnyOf(["win32", "linux"]);
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

  async copyFile(fileSource: string, fileTarget: string): Promise<void> {
    console.log(`Copy file '${fileSource}' to '${fileTarget}'.`);
    await this.createDirIfNotExist(path.dirname(fileTarget));
    await fs.copy(fileSource, fileTarget);
    console.log(chalk.green(`Copy file finished.`));
  }

  async askForReboot(options?: AskForRebootOptions): Promise<void> {
    const opts = { ...defaultAskForRebootOptions, ...options };
    const choices = opts.defaultChoice === "y" ? "[y]/n" : "y/[n]";
    const response = await question(`Do you want to restart now? ${choices}: `);
    const actualResponse = response ?? opts.defaultChoice;

    switch (actualResponse) {
      case "n":
        return;
      case undefined:
      case "y":
      default:
        if (os.platform() === "win32") {
          await $`shutdown /r /T ${opts.timeoutMin * 60}`;
        } else {
          await $`sudo reboot +${opts.timeoutMin} "PC is going to reboot in ${opts.timeoutMin} minute(s)."`;
        }
        process.exit(0);
    }
  }
}

export const BasicPlugin = createPlugin(BasicPluginClz);
