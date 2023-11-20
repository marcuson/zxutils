export interface StepConfig {
  name: string;
  enabled?: boolean;
  runFn: () => Promise<void>;
}
