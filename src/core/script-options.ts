export interface ScriptOptions {
  enableStepTracking: boolean;
  startFromStep: number;
}

const defaultScriptOptions: ScriptOptions = {
  enableStepTracking: false,
  startFromStep: 0,
};

export function fillDefaultScriptOptions(
  options?: Partial<ScriptOptions>
): ScriptOptions {
  const res = { ...defaultScriptOptions, ...options };
  return res;
}
