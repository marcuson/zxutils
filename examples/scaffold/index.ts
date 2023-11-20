import { BasicPlugin, StepConfig, start } from "@marcuson/zxutils";

const steps: StepConfig[] = [
  {
    name: "Step 1",
    runFn: async () => {
      console.log("This is step 1.");
    },
  },
  {
    name: "Step 2",
    runFn: async () => {
      BasicPlugin.echo("This is step 2.");
    },
  },
];

start("scaffold", steps);
