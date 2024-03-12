#!/usr/bin/env node

import { Command } from "commander";
import { args } from "../manager/args.js";
import { InstallArgs } from "../manager/install/install-args.js";
import { install } from "../manager/install/install.js";
import { list } from "../manager/list.js";
import { PackArgs } from "../manager/pack/pack-args.js";
import { pack } from "../manager/pack/pack.js";
import { run } from "../manager/run.js";
import { version } from "../manager/version.js";

const cli = new Command();

cli.enablePositionalOptions(true);

cli
  .command("version")
  .alias("v")
  .action(async (_options, _command) => {
    return version();
  });

cli
  .command("pack")
  .option(
    "-p, --password <password>",
    "Password used to encrypt file. If not passed, file will be unencrypted.",
    undefined
  )
  .action(async (options, _command) => {
    return pack(options as PackArgs);
  });

cli
  .command("install")
  .alias("i")
  .option(
    "-p, --password <password>",
    "Password to use to decrypt file (if necessary).",
    undefined
  )
  .argument("<script path>")
  .action(async (scriptPath, options, _command) => {
    return install(scriptPath as string, options as InstallArgs);
  });

cli
  .command("list")
  .alias("ls")
  .action(async (_options, _command) => {
    return list();
  });

cli.command("args").action(async (_options, _command) => {
  return args();
});

cli
  .command("run")
  .passThroughOptions(true)
  .action(async (_options, _command) => run());

await cli.parseAsync(process.argv);
