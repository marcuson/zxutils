import { $, ProcessOutput, chalk } from "zx";
import { EnableDesktopIconsOptions } from "./enable-desktop-icons-opts.js";

async function regAddClassic(
  id: string,
  enable: boolean
): Promise<ProcessOutput> {
  return $`reg add HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\HideDesktopIcons\\ClassicStartMenu /v ${id} /t REG_DWORD /d ${
    enable ? "0" : "1"
  } /f`;
}

async function regAddNewPanel(
  id: string,
  enable: boolean
): Promise<ProcessOutput> {
  return $`reg add HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\HideDesktopIcons\\NewStartPanel /v ${id} /t REG_DWORD /d ${
    enable ? "0" : "1"
  } /f`;
}

export async function enableDesktopIconsInternal(
  opts: EnableDesktopIconsOptions
): Promise<void> {
  if (opts.controlPanel !== undefined) {
    const controlPanelId = "{5399E694-6CE5-4D6C-8FCE-1D8870FDCBA0}";
    await regAddClassic(controlPanelId, opts.controlPanel);
    await regAddNewPanel(controlPanelId, opts.controlPanel);
  }

  if (opts.network !== undefined) {
    const networkId = "{F02C1A0D-BE21-4350-88B0-7367FC96EF3C}";
    await regAddClassic(networkId, opts.network);
    await regAddNewPanel(networkId, opts.network);
  }

  if (opts.recycleBin !== undefined) {
    const recycleBinId = "{645FF040-5081-101B-9F08-00AA002F954E}";
    await regAddClassic(recycleBinId, opts.recycleBin);
    await regAddNewPanel(recycleBinId, opts.recycleBin);
  }

  if (opts.thisPc !== undefined) {
    const thisPcId = "{20D04FE0-3AEA-1069-A2D8-08002B30309D}";
    await regAddClassic(thisPcId, opts.thisPc);
    await regAddNewPanel(thisPcId, opts.thisPc);
  }

  if (opts.userFiles !== undefined) {
    const userFilesId = "{59031a47-3f72-44a7-89c5-5595fe6b30ee}";
    await regAddClassic(userFilesId, opts.userFiles);
    await regAddNewPanel(userFilesId, opts.userFiles);
  }

  console.log(chalk.green("Desktop icons enabled/disabled."));
}
