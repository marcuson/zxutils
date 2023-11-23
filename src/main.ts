import { run } from "./core/runner.js";
import { ScriptOptions } from "./core/script-options.js";
import { Step } from "./core/step/step.js";
import { StepConfig } from "./index.js";

export async function start(
  scriptName: string,
  stepConfigs: StepConfig[],
  options?: Partial<ScriptOptions>
) {
  const steps = stepConfigs.map((x) => new Step(x));
  run(scriptName, steps, options);
}
