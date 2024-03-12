export interface StepConfigArgs {
  name: string;
  inputFn: () => Promise<string>;
}

export interface StepConfig {
  name: string;
  enabled?: boolean;
  args: StepConfigArgs[];
  runFn: () => Promise<void>;
}
