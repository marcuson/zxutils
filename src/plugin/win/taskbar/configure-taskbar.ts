import { $, chalk } from "zx";
import { ConfigureTaskbarOptions } from "./configure-taskbar-options.js";

export async function configureTaskbarInternal(
  opts: ConfigureTaskbarOptions
): Promise<void> {
  if (opts.searchBar !== undefined) {
    await $`reg add HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Search /v SearchboxTaskbarMode /t REG_DWORD /d ${opts.searchBar} /f`;
  }

  if (opts.showWidget !== undefined) {
    await $`reg add HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced /v TaskbarDa /t REG_DWORD /d ${
      opts.showWidget ? "1" : "0"
    } /f`;
  }

  console.log(chalk.green("Taskbar configured."));
}
