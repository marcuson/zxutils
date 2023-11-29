#!/usr/bin/env node

import { Command } from "commander";
import { InstallArgs } from "../manager/install/install-args.js";
import { install } from "../manager/install/install.js";
import { list } from "../manager/list.js";
import { PackArgs } from "../manager/pack/pack-args.js";
import { pack } from "../manager/pack/pack.js";
import { run } from "../manager/run.js";

const cli = new Command();

cli.enablePositionalOptions(true);

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
    return install(scriptPath, options as InstallArgs);
  });

cli
  .command("list")
  .alias("ls")
  .action(async (options, _command) => {
    return list();
  });

cli
  .command("run")
  .passThroughOptions(true)
  .action(async (_options, _command) => run());

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

await cli.parseAsync(process.argv);
