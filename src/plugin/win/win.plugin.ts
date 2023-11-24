import { $, quotePowerShell } from "zx";
import { isOsPlatformAnyOf } from "../../core/script/utils.js";
import { ZxPlugin, createPlugin } from "../zx-plugin.js";
import { EnableDesktopIconsOptions } from "./desktop-icons/enable-desktop-icons-opts.js";
import { enableDesktopIconsInternal } from "./desktop-icons/enable-desktop-icons.js";
import { EnsureUNCConnectionOptions } from "./ensure-unc-connection/ensure-unc-connection-options.js";
import { ensureUNCConnectionInternal } from "./ensure-unc-connection/ensure-unc-connection.js";
import { ConfigureTaskbarOptions } from "./taskbar/configure-taskbar-options.js";
import { configureTaskbarInternal } from "./taskbar/configure-taskbar.js";

class WinPluginClz implements ZxPlugin {
  name = "Win";

  isCurrentOsSupported(): boolean {
    return isOsPlatformAnyOf(["win32"]);
  }

  async enableDesktopIcons(opts: EnableDesktopIconsOptions): Promise<void> {
    return enableDesktopIconsInternal(opts);
  }

  async configureTaskbar(opts: ConfigureTaskbarOptions): Promise<void> {
    return configureTaskbarInternal(opts);
  }

  async ensureUNCConnection(opts: EnsureUNCConnectionOptions): Promise<void> {
    return ensureUNCConnectionInternal(opts);
  }

  async setUACStatus(enabled: boolean): Promise<void> {
    await this
      .runAsAdmin`reg add HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v EnableLUA /t REG_DWORD /d ${
      enabled ? "1" : "0"
    } /f`;
  }

  async runAsAdmin(
    pieces: TemplateStringsArray,
    ...args: any[]
  ): Promise<void> {
    const oriShell = $.shell;
    $.shell = "powershell";

    const cmdExtractor = $(pieces, ...args);
    const escapedCmd = (cmdExtractor as any)._command;
    (cmdExtractor as any)._command =
      "echo 'Running command \"" + escapedCmd + "\" as admin.'";
    await cmdExtractor;

    await $`Start-Process powershell -Verb runAs "-NoExit -NoProfile -ExecutionPolicy Bypass -Command ${escapedCmd}"`;

    $.shell = oriShell;
  }
}

export const WinPlugin = createPlugin(WinPluginClz);
