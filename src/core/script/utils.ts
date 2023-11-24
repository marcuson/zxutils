import { $, LogEntry, os } from "zx";

export async function logIndent(spaces: number, fn: () => Promise<void>) {
  const oriConsoleLog = console.log;
  const ori$Log = $.log;

  const spacesPrefix = " ".repeat(spaces * 2 - 1);
  console.log = (message?: any, ...optionalParams: any[]) => {
    oriConsoleLog(spacesPrefix, message, ...optionalParams);
  };
  $.log = (entry: LogEntry) => {
    let shouldWriteSpaces = true;

    switch (entry.kind) {
      case "cmd":
      case "stdout":
      case "stderr":
        shouldWriteSpaces = entry.verbose;
        break;
      case "cd":
      case "custom":
      case "fetch":
      case "retry":
      default:
        break;
    }

    if (shouldWriteSpaces) {
      process.stdout.write(spacesPrefix + " ");
    }

    ori$Log(entry);
  };

  await fn();

  console.log = oriConsoleLog;
  $.log = ori$Log;
}

export function isOsPlatformAnyOf(supportedOs: NodeJS.Platform[]) {
  return supportedOs.includes(os.platform());
}
