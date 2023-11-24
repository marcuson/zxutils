import { camelCase, mapKeys } from "lodash-es";
import minimist from "minimist";
import { chalk, fs, os } from "zx";
import { StepConfig } from "../step/step-config.js";
import { Step } from "../step/step.js";
import { CommonScriptArgs } from "./common-script-args.js";
import { ScriptOptions, fillDefaultScriptOptions } from "./script-options.js";
import { logIndent } from "./utils.js";

const stepRegFile = "track.log";

async function loadStepTrackFile(
  isEnabled: boolean,
  prefix: string
): Promise<Set<string>> {
  if (!isEnabled) {
    return new Set<string>();
  }

  const regExists = await fs.exists(prefix + "." + stepRegFile);
  if (!regExists) {
    return new Set<string>();
  }

  const regEntries = await fs.readFile(prefix + "." + stepRegFile, "utf-8");
  const registry = new Set<string>(regEntries.split("\n"));
  return registry;
}

async function writeStepTrackFile(
  isEnabled: boolean,
  prefix: string,
  registry: Set<string>
): Promise<void> {
  if (!isEnabled) {
    return;
  }

  const content = [...registry].join("\n");
  await fs.writeFile(prefix + "." + stepRegFile, content, "utf-8");
}

function getCommonArgs(): CommonScriptArgs {
  // FIXME: Use commander?
  const miniArgs = minimist(process.argv.slice(2), {
    boolean: ["zxu-enable-step-tracking"],
    default: {
      "zxu-from-step": 0,
      "zxu-enable-step-tracking": false,
    },
  });
  const commonArgs = mapKeys(miniArgs, (_value, key) => {
    if (key.startsWith("zxu-") || key.startsWith("-")) {
      return camelCase(key.replace("zxu-", ""));
    }

    return key;
  }) as CommonScriptArgs;
  return commonArgs;
}

export async function start(
  scriptName: string,
  stepConfigs: StepConfig[],
  options?: Partial<ScriptOptions>
): Promise<void> {
  console.log(chalk.cyan(`Running script '${scriptName}'.`));
  console.log(chalk.cyan(`OS platform: '${os.platform()}'.`));
  console.log(chalk.cyan(`OS release: '${os.release()}'.\n`));

  const commonArgs = getCommonArgs();
  const opts = fillDefaultScriptOptions(options);

  const reg = await loadStepTrackFile(opts.enableStepTracking, scriptName);

  const steps = stepConfigs.map((x) => new Step(x));

  for (let stepIdx = commonArgs.fromStep; stepIdx < steps.length; stepIdx++) {
    const step = steps[stepIdx];
    console.log(chalk.cyan(`#${stepIdx}: Start step '${step.name}'.`));

    await logIndent(1, async () => {
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

        await writeStepTrackFile(opts.enableStepTracking, scriptName, reg);
        process.exit(1);
      }
    });

    console.log(chalk.cyan(`#${stepIdx}: Step '${step.name}' completed.\n`));
  }

  await writeStepTrackFile(opts.enableStepTracking, scriptName, reg);
}
