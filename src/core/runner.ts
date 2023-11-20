import { chalk, fs, os } from "zx";
import { Step } from "./step/step.js";
import { consoleIndent } from "./utils.js";

const stepRegFile = "track.log";

async function loadStepTrackFile(prefix: string): Promise<Set<string>> {
  const regExists = await fs.exists(prefix + "." + stepRegFile);
  if (!regExists) {
    return new Set<string>();
  }

  const regEntries = await fs.readFile(prefix + "." + stepRegFile, "utf-8");
  const registry = new Set<string>(regEntries.split("\n"));
  return registry;
}

async function writeStepTrackFile(
  prefix: string,
  registry: Set<string>
): Promise<void> {
  const content = [...registry].join("\n");
  await fs.writeFile(prefix + "." + stepRegFile, content, "utf-8");
}

export async function run(scriptName: string, steps: Step[]): Promise<void> {
  console.log(chalk.cyan(`Running script '${scriptName}'.`));
  console.log(chalk.cyan(`OS platform: '${os.platform()}'.`));
  console.log(chalk.cyan(`OS release: '${os.release()}'.\n`));

  const reg = await loadStepTrackFile(scriptName);

  for (const step of steps) {
    console.log(chalk.cyan(`Start step '${step.name}'.`));

    await consoleIndent(1, async () => {
      try {
        if (reg.has(step.name)) {
          console.log(
            chalk.yellow(`Step '${step.name}' already completed, skipping it.`)
          );
          return;
        }

        if (!step.isEnabled) {
          console.log(
            chalk.yellow(`Step '${step.name}' is disabled, skipping it.`)
          );
          return;
        }

        await step.run();
        reg.add(step.name);
      } catch (error) {
        console.log(
          chalk.red(`There was an error during '${step.name}' step execution.`)
        );
        console.log(chalk.red(error));

        await writeStepTrackFile(scriptName, reg);
        process.exit(1);
      }
    });

    console.log(chalk.cyan(`Step '${step.name}' completed.\n`));
  }

  await writeStepTrackFile(scriptName, reg);
}
