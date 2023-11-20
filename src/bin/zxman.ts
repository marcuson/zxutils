import { Command } from "commander";

const cli = new Command();

cli
  .command("install")
  .alias("i")
  .action(async () => {
    console.error("Not implemented yet.");
  });

cli.command("run").action(async () => {
  process.argv = ["", ""].concat(...process.argv.slice(3));
  await import("zx/cli");
});

await cli.parseAsync(process.argv);
