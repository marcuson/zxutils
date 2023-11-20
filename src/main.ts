import { run } from "./core/runner.js";
import { Step } from "./core/step/step.js";
import { StepConfig } from "./index.js";

export async function start(scriptName: string, stepConfigs: StepConfig[]) {
  const steps = stepConfigs.map((x) => new Step(x));
  run(scriptName, steps);
}
