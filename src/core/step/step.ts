import { StepConfig } from "./step-config.js";

export class Step {
  constructor(private cfg: StepConfig) {}

  get name(): string {
    return this.cfg.name;
  }

  get isEnabled(): boolean {
    return this.cfg.enabled === undefined || this.cfg.enabled;
  }

  async run(): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    return this.cfg.runFn();
  }
}
