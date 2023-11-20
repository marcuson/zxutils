import { os } from "zx";

export async function consoleIndent(spaces: number, fn: () => Promise<void>) {
  const oriLog = console.log;

  console.log = (message?: any, ...optionalParams: any[]) => {
    oriLog(" ".repeat(spaces * 2), message, ...optionalParams);
  };

  await fn();

  console.log = oriLog;
}

export function isOsPlatformAnyOf(supportedOs: NodeJS.Platform[]) {
  return supportedOs.includes(os.platform());
}
