import { $, quotePowerShell } from "zx";

export async function $useContext(fn: () => Promise<void>) {
  const oriShell = $.shell;
  const oriPrefix = $.prefix;
  const oriQuote = $.quote;

  await fn();

  $.shell = oriShell;
  $.prefix = oriPrefix;
  $.quote = oriQuote;
}

export async function $usePowershell() {
  $.shell = "powershell";
  $.prefix = "";
  $.quote = quotePowerShell;
}
