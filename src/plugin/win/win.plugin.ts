import { $, chalk, fs } from "zx";
import { isOsPlatformAnyOf } from "../../core/script/utils.js";
import { $useContext, $usePowershell } from "../../core/utils/cmd.utils.js";
import { BasicPlugin } from "../basic/basic.plugin.js";
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
    const res =
      await $`reg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v EnableLUA /t REG_DWORD`.nothrow();
    const isEnabled = /0x1/.test(res.stdout) || !/0x0/.test(res.stdout);

    if ((isEnabled && enabled) || (!isEnabled && !enabled)) {
      console.log(chalk.green("UAC already in right state."));
      return;
    }

    await this
      .runAsAdmin`reg add HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v EnableLUA /t REG_DWORD /d ${
      enabled ? "1" : "0"
    } /f`;

    console.log(chalk.green("UAC state changed."));
    console.log(
      chalk.bgYellow(
        "IMPORTANT: you need to restart your PC for changes to UAC to take effect!"
      )
    );
    await BasicPlugin.askForReboot();
  }

  async classicRightClickMenu(enable: boolean) {
    if (enable) {
      await this
        .runAsAdmin`reg add 'HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32' /f /ve`;
    } else {
      await this
        .runAsAdmin`reg delete 'HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32' /f /ve`;
    }

    console.log(chalk.green("Right click menu changed."));
  }

  async runAsAdmin(
    pieces: TemplateStringsArray,
    ...args: any[]
  ): Promise<void> {
    await $useContext(async () => {
      $usePowershell();

      const cmdExtractor = $(pieces, ...args);
      const escapedCmd = (cmdExtractor as any)._command;
      (cmdExtractor as any)._command =
        "echo 'Running command \"" + escapedCmd + "\" as admin.'";
      await cmdExtractor;

      await $`Start-Process powershell -Wait -Verb runAs ${escapedCmd}`;
    });
  }

  async runAsPowershell(
    pieces: TemplateStringsArray,
    ...args: any[]
  ): Promise<void> {
    await $useContext(async () => {
      $usePowershell();
      await $(pieces, ...args);
    });
  }

  async createShortcut(target: string, linkPath: string) {
    const alreadyExists = await fs.exists(linkPath);
    if (alreadyExists) {
      console.log(chalk.yellow("Link already exist, skipping."));
      return;
    }

    await this.runAsPowershell`$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut(${linkPath})
$Shortcut.TargetPath = ${target}
$Shortcut.Save()`;
  }

  async addToPath(dir: string) {
    await this.runAsPowershell`function Add-Path {
  param(
    [Parameter(Mandatory, Position=0)]
    [string] $LiteralPath,
    [ValidateSet('User', 'CurrentUser', 'Machine', 'LocalMachine')]
    [string] $Scope 
  )
      
  Set-StrictMode -Version 1; $ErrorActionPreference = 'Stop'

  $isMachineLevel = $Scope -in 'Machine', 'LocalMachine'
  if ($isMachineLevel -and -not $($ErrorActionPreference = 'Continue'; net session 2>$null)) { throw "You must run AS ADMIN to update the machine-level Path environment variable." }  

  $regPath = 'registry::' + ('HKEY_CURRENT_USER\\Environment', 'HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Control\\Session Manager\\Environment')[$isMachineLevel]

  # Note the use of the .GetValue() method to ensure that the *unexpanded* value is returned.
  $currDirs = (Get-Item -LiteralPath $regPath).GetValue('Path', '', 'DoNotExpandEnvironmentNames') -split ';' -ne ''
      
  if ($LiteralPath -in $currDirs) {
    Write-Verbose "Already present in the persistent $(('user', 'machine')[$isMachineLevel])-level Path: $LiteralPath"
    return
  }

  $newValue = ($currDirs + $LiteralPath) -join ';'

  # Update the registry.
  Set-ItemProperty -Type ExpandString -LiteralPath $regPath Path $newValue
      
  # Broadcast WM_SETTINGCHANGE to get the Windows shell to reload the
  # updated environment, via a dummy [Environment]::SetEnvironmentVariable() operation.
  $dummyName = [guid]::NewGuid().ToString()
  [Environment]::SetEnvironmentVariable($dummyName, 'foo', 'User')
  [Environment]::SetEnvironmentVariable($dummyName, [NullString]::value, 'User')

  # Finally, also update the current session's $env:Path definition.
  # Note: For simplicity, we always append to the in-process *composite* value,
  #        even though for a -Scope Machine update this isn't strictly the same.
  $env:Path = ($env:Path -replace ';$') + ';' + $LiteralPath

  Write-Verbose "\`"$LiteralPath\`" successfully appended to the persistent $(('user', 'machine')[$isMachineLevel])-level Path and also the current-process value."
}
    
Add-Path ${dir}`;

    console.log(chalk.green("Env var PATH updated."));
  }
}

export const WinPlugin = createPlugin(WinPluginClz);
